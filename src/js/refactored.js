function View() {
  const dom = {
    rootEl: document.getElementById('wiki-crawler'),
    cache() {
      this.enterBtn = this.rootEl.querySelector('.js_wiki-crawler__enter-btn');
      this.searchBtns = this.rootEl.querySelector('.js_wiki-crawler__search-btns');
      this.exitBtn = this.rootEl.querySelector('.js_wiki-crawler__exit-btn');
      this.goBtn = this.rootEl.querySelector('.js_wiki-crawler__go-btn');
      this.searchControls = this.rootEl.querySelector('.js_wiki-crawler__search-controls');
      this.results = this.rootEl.querySelector('.js_wiki-crawler__results');
    }
  };

  function whenEnterBtnClicked() {
    dom.enterBtn.classList.add('wiki-crawler__enter-btn--hidden');
    dom.searchBtns.classList.remove('wiki-crawler__search-btns--hidden');
  }

  function whenExitBtnClicked() {
    dom.enterBtn.classList.remove('wiki-crawler__enter-btn--hidden');
    dom.searchBtns.classList.add('wiki-crawler__search-btns--hidden');
  }

  function whenSearchBtnClicked() {
    dom.searchControls.classList.add('wiki-crawler__search-controls--hidden');
    controller.executeSearch();
  }

  function renderSearchResults(data) {
    let resultsContent = html`
       <p>${data}</p>
    `;
    dom.results.innerHTML = resultsContent;
  }

  function bindEvents() {
    dom.enterBtn.addEventListener('click', whenEnterBtnClicked);
    dom.exitBtn.addEventListener('click', whenExitBtnClicked);
    dom.goBtn.addEventListener('click', whenSearchBtnClicked);
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
  return {
    init(model, view) {
      deps.model = model;
      deps.view = view;
      deps.view.init();
    },
    executeSearch() {
      let data = deps.model.makeWikipediaRequest();
      deps.view.renderSearchResults(data);
    }
  }
}

function Model() {
  return {
    makeWikipediaRequest() {
      return 'DATA';
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
