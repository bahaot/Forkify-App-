class SearchView {
  // this class is not goind to render anything all we want is to get a query and listen to click events on the button
  _parentEl = document.querySelector(".search");

  getQuery() {
    const query = this._parentEl.querySelector(".search__field").value;
    this._clearInput();

    return query;
  } // we could write the exact same code in the controller but that doesnt make any sense

  _clearInput() {
    this._parentEl.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    // the publisher
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();

      handler();
    });
  }
}

export default new SearchView();
