import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
// always keep the imports in the top
// with parcel we can import more than javascript files we can import all kinds of assists and that include images
// import icons from "../img/icon.svg"; // parcel 1
import "core-js/stable";
import "regenerator-runtime/runtime";
import recipeView from "./views/recipeView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SECONDS } from "./config.js";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// 5c3fe9f1-39c8-426b-bca9-04d6b5ac18c9

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;

    // 0) Update result view to mark selected search result
    resultsView.update(model.getSerachResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // renderSpinner(recipeContainer);
    // 1)load recipe
    await model.loadRecipe(id); // this is an asyn function and therefore it will retrun a promise and we have to await for this promise before move on to the next step
    // 2) rendering recipe

    recipeView.render(model.state.recipe);
    // render is a very common name which is also in react called render

    // const recipeView = new recipeView(mode.state.recipe);
    // this also possible but honsestly jonas like it like doint it with render() and creating the object in the recipeView module

    // debugger;
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

// async function working in the bacground so we are not our main thread of the execution

document.querySelector(".results").addEventListener("click", function () {
  recipeView.renderSpinner();
});

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    // 1) get search query

    // 2) Load search result
    await model.loadSearchResults(query);

    // 3) Render results
    // console.log(model.getSerachResultsPage(2));
    resultsView.render(model.getSerachResultsPage(1));

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controllPagination = function (goToPage) {
  // 1) Render new results
  resultsView.render(model.getSerachResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  // update method will update only the text and the attribute in the Dom so we will not have to reload the whole view
};

const controlAddBookmark = function () {
  // 1) Add/ remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddREcipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload the newRecipe data
    await model.uploadRecipe(newRecipe); // only with this we are handling this function as a function that return a promise so that rejected promise can then get caught
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL
    window.history.pushState(null, "", `${model.state.recipe.id}`); // this will allow us to change the url withour reloading the page
    // arguments state: not really matter, title: not relevant, URL
    // we can go back and forth with the history api
    // window.history.back();

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = async function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  // we can put it in the public scope but by doing it like so its more cleaner
  recipeView.addHandlerUpdateServings(controlServings);

  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults); // the subscriber

  paginationView.addHandlerClick(controllPagination); // the subsriber

  addRecipeView.addHandlerUpload(controlAddREcipe);
};

init();
// window.addEventListener("hashchange", controlRecipes);
// window.addEventListener("load", controlRecipes);

// we can name these functions inside controller handler becasue thats it waht they do(handle events)
