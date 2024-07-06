import { View } from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  /**
   * Adds an event listener to the pagination parent element to handle click events.
   * When a pagination button is clicked, it retrieves the page number from the button's data attribute
   * and calls the provided handler function with the page number as its argument.
   *
   * @param {Function} handler - The function to be called when a pagination button is clicked.
   *                              It should accept a single argument: the page number to go to.
   */
  addHandlerPagination(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    // Only 1 page or there are no pages
    if (this._data.numPages === 1 || !this._data.numPages) return '';

    // More than 1 page, it's the page 1
    if (this._data.currentPage === 1)
      return this._markupNext() + this._pageCount();

    // More than 1 page, it's the last page
    if (this._data.currentPage === this._data.numPages)
      return this._markupPrev() + this._pageCount();

    // On middle page
    return this._markup() + this._pageCount();
  }

  // Markup to display previous button
  _markupPrev() {
    return `
          <button data-goto="${
            this._data.currentPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.currentPage - 1}</span>
          </button>
    `;
  }

  // Markup to display next button
  _markupNext() {
    return `
          <button data-goto="${
            this._data.currentPage + 1
          }" class="btn--inline   pagination__btn--next">
            <span>Page ${this._data.currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;
  }

  // Markup to display both previous and next buttons
  _markup() {
    return this._markupPrev() + this._markupNext();
  }

  // Markup to display page count
  _pageCount() {
    return `
    <div class="page__count">
      <text>Page ${this._data.currentPage} of ${this._data.numPages}</text>
    </div>
    `;
  }
}

export default new PaginationView();
