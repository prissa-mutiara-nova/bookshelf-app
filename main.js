let books = [];

document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchForm");

  loadBooks();
  renderBooks();

  bookForm.addEventListener("submit", handleAddOrEditBook);
  searchForm.addEventListener("submit", handleSearchBook);

  document.body.addEventListener("click", (e) => {
    if (e.target.dataset.testid === "bookItemIsCompleteButton") toggleComplete(e);
    if (e.target.dataset.testid === "bookItemDeleteButton") deleteBook(e);
    if (e.target.dataset.testid === "bookItemEditButton") editBook(e);
  });
});

function handleAddOrEditBook(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = parseInt(document.getElementById("year").value);
  const isComplete = document.getElementById("isComplete").checked;
  const submitBtn = document.querySelector('[data-testid="bookFormSubmitButton"]');

  const editingId = submitBtn.dataset.editingId;

  if (editingId) {
    const index = books.findIndex(book => book.id == editingId);
    books[index] = { ...books[index], title, author, year, isComplete };
    delete submitBtn.dataset.editingId;
  } else {
    const newBook = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete
    };
    books.push(newBook);
  }

  e.target.reset();
  saveBooks();
  renderBooks();
}

function toggleComplete(e) {
  const id = Number(e.target.closest("[data-bookid]").dataset.bookid);
  const book = books.find(b => b.id === id);
  book.isComplete = !book.isComplete;
  saveBooks();
  renderBooks();
}

function deleteBook(e) {
  const id = Number(e.target.closest("[data-bookid]").dataset.bookid);
  books = books.filter(b => b.id !== id);
  saveBooks();
  renderBooks();
}

function editBook(e) {
  const id = Number(e.target.closest("[data-bookid]").dataset.bookid);
  const book = books.find(b => b.id === id);

  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("year").value = book.year;
  document.getElementById("isComplete").checked = book.isComplete;

  const submitBtn = document.querySelector('[data-testid="bookFormSubmitButton"]');
  submitBtn.dataset.editingId = book.id;
}

function handleSearchBook(e) {
  e.preventDefault();
  const query = document.getElementById("searchInput").value.toLowerCase();
  renderBooks(query);
}

function renderBooks(filter = "") {
  const incompleteEl = document.getElementById("incompleteBookshelf");
  const completeEl = document.getElementById("completeBookshelf");

  incompleteEl.innerHTML = "";
  completeEl.innerHTML = "";

  books
    .filter(book => book.title.toLowerCase().includes(filter))
    .forEach(book => {
      const bookEl = createBookElement(book);
      if (book.isComplete) {
        completeEl.appendChild(bookEl);
      } else {
        incompleteEl.appendChild(bookEl);
      }
    });
}

function createBookElement(book) {
  const bookEl = document.createElement("div");
  bookEl.dataset.bookid = book.id;
  bookEl.dataset.testid = "bookItem";

  const title = document.createElement("h3");
  title.textContent = book.title;
  title.dataset.testid = "bookItemTitle";

  const author = document.createElement("p");
  author.textContent = `Penulis: ${book.author}`;
  author.dataset.testid = "bookItemAuthor";

  const year = document.createElement("p");
  year.textContent = `Tahun: ${book.year}`;
  year.dataset.testid = "bookItemYear";

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  toggleBtn.dataset.testid = "bookItemIsCompleteButton";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Hapus Buku";
  deleteBtn.dataset.testid = "bookItemDeleteButton";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit Buku";
  editBtn.dataset.testid = "bookItemEditButton";

  const btnWrapper = document.createElement("div");
  btnWrapper.append(toggleBtn, deleteBtn, editBtn);

  bookEl.append(title, author, year, btnWrapper);
  return bookEl;
}

function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

function loadBooks() {
  const data = localStorage.getItem("books");
  if (data) books = JSON.parse(data);
}
