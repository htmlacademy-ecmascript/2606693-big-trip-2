import {remove, render, RenderPosition} from '../framework/render.js';
import PointAddNewView from '../view/point-add-new-view.js';
import {UserAction, UpdateType} from '../const.js';
import { isEscapeKey } from '../utils/common.js';

class NewPointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #handleDataRequest = null;

  #properties = null;

  #pointEditComponent = null;

  constructor({pointsListContainer, onDataChange, onDestroy, onDataRequest}) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#handleDataRequest = onDataRequest;
  }

  init(properties) {
    this.#properties = properties;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointAddNewView({
      ...this.#properties,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onQuitEditClick: this.#handleQuitEditClick,
      onDataRequest: this.#handleDataRequest
    });

    render(this.#pointEditComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      update.point
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleQuitEditClick = () => {
    this.#pointEditComponent.reset(this.#properties);
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}

export default NewPointPresenter;
