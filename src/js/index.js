var searchContainer = document.getElementById("searchContainer");
var searchIcon = document.getElementById("searchIcon");
var searchBar = document.getElementById("searchBar");
var searchButtons = document.getElementById("searchButtons");
var searchExit = document.getElementById("searchExit");
var searchEnter = document.getElementById("searchEnter");
var randomIcon = document.getElementById("randomIcon");
var resultsContainer = document.getElementById("resultsContainer");
var resultsExit = document.getElementById("resultsExit");
var error = document.getElementById("error");
var searchTitles = {};
var searchItemIds = {};

randomIcon.addEventListener("click", randomPage);
searchIcon.addEventListener("click", hideSearchIcon);
searchIcon.addEventListener("click", revealSearchButtons);
searchExit.addEventListener("click", revealSearchIcon);
searchExit.addEventListener("click", hideSearchButtons);
searchBar.addEventListener("keydown", searchMaker);
searchEnter.addEventListener("click", searchMaker);
resultsExit.addEventListener("click", resetSearch);

function randomPage() {
  window.open("https://en.wikipedia.org/wiki/Special:Random");
}

function hideSearchIcon() {
  searchIcon.style.opacity = "0";
  searchIcon.style.display = "none";
  searchBar.style.display = "block";
  searchBar.focus();
  setTimeout(function() {
    searchBar.style.opacity = "1";}, 1);
}

function revealSearchIcon() {
  searchBar.style.opacity = "0";
  setTimeout(function() {
    searchBar.style.display = "none";
    searchIcon.style.display = "block";
    setTimeout(function() {
      searchIcon.style.opacity = "1";
    }, 20);
  }, 700);
}

function revealSearchButtons() {
    searchButtons.style.display = "block";
    setTimeout(function() {
      searchButtons.style.opacity = "1";}, 50);
}

function hideSearchButtons() {
    searchButtons.style.opacity = "0";
    setTimeout(function() {
      searchButtons.style.display = "none";}, 700);
}

function revealResultsExit() {
    resultsExit.style.display = "block";
    setTimeout(function() {
      resultsExit.style.opacity = "1";}, 700);
}

function hideResultsExit() {
    resultsExit.style.opacity = "0";
    setTimeout(function() {
      resultsExit.style.display = "none";}, 700);
}

function searchMaker(e) {
   if (e.code === "Enter") {
     wikiRequest(querifySearch(searchBar.value));
     hideSearch(e);
     resultsContainer.style.opacity = "1";
   } else if (e.button === 0) {
     wikiRequest(querifySearch(searchBar.value));
     hideSearch(e);
     resultsContainer.style.opacity = "1";
   }
}

function hideSearch(e) {
  searchContainer.style.opacity = "0";
  hideSearchButtons();
  setTimeout(function() {
    searchContainer.style.visibility = "hidden";}, 300);
    if (e.target.id === "searchEnter" || e.target.id === "searchBar") {
      randomIcon.style.opacity = "0";
      setTimeout(function() {
        randomIcon.style.visibility = "hidden";}, 800);
  }
}

function revealRandomIcon() {
  randomIcon.style.visibility = "initial";
  setTimeout(function() {
    randomIcon.style.opacity = "1";}, 20);
}

function hideError() {
  error.style.opacity = "0";
  setTimeout(function(){
    error.style.visibility = "hidden";}, 1000);
}

function revealError() {
  error.style.visibility = "initial";
  setTimeout(function(){
    error.style.opacity = "1";}, 10);
}

function resetResults() {
  searchBar.value = "";
  resultsContainer.style.opacity = "0";
  resultsExit.style.opacity = "0";
  setTimeout(function() {
    for (var i = 1; i < 11; i++) {
      var child = document.getElementById("item" + i);
      if (resultsContainer.contains(child)) {
        resultsContainer.removeChild(child);
      }
    }
  }, 500);
}

function querifySearch(search) {
  var querified = search.split(" ");
  querified = querified.join("+");
  return querified;
}

function wikiRequest(searchQuerified) {
  var request = document.createElement('script');
  request.setAttribute("src", "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=&list=search&callback=createSearchItems&srsearch=" + searchQuerified);
  document.head.appendChild(request);
}

function createSearchItems(e) {
  if (e.hasOwnProperty("error")) {
    throwError();
  } else if (e.query.search.length === 0) {
    throwError();
  } else {
    var i = 0;
    itemCreationLoop(e, i);
  }
}

function itemCreationLoop(e, i) {
  setTimeout(function() {
    searchTitles["search" + (i + 1)] = e.query.search[i].title;
    searchItemIds["search" + (i + 1)] = "item" + (i + 1);
    var resultsElement = document.createElement('P');
    resultsElement.className = "resultsElements";
    resultsElement.id = searchItemIds["search" + (i + 1)];
    resultsElement.innerHTML = searchTitles["search" + (i + 1)];
    resultsContainer.insertBefore(resultsElement, resultsExit);
    setTimeout(function() {
      document.getElementById("item" + (i + 1)).style.opacity = "1";
      i++;
      if (i < e.query.search.length) {
        itemCreationLoop(e, i);
      }
    }, 50);
  }, 300);
  if (i === e.query.search.length - 1) {
    revealResultsExit(); 
    makeEventListeners(e);
  }
}

function resetSearch() {
  searchContainer.style.visibility = "initial";
  setTimeout(function() {
    setTimeout(function(){
      searchContainer.style.opacity = "1";
      revealSearchIcon();
      revealRandomIcon();
    }, 700);
    resetResults();
    hideError();}, 10);
}

function throwError() {
  revealError();
  revealResultsExit();
}

function makeEventListeners(e) {
  setTimeout(function() {
    for (var x = 1; x < e.query.search.length + 1; x++) {
      var id = document.getElementById("item" + x);
      id.addEventListener("click", makeLink);
      id.addEventListener("mousedown", changeBackground);
      id.addEventListener("mouseup", returnBackground);
      id.addEventListener("mouseover", changeBackground);
      id.addEventListener("mouseout", returnBackground);
    }
  }, 301);
}

function makeLink(e) {
  var linkTitle = e.target.innerHTML;
  linkTitle = linkTitle.split(" ");
  linkTitle = linkTitle.join("_");
  window.open("https://en.wikipedia.org/wiki/" + linkTitle);
}

function changeBackground(e) {
  e.target.style.background = "grey";
}

function returnBackground(e) {
  e.target.style.background = "white";
}