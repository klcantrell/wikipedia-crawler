function View() {
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
    let userInput = dom.searchBar.value;
    dom.searchBar.value = '';
    dom.searchControls.classList.add('wiki-crawler__search-controls--hidden');
    renderProgressIcon()
      .then(() => {
        controller.executeSearch(userInput);
      });
  }

  function renderSearchResults(searchResults) {
    searchResults.forEach((searchResult) => {
      const resultEl = document.createElement('ARTICLE');
      const resultContent = html`
        <h1>${searchResult.title}</h1>
      `;
      resultEl.innerHTML = resultContent;
      dom.resultsItems.appendChild(resultEl);
    })
  }

  function renderProgressIcon() {
    return new Promise((resolve) => {
      dom.progressIcon.classList.add('wiki-crawler__search-in-progress-icon--spin-and-fade-out')
      setTimeout(() => {
        resolve();
      }, 1000)
    })
  }

  function bindEvents() {
    dom.enterBtn.addEventListener('click', whenEnterBtnClicked);
    dom.exitBtn.addEventListener('click', whenExitBtnClicked);
    dom.goBtn.addEventListener('click', whenGoBtnClicked);
  }

  return {
    init() {
      dom.cache();
      bindEvents();
    },
    renderSearchResults
  }
}

function Controller() {
  const deps = {};

  function formatUserSearch(input) {
    return input.split(" ").join("+");
  }

  return {
    init(model, view) {
      deps.model = model;
      deps.view = view;
      deps.view.init();
    },
    executeSearch(userInput) {
      let query = formatUserSearch(userInput);
      deps.model.makeWikipediaRequest(query)
        .then((results) => {
          deps.view.renderSearchResults(results);
        });
    }
  }
}

function Model() {
  return {
    makeWikipediaRequest(userQuery) {
      const url = `https://7k1zglj62f.execute-api.us-east-2.amazonaws.com/v0/wikipedia-crawl/${userQuery}`;
      let data;
      return axios.get(url)
        .then((res) => {
          return res.data.query.search;
        });
    }
  }
}

const controller = Controller(),
      view = View(controller),
      model = Model();

controller.init(model, view);

// UTILITIES
function html(literals, ...customs) {
  let result = '';
  customs.forEach((custom, i) => {
    let lit = literals[i];
    if (Array.isArray(custom)) {
      custom = custom.join('');
    }
    result += lit;
    result += custom;
  });
  result += literals[literals.length - 1];
  return result;
}
