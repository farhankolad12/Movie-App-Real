const inputMovie = document.getElementById("input-search");
const API_KEY = "a882cd90b5686d2f11c0927963ade7b5";
const BASE_URL = "https://image.tmdb.org/t/p/original";
const trendingBody = document.querySelector(".trending");
const recommandedBody = document.querySelector(".recommand");
const inputKey = document.getElementById("input-search");
const form = document.getElementById("form");
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

const getTrending = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
  );
  const data1 = await res.json();
  const data = data1.results;
  let output = "";
  data.forEach((movie) => {
    output += `<div class="trending-body">
    <div class="bookmark-img">
            <i class="bi bi-bookmark"></i>
          </div>
          <img src="${
            movie.poster_path ? BASE_URL + movie.poster_path : "./test.jpg"
          }" alt="Trending" class="trending-img" />
          <span class="year">${
            movie.first_air_date == undefined
              ? getYear(movie.release_date)
              : getYear(movie.first_air_date)
          }</span>
          <span class="type">
            <i class="bi bi-${
              movie.release_date ? "film" : "tv"
            } tv-show"></i> ${movie.release_date ? "Movie" : "Tv Series"}
          </span>
          <span class="rated">${movie.adult ? "18+" : "PG"}</span>
          <h3 class="name">${
            movie.name ? rangeStr(movie.name) : rangeStr(movie.original_title)
          }</h3>
        </div>`;
  });
  trendingBody.innerHTML = output;
  saveBookmarkItemBefore();
};

const getRecommanded = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
  );
  const data1 = await res.json();
  const data = data1.results;
  let output = "";
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
          <i class="bi bi-film recommand-film"></i>&nbsp;&nbsp;
          <span class="type">Movie</span>&nbsp;&nbsp;
          <span class="rated"> ${movie.adult == true ? "18+" : "PG"} </span>
          <h3 class="name">${rangeStr(movie.original_title)}</h3>
        </div>`;
  });
  recommandedBody.innerHTML = output;
  saveBookmarkItemBefore();
};

const searchMovieTv = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${inputKey.value}&page=1`
  );
  const data1 = await res.json();
  const data = data1.results;
  trendingBody.innerHTML = "";
  document.getElementById("trend-heading").innerHTML = "";
  document.getElementById("recommand-heading").innerHTML = `<p>
  Found ${data.length} Results for "${inputKey.value}"
  </p>`;
  trendingBody.style.height = "0";
  let output = "";
  data.forEach((movie) => {
    output += `<div class="recommand-body">
          <div class="bookmark-img-recommand">
            <i class="bi bi-bookmark"></i>
          </div>
          <img src="${
            movie.poster_path ? BASE_URL + movie.poster_path : "./test.jpg"
          }" alt="recommand" class="recommand-img-1" /><br />
          <span class="year">${
            movie.first_air_date === undefined
              ? getYear(movie.release_date)
              : getYear(movie.first_air_date)
          }</span>&nbsp;&nbsp;
          <i class="bi bi-${
            movie.media_type == "tv" ? "tv" : "film"
          } recommand-film"></i>&nbsp;&nbsp;
          <span class="type">${movie.media_type}</span>&nbsp;&nbsp;
          <span class="rated"> ${movie.adult == true ? "18+" : "PG"} </span>
          <h3 class="name">${
            movie.name ? rangeStr(movie.name) : rangeStr(movie.original_title)
          }</h3>
        </div>`;
  });
  recommandedBody.innerHTML = output;
  saveBookmarkItemBefore();
  addedBookmarkRemoved();
};

getTrending();
getRecommanded();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchMovieTv();
});

function addedBookmarkRemoved() {
  const addedBookmark = localStorage.getItem("bookmarkItem").split(",");
  for (i = 0; i < recommandedBody.childElementCount; i++) {
    for (j = 0; j < addedBookmark.length; j++) {
      if (addedBookmark[j] == recommandedBody.childNodes[i].innerHTML) {
        recommandedBody.childNodes[i].remove();
      }
    }
  }
  for (i = 0; i < trendingBody.childElementCount; i++) {
    for (j = 0; j < addedBookmark.length; j++) {
      if (addedBookmark[j] == trendingBody.childNodes[i].innerHTML) {
        trendingBody.childNodes[i].remove();
      }
    }
  }
}
setTimeout(() => {
  addedBookmarkRemoved();
}, 1000);
