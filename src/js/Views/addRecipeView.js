import { View } from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _successMessage = 'Your recipe was successfully uploaded.';

  _numIngs = 1;
  _formRender = false;

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowModal();
    this._addHandlerHideModal();
  }

  /**
   * Adds an event listener for the 'submit' event on the parent element, which is the form element.
   * When the form is submitted, it will call the provided handler function with the form data.
   * @param {function} handler - the function to call when the form is submitted
   */
  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  // If form is not rendered, renders the form and displays the window
  toggleWindow() {
    // Check if the form is already rendered, if not, render it by inserting the form's HTML markup
    if (!this._formRender)
      this._parentEl.insertAdjacentHTML('afterbegin', this._generateMarkup());
    this._formRender = true;

    // Make the window and overlay visible by removing the 'hidden' class
    this._window.classList.remove('hidden');
    this._overlay.classList.remove('hidden');
  }

  // Hides the form window, does not clear the form
  hideWindow() {
    this._window.classList.add('hidden');
    this._overlay.classList.add('hidden');
  }

  // Hides (kills) the window and clears the form
  killWindow() {
    this.hideWindow();

    this._numIngs = 1;
    this._clear();
    this._formRender = false;
  }

  // Handler method to display the window
  _addHandlerShowModal() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    this._numIngs = 1;
  }

  // Handler method to hide/kill the window
  _addHandlerHideModal() {
    this._btnClose.addEventListener('click', this.killWindow.bind(this));

    this._overlay.addEventListener('click', this.hideWindow.bind(this));
  }

  // Adds an ingredient field to the Dom
  addIngredient() {
    const markup = this._addIngMarkup();
    if (this._numIngs === 10) return;
    this._parentEl
      .querySelector('.ingredients')
      .insertAdjacentHTML('beforeend', markup);
    this._numIngs++;
  }

  // Handler method to add an ingredient field to the Dom
  addHandlerAddIng(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn_add');
      if (!btn) return;
      handler();
    });
  }

  // Removes an ingredient field from the Dom
  removeIngredient(label, inputFields) {
    if (this._numIngs === 1) return;

    this._parentEl.querySelector('.ingredients').removeChild(inputFields);
    this._parentEl.querySelector('.ingredients').removeChild(label);
    this._numIngs--;
  }

  // Handler method to remove an ingredient field from the Dom
  addHandlerRemoveIng(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn_remove');
      if (!btn) return;
      const children = document.querySelector('.ingredients').children;
      const label = children[children.length - 2];
      const inputFields = children[children.length - 1];
      handler(label, inputFields);
    });
  }

  // Markup for upload recipe form
  _generateMarkup() {
    return /* HTML */ `
      <div class="upload__column">
        <h3 class="upload__heading">Recipe data</h3>
        <label>Title</label>
        <input value="" required name="title" type="text" />
        <label>URL</label>
        <input value="" required name="sourceUrl" type="text" />
        <label>Image URL</label>
        <input value="" required name="image" type="text" />
        <label>Publisher</label>
        <input value="" required name="publisher" type="text" />
        <label>Prep time</label>
        <input value="" required name="cookingTime" type="number" />
        <label>Servings</label>
        <input value="" required name="servings" type="number" />
      </div>
      <div class="upload__column ingredients">
        <h3 class="upload__heading">Ingredients</h3>
        <label>Ingredient 1</label>
        <div class="input-fields">
          <input
            type="number"
            step=".01"
            name="ingredient-1-1"
            placeholder="Quantity"
          />
          <input type="text" name="ingredient-1-2" placeholder="Unit" />
          <input
            type="text"
            required
            name="ingredient-1-3"
            placeholder="Description"
          />
        </div>
      </div>

      <div class="upload__toggle-ings">
        <button
          type="button"
          title="Remove ingredient"
          class="btn_ing btn_remove"
        >
          <svg class="">
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button type="button" title="Add ingredient" class="btn_ing btn_add">
          <svg class="">
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>

      <button class="btn upload__btn">
        <svg>
          <use href="${icons}#icon-upload-cloud"></use>
        </svg>
        <span>Upload</span>
      </button>
    `;
  }

  // Markup for adding an ingredient
  _addIngMarkup() {
    return `
          <label>Ingredient ${this._numIngs + 1}</label>
          <div class="input-fields">
            <input
              type="number"
              step=".01"
              name="ingredient-${this._numIngs + 1}-1"
              placeholder="Quantity"
            />
            <input
              type="text"
              name="ingredient-${this._numIngs + 1}-2"
              placeholder="Unit"
            />
            <input
              type="text"
              required
              name="ingredient-${this._numIngs + 1}-3"
              placeholder="Description"
            />
          </div>
    `;
  }
}

export default new AddRecipeView();
