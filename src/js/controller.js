import { async } from 'regenerator-runtime';
import 'core-js/actual';
import './queries.js';
import 'regenerator-runtime/runtime.js';
import { MODAL_CLOSE_SEC } from './configs.js';

import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import resultsView from './Views/resultsView.js';
import searchView from './Views/searchView.js';
import paginationView from './Views/paginationView.js';
import bookmarksView from './Views/bookmarksView.js';
import addRecipeView from './Views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './configs.js';

/**
 * Asynchronously controls the process of fetching and displaying a recipe based on the ID from the URL hash.
 * It first attempts to retrieve the recipe ID from the window's location hash. If an ID is present,
 * it proceeds to render a loading spinner, update the active recipe in both the results and bookmarks previews,
 * fetch the recipe data using the model's loadRecipe method, and finally render the fetched recipe.
 * If any part of this process fails, such as if the recipe cannot be loaded, it renders an error message.
 */
const controlRecipe = async function () {
  try {
    // Getting ID from the window
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Rendering loader
    recipeView.renderSpinner();

    // Update active recipe in results preview
    resultsView.update(
      model.getSearchResultsPage(model.state.search.currentPage)
    );

    // Update active recipe in bookmarks preview
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// Getting search results for a query
const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Render loader
    resultsView.renderSpinner();

    // Load search results from the API
    await model.loadSearchResults(query);

    // Render the results
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(err);
  }
};

// Rendering the appropriate pagination buttons
const controlPagination = function (goToPage) {
  // Render the new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render new pagination buttons
  paginationView.render(model.state.search);
};

// Updates the number of servings and ingredient quantity
const controlServing = function (numServings) {
  // Update ingredient quantity according to new number of servings
  model.updateServings(numServings);

  // Update the changes in recipe
  recipeView.update(model.state.recipe);
};

// Adds and removes bookmarks
const controlBookmarks = function () {
  // Add/Delete bookmarks
  model.toggleBookmark();

  // Update bookmark icon
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Rendering the bookmarks on page load
const controlRenderBookmarks = () =>
  bookmarksView.render(model.state.bookmarks);

// Adding a new ingredient input field
const controlAddIng = () => addRecipeView.addIngredient();

// Removing an ingredient input field
const controlRemoveIng = (label, inputFields) =>
  addRecipeView.removeIngredient(label, inputFields);

// Uploading a new recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // Render loader
    addRecipeView.renderSpinner();

    // Upload recipe to API
    await model.uploadRecipe(newRecipe);

    // Render uploaded recipe to view
    recipeView.render(model.state.recipe);

    // Render success message for upload
    addRecipeView.renderSuccessMessage();

    // Update hash in URL with current recipe
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Re-render bookmarks including new recipe
    bookmarksView.render(model.state.bookmarks);

    // Close upload form window
    setTimeout(() => addRecipeView.killWindow(), MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
    setTimeout(() => addRecipeView.killWindow(), MODAL_CLOSE_SEC * 1000);
  }
};

/**
 * Asynchronously controls the process of fetching and displaying a recipe based on the ID from the URL hash.
 * It first attempts to retrieve the recipe ID from the window's location hash. If an ID is present,
 * it proceeds to render a loading spinner, update the active recipe in both the results and bookmarks previews,
 * fetch the recipe data using the model's loadRecipe method, and finally render the fetched recipe.
 * If any part of this process fails, such as if the recipe cannot be loaded, it renders an error message.
 */
const controlDelete = async function () {
  try {
    await model.deleteRecipe();
    recipeView.renderSuccessMessage('Your recipe was successfully deleted.');

    // Removing the deleted recipe's hash from the URL
    history.pushState(
      '',
      document.title,
      window.location.pathname + window.location.search
    );

    // Updating the search results if they were displaying and affected
    if (model.state.search.query && model.state.recipe.index !== -1) {
      // If it was last recipe on the page, render previous page
      const page =
        model.state.search.currentPage >
        Math.ceil(
          model.state.search.results.length / model.state.search.resultsPerPage
        )
          ? model.state.search.currentPage - 1
          : model.state.search.currentPage;
      resultsView.render(model.getSearchResultsPage(page));
      paginationView.render(model.state.search);
    }
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRenderBookmarks(controlRenderBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServing(controlServing);
  recipeView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerDelete(controlDelete);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerAddIng(controlAddIng);
  addRecipeView.addHandlerRemoveIng(controlRemoveIng);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
