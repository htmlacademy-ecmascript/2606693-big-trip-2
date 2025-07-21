import { render, replace } from '../framework/render.js';
import ListSortView from '../view/list-sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';

class TablePresenter {
  #tableContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];
  #destinations = [];
  #offers = [];

  #pointsListComponent = new PointsListView();

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.#tableContainer = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#renderTable();
  }

  #renderPoint(properties) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToItem();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      ...properties,
      onEditClick: () => {
        replaceItemToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new PointEditView({
      ...properties,
      onFormSubmit: () => {
        replaceFormToItem();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onQuitEditClick: () => {
        replaceFormToItem();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceItemToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToItem() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#pointsListComponent.element);
  }

  #renderTable() {
    render(new ListSortView(), this.#tableContainer);
    render(this.#pointsListComponent, this.#tableContainer);

    for (let i = 1; i < this.#points.length; i++) {
      this.#renderPoint({
        point: this.#points[i],
        destinations: this.#destinations,
        offers: this.#offers
      });
    }
  }
}

export default TablePresenter;
