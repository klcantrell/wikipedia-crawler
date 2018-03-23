export default function Controller() {
  const deps = {};

  function formatUserSearch(input) {
    return input.split(" ").join("+");
  }

  function formatSnippet(searchResultData) {
    let spanTagsRegExp = /<\/*[^>]*>/;
    return searchResultData.snippet
      .split(spanTagsRegExp)
      .filter((item) => {
        return item ? !item.match(/^\s$/) : false;
      })
      .join('')
      .split(' ')
      .slice(0, 12)
      .join(' ')
      .concat('...');
  }

  function formatLink(searchResultData) {
    const linkTag = searchResultData.title.split(' ').join('_');
    return `https://en.wikipedia.org/wiki/${linkTag}`;
  }

  return {
    init({model, view}) {
      deps.model = model;
      deps.view = view;
      deps.view.init();
    },
    executeSearch(userInput) {
      return new Promise((resolve) => {
        let query = formatUserSearch(userInput);
        if (query) {
          deps.model.makeWikipediaRequest(query)
            .then((results) => {
              if(results.length > 0) {
                return deps.view.renderSearchResults(results);
              } else {
                return deps.view.renderError();
              }
            })
            .then(() => {
              resolve();
            })
            .catch(() => {
              deps.view.renderError('servererror')
                .then(() => {
                  resolve();
                });
            });
        } else {
          deps.view.renderError('noresults')
            .then(() => {
              resolve();
            });
        }
      });
    },
    formatSearchResultData(searchResultData) {
      return {
        title: searchResultData.title,
        snippet: formatSnippet(searchResultData),
        link: formatLink(searchResultData)
      }
    }
  }
}
