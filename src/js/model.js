import { async } from 'regenerator-runtime';
import { AJAX, deleteJSON } from './helpers.js';
import { API_URL, KEY, RES_PER_PAGE } from './configs.js';

export const state = {
  recipe: {}, // Object to store the currently loaded recipe details
  search: {
    query: '', // The current search query string
    results: [], // Array of recipes recived for the query
    currentPage: 1, // Default search results page
    resultsPerPage: RES_PER_PAGE, // Number of search results per page, defined in configs
  },
  bookmarks: [], // Array of bookmarked recipes
};

// Formats the recieved recipe for rendering
const recipeObject = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image_url,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Gets a recipe of the given ID from the API
 * @param {String} id The ID of the recipe to be loaded
 */
export const loadRecipe = async function (id) {
  try {
    // AJAX call for the recipe
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = recipeObject(data.data.recipe);

    // Checking if the recipe is bookmarked or not
    if (state.bookmarks.some(bookmark => bookmark.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

/**
 * Gets recipe results for a user query from the API and saves them to the results Array in search object in state
 * @param {String} query A query made by user to get recipes
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // Save recipes to the results Array
    state.search.results = data.data.recipes.map(res => {
      return {
        id: res.id,
        title: res.title,
        image: res.image_url,
        publisher: res.publisher,
        ...(res.key && { key: res.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

/**
 * Gives an Array of 10 results corresponding to the given page out of the results Array and sets current page and total number of pages to the search object in state
 * @param {Number} page The page number which is to be displayed to the view
 * @returns {Object[]} An array of 10 recipes
 */
export const getSearchResultsPage = function (page = 1) {
  // Set current page to the search Object
  state.search.currentPage = page;

  // Set total number of pages to the search object
  state.search.numPages = Math.ceil(
    state.search.results.length / state.search.resultsPerPage
  );

  const start = (page - 1) * 10;
  const end = page * 10;
  return state.search.results.slice(start, end);
};

// Update ingredient quantity according to number of servings
export const updateServings = function (numServings) {
  state.recipe.ingredients.forEach(ing =>
    ing.quantity
      ? (ing.quantity = (ing.quantity * numServings) / state.recipe.servings)
      : ''
  );
  // Update number of servings
  state.recipe.servings = numServings;
};

// Add/Remove bookmarks
export const toggleBookmark = function () {
  // If recipe not bookmarked, bookmark it
  if (!state.recipe.bookmarked) {
    console.log(state.bookmarks);
    state.bookmarks.push(state.recipe);
    state.recipe.bookmarked = true;
  }
  // If it's bookmarked, remove it
  else {
    const index = state.bookmarks.findIndex(rec => rec.id === state.recipe.id);
    state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;
  }

  // Save bookmarks to the local storage
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Getting bookmarks from the local storage on page load
const init = function () {
  const storage = JSON.parse(localStorage.getItem('bookmarks'));

  if (storage) state.bookmarks = storage;
};

init();

/**
 * Formats the recieved data and uploads a new recipe to the API
 * @param {Object} newRecipe Recipe object containing raw data from the user
 * @async
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    // Getting an Array of all ingredient data from newRecipe
    const RawIngs = Object.entries(newRecipe).filter(entry =>
      entry[0].startsWith('ingredient')
    );

    // Separating each ing out of rawIngs
    const ingsArr = [];
    while (RawIngs.length) ingsArr.push(RawIngs.splice(0, 3));

    // Final ingredients array
    const ingredients = ingsArr.map(ing => {
      const [quantity, unit, description] = ing.map(ing => ing[1].trim());
      return {
        quantity: quantity ? +quantity : null,
        unit,
        description,
      };
    });

    // Recipe object that will go to the API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Sending the data to API
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    // Setting the uploaded recipe as current recipe
    state.recipe = recipeObject(data.data.recipe);

    // Bookmarking the newly uploaded recipe
    toggleBookmark();
  } catch (err) {
    throw err;
  }
};

// Deleting a user generated recipe
export const deleteRecipe = async function () {
  try {
    // If it's bookmarked, removing it
    if (state.recipe.bookmarked) toggleBookmark();

    // Getting it's index from the search results Array, if included
    const index = state.search.results.findIndex(
      rec => rec.id === state.recipe.id
    );

    // Saving the index to the recipe
    state.recipe.index = index;

    // Sending delete request to the API
    await deleteJSON(`${API_URL}${state.recipe.id}?key=${KEY}`);

    // if inluded, remove it
    if (index === -1) return;
    state.search.results.splice(index, 1);
  } catch (err) {
    throw err;
  }
};

// Clear bookmarks (Only deveopment purposes)
const clearBookmarks = function (start, count) {
  state.bookmarks.splice(start, count);
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
