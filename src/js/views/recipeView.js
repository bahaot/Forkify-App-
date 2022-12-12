import icons from "url:../../img/icons.svg"; // parcel 2(for any static assists that are not programming files)
import fracty from "fracty";
import View from "./view.js";

class RecipeView extends View {
  _parentElement = document.querySelector(".recipe");
  // each of views will have this parentElement property
  _errorMessage = `We could not find that recipe. Please try another one!`;
  _message = "";

  addHandlerRender(handler) {
    // this is a publisher method which needs to recive a subscriber method
    ["hashchange", "load"].forEach(ev => window.addEventListener(ev, handler));
  } // its not a private method because it have to be part of the public API

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (e) {
      e.preventDefault();

      const clickedBtn = e.target.closest(".btn--update-servings");
      if (!clickedBtn) return; // if no clickedBtn then return
      const { updateTo } = clickedBtn.dataset;

      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener("click", function (e) {
      e.preventDefault();

      const clickedBtn = e.target.closest(".btn--bookmark");
      if (!clickedBtn) return;
      if (!this._data?.bookmarked) handler();
    });
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
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
          <button class="btn--tiny btn--update-servings" data-update-to = "${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to = "${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>
  
      <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
        <svg>
           <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? "-fill" : ""
    }"></use>
        </svg>
      </button>
    </div>
  
    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">

      ${this._data.ingredients.map(this._generateMarkupIngredient).join("")}
        
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
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>`;
  } // since we are using babil we can use this syntax here

  _generateMarkupIngredient(ing) {
    return `
            <li class="recipe__ingredient">
            <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${
              ing.quantity ? fracty(ing.quantity) : ""
            }</div>
            <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
          </div>
           </li>`;
    // quantity: 4, unit: 'oz', description: 'cream cheese room temperature'
  }
}
// we do this because later we will have a parent class called view which will contains methods all of the views should inherit
// we have to export somehting from this module

export default new RecipeView();
