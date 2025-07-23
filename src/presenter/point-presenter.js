import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { isEscapeKey } from '../utils/common.js';

class PointPresenter {
  #pointsListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #destination = null;
  #allDestinations = [];
  #availableOffers = [];
  #selectedOffers = [];
  #pointTypes = [];

  constructor({pointsListContainer}) {
    this.#pointsListContainer = pointsListContainer;
  }

  init({point, allDestinations, destination, availableOffers, selectedOffers, pointTypes}) {
    this.#point = point;
    this.#destination = destination;
    this.#allDestinations = allDestinations;
    this.#availableOffers = availableOffers;
    this.#selectedOffers = selectedOffers;
    this.#pointTypes = pointTypes;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#destination,
      availableOffers: this.#availableOffers,
      selectedOffers: this.#selectedOffers,
      onEditClick: this.#handleEditClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      destination: this.#destination,
      allDestinations: this.#allDestinations,
      availableOffers: this.#availableOffers,
      pointTypes: this.#pointTypes,
      onFormSubmit: this.#handleFormSubmit,
      onQuitEditClick: this.#handleQuitEditClick
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#pointsListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointsListContainer.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replaceItemToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToItem() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#replaceFormToItem();
    }
  };

  #handleEditClick = () => {
    this.#replaceItemToForm();
  };

  #handleQuitEditClick = () => {
    this.#replaceFormToItem();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToItem();
  };
}

export default PointPresenter;
