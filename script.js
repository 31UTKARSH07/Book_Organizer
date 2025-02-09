// 📌 Google Books API ka URL
const API_URL = "https://www.googleapis.com/books/v1/volumes?q=harrypotter";

//  DOM elements ko select kar rahe hain
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const readingShelf = document.getElementById("reading");
const finishedShelf = document.getElementById("finished");
const wishlistShelf = document.getElementById("wishlist");
const recommendationsSection = document.querySelector(".recommend-list");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

//  Page load hote hi LocalStorage se books load karna
document.addEventListener("DOMContentLoaded", loadBooksFromStorage);

//  Search button dabane par books dhoondhna ke liye
searchBtn.addEventListener("click", () => {
    const query = searchBar.value.trim();
    if (query !== "") {
        searchBooks(query);
    }
});

//  Google Books API se books dhoondhne ka function
function searchBooks(query) {
    fetch(API_URL + query)// yaha query me likhi hui book api me call hoegi..
        .then((response) => {
            const d = response.json();
            console.log(d);
            return d;

        })
        .then(data => displaySearchResults(data.items))
        .catch(error => console.error("Error fetching books:", error));
}

//  Search results ko show karne ka function
function displaySearchResults(books) {
    recommendationsSection.innerHTML = ""; // Purane results hatao
    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        bookCard.innerHTML = `<img src="${bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192'}" alt="${bookInfo.title}">
            <h4>${bookInfo.title}</h4>
            <p>${bookInfo.authors?.join(", ") || "Unknown Author"}</p>
            <button onclick="addBook('${bookInfo.title}', '${bookInfo.imageLinks?.thumbnail || ''}')">Add to Library</button>`;

        recommendationsSection.appendChild(bookCard);
    });
}

//  "Want to Read" shelf me book add karne ka function
function addBook(title, image) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book-item");
    bookElement.innerHTML = `
        <img src="${image || 'https://via.placeholder.com/128x192'}" alt="${title}">
        <p>${title}</p>
        <button onclick="moveBook(this, 'reading')">📖 Start Reading</button>
        <button onclick="removeBook(this)">❌ Remove</button>
    `;

    wishlistShelf.appendChild(bookElement);
    saveLibraryData();
}

//  Books ko ek shelf se doosri shelf me move karne ka function
function moveBook(button, shelfName) {
    const bookElement = button.parentElement;
    button.remove(); // Purana button hatao

    if (shelfName === "reading") {
        bookElement.innerHTML += `<button onclick="moveBook(this, 'finished')">✅ Mark as Finished</button>`;
        readingShelf.appendChild(bookElement);
    } else if (shelfName === "finished") {
        finishedShelf.appendChild(bookElement);
        updateProgress(); // Progress bar update karo
    }

    saveLibraryData();
}

//  Book remove karne ka function
function removeBook(button) {
    button.parentElement.remove();
    saveLibraryData();
}

//  Reading progress update karne ka function
function updateProgress() {
    const totalBooks = document.querySelectorAll(".book-item").length;
    const finishedBooks = finishedShelf.children.length;

    if (totalBooks > 0) {
        const progress = Math.round((finishedBooks / totalBooks) * 100);
        progressBar.value = progress;
        progressText.innerText = `${progress}%`;
    }
}

//  Library ka data LocalStorage me save karna
function saveLibraryData() {
    const libraryData = {
        reading: readingShelf.innerHTML,
        finished: finishedShelf.innerHTML,
        wishlist: wishlistShelf.innerHTML
    };
    localStorage.setItem("library", JSON.stringify(libraryData));
}

//  Page reload hone par LocalStorage se books load karna
function loadBooksFromStorage() {
    const savedData = JSON.parse(localStorage.getItem("library"));
    if (savedData) {
        readingShelf.innerHTML = savedData.reading;
        finishedShelf.innerHTML = savedData.finished;
        wishlistShelf.innerHTML = savedData.wishlist;
    }
}
