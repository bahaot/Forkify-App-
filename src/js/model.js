import { async } from "regenerator-runtime";
import { FORKIFY_API_URL, KEY, RES_PER_PAGE } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // conditinally add property to an object
    // if recipe.key is falsy: nothing happens, if there is ome value the second part of the operator is excuted (returned)
    // and then we can spread that objects
  };
};

// fetching the recipe data from forkify API
export const loadRecipe = async function (id) {
  // this is an inpure function because it is mutating a value outside of the function
  // 1) loading recipe
  try {
    const data = await AJAX(`${FORKIFY_API_URL}${id}?key=${KEY}`);
    // Reformat the object that we get

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    // console.error(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${FORKIFY_API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    }); // array of all the objects

    state.search.page = 1;
  } catch (err) {
    throw err; // throw the error again in order to use it in the controller
  }
};

export const getSerachResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // page - 1 * amound of results that we want on the page;
  const end = page * state.search.resultsPerPage; //9;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // reach in state and change the quantity in each gradient
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // formula = newQt = oldQt * newServings / oldServings
  });

  // we have to update the servings in the state
  state.recipe.servings = newServings;
};

const presistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};
// we will not export it becasue we are going to use it here

export const addBookmark = function (recipe) {
  // Add bookmard
  state.bookmarks.push(recipe);
  console.log(state);

  // mark current recipe as bookmarkd
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  presistBookmarks();
};

export const deleteBookmark = function (id) {
  // delete bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  // the index and how many items we want to delete

  // mark current recipe as NOT bookmarkd
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  presistBookmarks();
};

// this is a common pattern in programming when we add something we get the entire data and when we delete it we get the ID

const init = function () {
  const storage = localStorage.getItem("bookmarks"); // we are not saving it into state directly because this data might be not defined
  if (storage) state.bookmarks = JSON.parse(storage); // to convert a string back to an object
};

init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// init();

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map(ing => {
        const ingArr = ing[1].split(",").map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use th ecorrect format :"
          );

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null, // if there is a quantity convert it to a number if not return null
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${FORKIFY_API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
