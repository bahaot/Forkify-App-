import View from "./view";
import icons from "url:../../img/icons.svg"; // parcel 2(for any static assists that are not programming files)
import previewView from "./previewView.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = `No recipes found for your query! Pleas try again`;
  _message = "";

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join("");
  }
}

export default new ResultsView();
