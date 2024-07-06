import { View } from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query! please try another one.';
  _successMessage = '';

  // Generating markup for search results via the preview view
  _generateMarkup() {
    return this._data
      .map(result => previewView._generateMarkup(result))
      .join('');
  }
}

export default new ResultsView();
