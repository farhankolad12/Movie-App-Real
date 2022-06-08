const tvBody = document.querySelector(".tv");
const inputValue = document.getElementById("input-search");
const API_KEY = "a882cd90b5686d2f11c0927963ade7b5";
const BASE_URL = "https://image.tmdb.org/t/p/original";
const nxtBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
let currentPage = 1;
let bookmarkItemArr = [localStorage.getItem("bookmarkItem")];

function isEmpty(str) {
  return !str || str.length === 0;
}

const getYearForFirst = (str) => {
  let year = "";
  if (isEmpty(str)) {
    return;
  }
  for (i = 0; i < str.length; i++) {
    if (str[i] !== "-") {
      year += str[i];
    }
    if (str[i] === "-") {
      break;
    }
  }
  return year;
};

const getYear = (str) => {
  let year = "";
  if (isEmpty(str)) {
    return "Dont Know";
  }
  for (i = 0; i < str.length; i++) {
    if (str[i] !== "-") {
      year += str[i];
    }
    if (str[i] === "-") {
      break;
    }
  }
  return year;
};

const getYearForRelease = (str) => {
  let year = "";
  if (isEmpty(str)) {
    return;
  }
  for (i = 0; i < str.length; i++) {
    if (str[i] !== "-") {
      year += str[i];
    }
    if (str[i] === "-") {
      break;
    }
  }
  return year;
};

function rangeStr(str) {
  if (str.length > 15) {
    return `${str.slice(0, 15)}...`;
  } else {
    return str;
  }
}

function saveBookmarkItem(e) {
  if (e.target.classList.contains("bi-bookmark-fill")) {
    const removeFromLocalStrorage = localStorage.getItem("bookmarkItem");
    const removeFromLocalStrorageArr = removeFromLocalStrorage.split(",");
    for (i = 0; i < removeFromLocalStrorageArr.length; i++) {
      if (
        removeFromLocalStrorageArr[i] ==
        e.target.parentElement.parentElement.innerHTML
      ) {
        removedBookmark.push(removeFromLocalStrorageArr[i]);
        removeFromLocalStrorageArr[i] = null;
      }
    }
    localStorage.setItem("bookmarkItem", removeFromLocalStrorageArr);
    e.target.classList.remove("bi-bookmark-fill");
    e.target.classList.add("bi-bookmark");
  } else if (e.target.classList.contains("bi-bookmark")) {
    bookmarkItemArr.push(e.target.parentElement.parentElement.innerHTML);
    localStorage.setItem("bookmarkItem", bookmarkItemArr);
    e.target.classList.remove("bi-bookmark");
    e.target.classList.toggle("bi-bookmark-fill");
  }
}

function saveBookmarkItemBefore() {
  const bookmarkBtn = document.querySelectorAll(".bi-bookmark");
  bookmarkBtn.forEach((book) => {
    book.addEventListener("click", (e) => saveBookmarkItem(e));
  });
}

function addedBookmarkRemoved() {
  const addedBookmark = localStorage.getItem("bookmarkItem").split(",");
  for (i = 0; i < tvBody.childElementCount; i++) {
    for (j = 0; j < addedBookmark.length; j++) {
      if (addedBookmark[j] == tvBody.childNodes[i].innerHTML) {
        tvBody.childNodes[i].remove();
      }
    }
  }
}

const getTv = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&query=${inputValue.value}&page=${currentPage}`
  );
  const data1 = await res.json();
  const data = data1.results;
  console.log(data1);
  let output = "";
  if (data1.total_pages == 1) {
    prevBtn.style.visibility = "hidden";
    nxtBtn.style.visibility = "hidden";
  } else {
    nxtBtn.style.visibility = "visible";
    prevBtn.style.visibility = "visible";
  }
  if (data1.page > 1) {
    prevBtn.style.visibility = "visible";
  }
  if (inputValue.value == "") {
    document.querySelector(".number").innerHTML = "";
    moviesBody.innerHTML = output;
    nxtBtn.style.visibility = "hidden";
    prevBtn.style.visibility = "hidden";
  } else {
    document.querySelector(
      ".number"
    ).innerHTML = `<h3>${data.length} Results found for "${inputValue.value}"</h3>`;
    data.forEach((movie) => {
      output += `<div class="recommand-body">
          <div class="bookmark-img-recommand">
            <i class="bi bi-bookmark"></i>
          </div>
          <img src="${
            movie.poster_path ? BASE_URL + movie.poster_path : "./test.jpg"
          }" alt="recommand" class="recommand-img-1" /><br />
          <span class="year">${
            movie.first_air_date == undefined
              ? getYearForRelease(movie.release_date)
              : getYearForFirst(movie.first_air_date)
          }</span>&nbsp;&nbsp;
          <i class="bi bi-tv recommand-film"></i>&nbsp;&nbsp;
          <span class="type">Tv Series</span>&nbsp;&nbsp;
          <span class="rated"> ${movie.adult == true ? "18+" : "PG"} </span>
          <h3 class="name">${rangeStr(movie.original_name)}</h3>
        </div>`;
    });
    tvBody.innerHTML = output;
    saveBookmarkItemBefore();
    addedBookmarkRemoved();
    nxtBtn.style.visibility = "visible";
  }
};

const nextPage = async () => {
  prevBtn.style.visibility = "visible";
  currentPage = currentPage + 1;
  const res = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&query=${inputValue.value}&page=${currentPage}`
  );
  const data1 = await res.json();
  const data = data1.results;
  console.log(data1);
  console.log(currentPage);
  let output = "";
  if (currentPage == data1.total_pages) {
    nxtBtn.style.visibility = "hidden";
  }
  if (inputValue.value == "") {
    document.querySelector(".number").innerHTML = "";
    tvBody.innerHTML = output;
    nxtBtn.style.visibility = "hidden";
    prevBtn.style.visibility = "hidden";
  } else {
    document.querySelector(
      ".number"
    ).innerHTML = `<h3>${data.length} Results found for "${inputValue.value}"</h3>`;
    data.forEach((movie) => {
      output += `<div class="recommand-body">
          <div class="bookmark-img-recommand">
            <i class="bi bi-bookmark"></i>
          </div>
          <img src="${
            movie.poster_path ? BASE_URL + movie.poster_path : "./test.jpg"
          }" alt="recommand" class="recommand-img-1" /><br />
          <span class="year">${
            movie.first_air_date == undefined
              ? getYearForRelease(movie.release_date)
              : getYearForFirst(movie.first_air_date)
          }</span>&nbsp;&nbsp;
          <i class="bi bi-tv recommand-film"></i>&nbsp;&nbsp;
          <span class="type">Tv Series</span>&nbsp;&nbsp;
          <span class="rated"> ${movie.adult == true ? "18+" : "PG"} </span>
          <h3 class="name">${rangeStr(movie.original_name)}</h3>
        </div>`;
    });
    tvBody.innerHTML = output;
    saveBookmarkItemBefore();
    addedBookmarkRemoved();
  }
};

const prevPage = async () => {
  nxtBtn.style.visibility = "visible";
  currentPage = currentPage - 1;
  const res = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&query=${inputValue.value}&page=${currentPage}`
  );
  const data1 = await res.json();
  const data = data1.results;
  console.log(data1);
  console.log(currentPage);
  let output = "";
  if (data1.page == 1) {
    prevBtn.style.visibility = "hidden";
  }
  if (inputValue.value == "") {
    document.querySelector(".number").innerHTML = "";
    tvBody.innerHTML = output;
    prevBtn.style.visibility = "hidden";
  } else {
    document.querySelector(
      ".number"
    ).innerHTML = `<h3>${data.length} Results found for "${inputValue.value}"</h3>`;
    data.forEach((movie) => {
      output += `<div class="recommand-body">
          <div class="bookmark-img-recommand">
            <i class="bi bi-bookmark"></i>
          </div>
          <img src="${
            movie.poster_path ? BASE_URL + movie.poster_path : "./test.jpg"
          }" alt="recommand" class="recommand-img-1" /><br />
          <span class="year">${
            movie.first_air_date == undefined
              ? getYearForRelease(movie.release_date)
              : getYearForFirst(movie.first_air_date)
          }</span>&nbsp;&nbsp;
          <i class="bi bi-tv recommand-film"></i>&nbsp;&nbsp;
          <span class="type">Tv Series</span>&nbsp;&nbsp;
          <span class="rated"> ${movie.adult == true ? "18+" : "PG"} </span>
          <h3 class="name">${rangeStr(movie.original_name)}</h3>
        </div>`;
    });
    tvBody.innerHTML = output;
    saveBookmarkItemBefore();
    addedBookmarkRemoved();
  }
};

inputValue.addEventListener("input", getTv);
nxtBtn.addEventListener("click", () => {
  nextPage();
});

prevBtn.addEventListener("click", () => {
  prevPage();
});
