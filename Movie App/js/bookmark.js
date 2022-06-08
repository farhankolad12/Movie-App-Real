const bookmarkMovieBody = document.querySelector(".bookmarked-movies");
const bookmarkTvBody = document.querySelector(".bookmarked-tv");
const inputSearch = document.getElementById("input-search");

function getBookmarkedItems() {
  const bookmarkItem = localStorage.getItem("bookmarkItem");
  if (
    bookmarkItem == undefined ||
    bookmarkItem == null ||
    bookmarkItem === NaN
  ) {
    bookmarkMovieBody.innerHTML = `<h3>No Bookmark Added</h3>`;
  } else {
    let bookmarkItemArr = bookmarkItem.split(",");

    for (i = 0; i < bookmarkItemArr.length; i++) {
      if (bookmarkItemArr[i] == "") {
        continue;
      } else if (bookmarkItemArr[i].includes("bi-tv")) {
        bookmarkTvBody.innerHTML += `<div class="bookmark-movie-body">${bookmarkItemArr[i]}</div>`;
      } else {
        bookmarkMovieBody.innerHTML += `<div class="bookmark-movie-body">${bookmarkItemArr[i]}</div>`;
      }
    }
  }
}

function removeFromLocalStorage(e) {
  const bookmarkItem = localStorage.getItem("bookmarkItem");
  e.target.classList.remove("bi-x-lg");
  e.target.classList.add("bi-bookmark");
  let bookmarkItemArr = bookmarkItem.split(",");
  for (i = 0; i < bookmarkItemArr.length; i++) {
    if (bookmarkItemArr[i] == "") {
      continue;
    } else if (
      e.target.parentElement.parentElement.innerHTML == bookmarkItemArr[i]
    ) {
      bookmarkItemArr[i] = "";
      localStorage.setItem("bookmarkItem", bookmarkItemArr);
    }
  }
}

function removeBookmarkedItems() {
  const bookMark = document.querySelectorAll(".bi-bookmark");
  bookMark.forEach((book) => {
    book.classList.remove("bi-bookmark");
    book.classList.add("bi-x-lg");
  });
  const deleteItem = document.querySelectorAll(".bi-x-lg");
  deleteItem.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.target.parentElement.parentElement.remove();
      removeFromLocalStorage(e);
    });
  });
}

const searchBookmark = () => {
  const nameOfItem = document.querySelectorAll(".name");
  let output = "";
  if (inputSearch.value == "") {
    bookmarkMovieBody.innerHTML = "";
    bookmarkTvBody.innerHTML = "";
    getBookmarkedItems();
    removeBookmarkedItems();
  } else {
    nameOfItem.forEach((name) => {
      if (name.textContent.match(inputSearch.value)) {
        const matchDiv = name.parentElement;
        output += `<div class='bookmarked-movie-body'>${matchDiv.innerHTML}</div>`;
        console.log(output);
      }
    });
    bookmarkTvBody.innerHTML = "";
    bookmarkMovieBody.innerHTML = output;
  }
};

inputSearch.addEventListener("input", () => {
  searchBookmark();
});

getBookmarkedItems();
removeBookmarkedItems();
