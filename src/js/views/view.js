import icons from "url:../../img/icons.svg"; // parcel 2(for any static assists that are not programming files)

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered(e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string insread of renderin to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {object} View instance
   * @author baha ott
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  } // this method is public methd

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); // we need this to compare the old markup with this one
    // this is not just a string and so that is gonna be very diffecutl to compare to the dom elements that we currently have on the page

    // convert the string to a dom object thats living in the memory and we can then use to compare with the actuall dom on the page
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      console.log(curEl, newEl.isEqualNode(curEl), newEl);

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        // what is in fact the text is the firstChild node, the element is just an element node
        curEl.textContent = newEl.textContent;
      }

      // Updates changes ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
        // replace all the attributes in the current element by the attributes coming from the new element
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  } // this method is public methd

  renderError(message = this._errorMessage) {
    // if there is no message sent in we will use the default
    const markup = `
         <div class="error">
                 <div>
                   <svg>
                     <use href="${icons}#icon-alert-triangle"></use>
                   </svg>
                 </div>
                 <p>${message}</p>
         </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    // if there is no message sent in we will use the default
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
