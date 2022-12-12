import View from "./view";
import icons from "url:../../img/icons.svg"; // parcel 2(for any static assists that are not programming files)

class PageinationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      e.preventDefault();

      const clickedBtn = e.target.closest(".btn--inline");
      if (!clickedBtn) return; // if there is no btn return immeditly

      const goToPage = +clickedBtn.dataset.goto;

      handler(goToPage);
    });
  }
  _generateMarkup() {
    return this._generateMarkupBtn();
  }

  _generateMarkupBtn() {
    const curPage = this._data.page;
    const prevBtn = `
          <button class="btn--inline pagination__btn--prev" data-goto = "${
            curPage - 1
          }">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${curPage - 1}</span>
          </button>`;
    const nextBtn = `
          <button class="btn--inline pagination__btn--next" data-goto = "${
            curPage + 1
          }">
              <span>Page ${curPage + 1}</span>
              <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
               </svg>
          </button>`;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pagese
    if (curPage === 1 && numPages > 1) {
      return nextBtn;
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      return prevBtn;
    }
    // Other page
    if (curPage > 1 && curPage < numPages) {
      // this._data.page on my own my you have to delete it at some point
      return `${nextBtn} ${prevBtn}`;
    }

    // Page 1, and there are no other pagese
    return "";
  }
}

export default new PageinationView();
