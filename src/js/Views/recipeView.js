import { View } from './View.js';
import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';

class RecipeView extends View {
  _parentEl = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe! Please try another one.';
  _successMessage = '';

  /**
   * Registers an event handler for rendering the recipe view on specific window events.
   * This method listens for the 'hashchange' and 'load' events on the window object,
   * ensuring that the recipe view is rendered whenever the URL hash changes (indicating
   * a new recipe should be displayed) or when the page is first loaded.
   *
   * @param {Function} handler - The callback function to execute when the events occur.
   *
   */
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  // Updating the number of servings
  addHandlerServing(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return;

      const updateTo = +btn.dataset.updateTo;
      if (updateTo > 0) handler(updateTo);
    });
  }

  // Add/Remove bookmarks
  addHandlerBookmarks(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  // Delete recipe
  addHandlerDelete(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--delete');
      if (!btn) return;
      handler();
    });
  }

  // Markup for rendering recipe
  _generateMarkup() {
    return /*HTML*/ `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="Tomato" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button data-update-to="${
            this._data.servings - 1
          }" class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button data-update-to="${
            this._data.servings + 1
          }" class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__info">
        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        <button class="btn--round btn--delete ${
          this._data.key ? '' : 'hidden'
        }">
          <svg class="">
            <use href="${icons}#icon-delete"></use>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
    ${this._data.ingredients.map(this._ingredientMarkup).join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceURL}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
`;
  }
  //   Generates the markup for a single ingredient to be displayed in the recipe view.
  _ingredientMarkup(ingredient) {
    return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                ingredient.quantity
                  ? fracty(ingredient.quantity).toString()
                  : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.description}
              </div>
            </li>
    `;
  }
}

export default new RecipeView();
