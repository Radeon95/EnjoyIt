import { View } from './View.js';
import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  _parentEl = '';

  /**
   * Generates the markup for a single result preview.
   
   * @param {Object} result - The result object containing data to be displayed.
   * @param {string} result.id - The unique identifier for the result.
   * @param {string} result.image - The URL to the result's image.
   * @param {string} result.title - The title of the result.
   * @param {string} result.publisher - The publisher of the result.
   * @param {boolean} [result.key] - Indicates if the result is user-generated content.
   * @returns {string} The HTML string for the result's preview markup.
   */
  _generateMarkup(result) {
    const id = window.location.hash.slice(1);
    return `
          <li class="preview">
            <a class="preview__link ${
              result.id === id ? 'preview__link--active' : ''
            }" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
                <div class="preview__user-generated ${
                  result.key ? '' : 'hidden'
                }">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>
    `;
  }
}

export default new PreviewView();
