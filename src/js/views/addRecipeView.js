import View from "./view";
import icons from "url:../../img/icons.svg"; // parcel 2(for any static assists that are not programming files)

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "recipe was successfully uploaded :)";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super(); // since this is a child class we need to call super first and only after that we can use the this keyword
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  } // we want this to be called as soon as the page loads

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)]; //form data is pretty modern broser API that we can now make use of
      // into fromData cosntructor we have to pass an element which is a form
      // new FormData will return a weird object that we cannot really use but we can spread that object into an array
      // now this will give us an array which contains all the fies wtih all the values in there

      const data = Object.fromEntries(dataArr); // this method will convert the array of entries to an object
      // this data will be the data that will be uploaded to the API

      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new AddRecipeView();
