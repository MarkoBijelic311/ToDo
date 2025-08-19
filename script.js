(() => console.log("Sajt pokrenut!"))();
const createBook = (title) => ({ title, read: false, year: 2000 + Math.floor(Math.random() * 25) });
let books = [];
document.getElementById("addBook").addEventListener("click", () => {
  const input = document.getElementById("bookInput");
  if (input.value.trim() !== "") {
    books.push(createBook(input.value));
    input.value = "";
    renderBooks();
    analyzeBooks();
  }
});
const renderBooks = () => {
  const list = document.getElementById("bookList");
  list.innerHTML = "";
  books.forEach((book, i) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-white shadow p-2 rounded";
    li.innerHTML = `
      <span class="${book.read ? 'line-through text-gray-500' : ''} ${book.highlight ? 'bg-yellow-100' : ''}">
        ${book.title} (${book.year})
      </span>
      <div>
        <button onclick="toggleBook(${i})" class="text-green-600 mr-2">✔</button>
        <button onclick="deleteBook(${i})" class="text-red-600">✖</button>
      </div>
    `;
    list.appendChild(li);
  });
};
const processBooks = (callback) => books.map(callback);
const toggleBook = (i) => {
  books = processBooks((book, index) => (i === index ? { ...book, read: !book.read } : book));
  renderBooks();
  analyzeBooks();
};
const toggleReadAll = () => {
  const allRead = books.every(b => b.read);
  books = processBooks(book => ({ ...book, read: !allRead }));
  renderBooks();
  analyzeBooks();
};
const highlightLongTitles = () => {
  books = processBooks(book => {
    if (book.title.length > 15) return { ...book, highlight: true };
    else return { ...book, highlight: false };
  });
  renderBooks();
};
const deleteBook = (i) => {
  books = books.filter((_, index) => index !== i);
  renderBooks();
  analyzeBooks();
};
const countChars = (arr, i = 0) =>
  i >= arr.length ? 0 : arr[i].title.length + countChars(arr, i + 1);
const countReadBooksRecursive = (arr, i = 0) => 
  i >= arr.length ? 0 : (arr[i].read ? 1 : 0) + countReadBooksRecursive(arr, i + 1);
const countLettersRecursive = (arr, i = 0) =>
  i >= arr.length ? 0 : (arr[i].read ? arr[i].title.length : 0) + countLettersRecursive(arr, i + 1);
const analyzeBooks = () => {
  const total = books.length;
  const read = books.filter(b => b.read).length;
  const unread = total - read;
  const avgLength = total > 0 ? (books.reduce((sum, b) => sum + b.title.length, 0) / total).toFixed(2) : 0;
  const hasLongTitle = books.some(b => b.title.length > 20);
  const allRead = books.every(b => b.read);
  const firstUnread = books.find(b => !b.read)?.title || "Sve su pročitane 🎉";
  const sortedByYear = [...books].sort((a,b) => a.year - b.year).map(b => b.title);
  const letters = books.flatMap(b => b.title.split(""));
  const allTitles = books.map(b => b.title).reduce((acc, cur) => acc.concat(" | ", cur), "");
  const totalChars = countChars(books);
  const readCountRecursive = countReadBooksRecursive(books);
  const lettersInRead = countLettersRecursive(books);
  document.getElementById("analysis").innerText =
    `Ukupno knjiga: ${total}
Pročitano: ${read}, Nepročitano: ${unread}
Prosečna dužina naslova: ${avgLength}
Postoji dugačak naslov (>20 slova): ${hasLongTitle}
Sve pročitane: ${allRead}
Prva nepročitana: ${firstUnread}
Sortirane po godini: ${sortedByYear.join(", ")}
Broj karaktera (rekurzija): ${totalChars}
Broj pročitanih knjiga (rekurzija): ${readCountRecursive}
Slova u pročitanim knjigama (rekurzija): ${lettersInRead}
Ukupno slova (flatMap): ${letters.length}
Spisak svih naslova: ${allTitles}`;
};
