import { View } from './View.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search');

  // Listening for the search query
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });

    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  }

  // Getting the search query
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._parentEl.querySelector('.search__field').value = '';
    return query;
  }
}

export default new SearchView();
