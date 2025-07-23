import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { isEscapeKey } from '../utils/common.js';

class PointPresenter {
  #pointsListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #properties = null;

  #handleDataChange = null;

  constructor({pointsListContainer, onDataChange}) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(properties) {
    this.#properties = properties;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      ...this.#properties,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      ...this.#properties,
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

  #handleFavoriteClick = () => {
    this.#handleDataChange({
      ...this.#properties,
      point: {
        ...this.#properties.point,
        'is_favorite': !this.#properties.point['is_favorite']
      }
    });
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange({
      ...this.#properties,
      point
    });
    this.#replaceFormToItem();
  };
}

export default PointPresenter;
