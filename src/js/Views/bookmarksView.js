import { View } from './View.js';
import previewView from './previewView.js';

class PaginationView extends View {
  // The DOM element that will contain the pagination view.
  _parentEl = document.querySelector('.bookmarks');

  // Message to display when there are no bookmarks.
  _errorMessage = 'No bookmarks yet. Bookmark a recipe to save it for later!';

  // Generates the markup for the pagination view
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView._generateMarkup(bookmark))
      .join('');
  }

  addHandlerRenderBookmarks(handler) {
    window.addEventListener('load', handler);
  }
}

export default new PaginationView();
