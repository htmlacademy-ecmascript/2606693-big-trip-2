import {render} from '../framework/render.js';
import ListSortView from '../view/list-sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';

class TablePresenter {
  #tableContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #pointsListComponent = new PointsListView();

  #points = [];
  #destinations = [];
  #offers = [];

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

    render(new ListSortView(), this.#tableContainer);
    render(this.#pointsListComponent, this.#tableContainer);

    const pointEditProperties = {
      point: this.#points[0],
      destinations: this.#destinations,
      offers: this.#offers
    };
    render(new PointEditView(pointEditProperties), this.#pointsListComponent.element);

    for (let i = 1; i < this.#points.length; i++) {
      this.#renderPoint({
        point: this.#points[i],
        destinations: this.#destinations,
        offers: this.#offers
      });
    }
  }

  #renderPoint(properties) {
    const pointViewComponent = new PointView(properties);
    render(pointViewComponent, this.#pointsListComponent.element);
  }
}

export default TablePresenter;
