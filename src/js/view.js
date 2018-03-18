import { html } from './utils';

export default function View(controller) {
  const dom = {
    rootEl: document.getElementById('wiki-crawler'),
    cache() {
      this.enterBtn = this.rootEl.querySelector('.js_wiki-crawler__enter-btn');
      this.searchBtns = this.rootEl.querySelector('.js_wiki-crawler__search-btns');
      this.exitBtn = this.rootEl.querySelector('.js_wiki-crawler__exit-btn');
      this.goBtn = this.rootEl.querySelector('.js_wiki-crawler__go-btn');
      this.searchControls = this.rootEl.querySelector('.js_wiki-crawler__search-controls');
      this.searchBar = this.rootEl.querySelector('.js_wiki-crawler__search-bar');
      this.resultsSection = this.rootEl.querySelector('.js_wiki-crawler__results');
      this.resultsItems = this.rootEl.querySelector('.js_wiki-crawler__results-items');
      this.progressIcon = this.rootEl.querySelector('.js_wiki-crawler__search-in-progress-icon');
      this.returnBtn = this.rootEl.querySelector('.js_wiki-crawler__return-btn');
    }
  };

  function whenEnterBtnClicked() {
    dom.enterBtn.classList.add('wiki-crawler__enter-btn--hidden');
    dom.searchBtns.classList.remove('wiki-crawler__search-btns--hidden');
    dom.searchBar.classList.remove('wiki-crawler__search-bar--hidden');
  }

  function whenExitBtnClicked() {
    dom.enterBtn.classList.remove('wiki-crawler__enter-btn--hidden');
    dom.searchBtns.classList.add('wiki-crawler__search-btns--hidden');
    dom.searchBar.classList.add('wiki-crawler__search-bar--hidden');
  }

  function whenGoBtnClicked() {
    whenUserInitiatesSearch();
  }

  function whenReturnKeyPressedOnInput(e) {
    if (e.which === 13) {
      whenUserInitiatesSearch();
    }
  }

  function whenReturnBtnClicked() {
    destroySearchResults()
      .then(() => {
        dom.searchControls.classList.remove('wiki-crawler__search-controls--hidden');
        dom.returnBtn.classList.add('wiki-crawler__return-btn--hidden');
      });
  }

  function whenUserInitiatesSearch() {
    let userInput = dom.searchBar.value;
    dom.searchBar.value = '';
    dom.searchControls.classList.add('wiki-crawler__search-controls--hidden');
    renderProgressIcon()
      .then(() => {
        return controller.executeSearch(userInput);
      })
      .then(() => {
        dom.returnBtn.classList.remove('wiki-crawler__return-btn--hidden');
      });
  }

  function renderSearchResults(searchResults) {
    dom.resultsSection.classList.remove('wiki-crawler__results--hidden');
    return new Promise((resolve) => {
      let promiseChain = Promise.resolve();
      for (let searchResult of searchResults) {
        promiseChain = promiseChain.then(() => {
          return createSearchResultElement(searchResult)
            .then((element) => {
              fadeInSearchResultElement(element);
            });
        });
      }
      promiseChain = promiseChain.then(() => {
        return resolve();
      });
    })
  }

  function createSearchResultElement(searchResultData) {
    return new Promise((resolve) => {
      const itemData = controller.formatSearchResultData(searchResultData),
            content = resultContent(itemData),
            resultElShell = document.createElement('DIV');
      resultElShell.innerHTML = content;
      const resultEl = resultElShell.firstElementChild;
      dom.resultsItems.appendChild(resultEl);
      setTimeout(() => {
        resolve(resultEl);
      }, 100)
    });
  }

  function resultContent(searchResultData) {
    return html`
      <a href=${searchResultData.link}
         target="_blank"
         rel="noopener"
         class="wiki-crawler__result wiki-crawler__result--hidden">
        <h1 class="wiki-crawler__result-title">${searchResultData.title}</h1>
        <p class="wiki-crawler__result-snippet">${searchResultData.snippet}</p>
      </a>
    `;
  }

  function fadeInSearchResultElement(el) {
    el.classList.remove('wiki-crawler__result--hidden');
  }

  function renderProgressIcon() {
    return new Promise((resolve) => {
      dom.progressIcon.classList.add('wiki-crawler__search-in-progress-icon--spin-and-fade-out')
      setTimeout(() => {
        resolve();
      }, 1000)
    })
  }

  function destroySearchResults() {
    return fadeOutSearchResults()
      .then(() => {
        return removeResultEls();
      });
  }

  function fadeOutSearchResults() {
    return new Promise((resolve) => {
      dom.resultsSection.classList.add('wiki-crawler__results--hidden');
      dom.returnBtn.classList.remove('wiki-crawler__return-btn--hidden');
      setTimeout(() => {
        resolve();
      }, 1000);
    })
  }

  function removeResultEls() {
    return new Promise((resolve) => {
      while (dom.resultsItems.firstChild) {
        dom.resultsItems.removeChild(dom.resultsItems.firstChild);
      }
      resolve();
    });
  }

  function renderError() {
    let p = new Promise((resolve) => {
      dom.resultsSection.classList.remove('wiki-crawler__results--hidden');
      const noResultsShell = document.createElement('DIV');
      noResultsShell.innerHTML = html`
        <p class="wiki-crawler__no-results-msg wiki-crawler__no-results-msg--hidden">
          Your search returned no results.
          <br>
          <br>
          Please try another.
        </p>
      `;
      const noResultsEl = noResultsShell.firstElementChild;
      dom.resultsItems.appendChild(noResultsEl);
      setTimeout(() => {
        resolve(noResultsEl);
      }, 1000)
    });

    return p.then((el) => {
      el.classList.remove('wiki-crawler__no-results-msg--hidden');
    });
  }

  function bindEvents() {
    dom.enterBtn.addEventListener('click', whenEnterBtnClicked);
    dom.exitBtn.addEventListener('click', whenExitBtnClicked);
    dom.goBtn.addEventListener('click', whenGoBtnClicked);
    dom.returnBtn.addEventListener('click', whenReturnBtnClicked);
    dom.searchBar.addEventListener('keyup', whenReturnKeyPressedOnInput);
  }

  return {
    init() {
      dom.cache();
      bindEvents();
    },
    renderSearchResults,
    renderError
  }
}
