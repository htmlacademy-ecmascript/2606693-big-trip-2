import { render } from '../framework/render.js';
import ListSortView from '../view/list-sort-view.js';
import PointsListView from '../view/points-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import { NoPointsMessage } from '../const.js';
import PointPresenter from './point-presenter.js';

class TablePresenter {
  #tableContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #pointsListComponent = new PointsListView();
  #sortComponent = new ListSortView();

  #tablePoints = [];
  #pointTypes = [];

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.#tableContainer = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#tablePoints = [...this.#pointsModel.points];
    this.#pointTypes = [...this.#offersModel.getPointTypes()];

    this.#renderTable();
  }

  #renderPoint(properties) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
    });

    pointPresenter.init(properties);
  }

  #renderNoPoints() {
    render(new NoPointsView({
      message: NoPointsMessage.EVERYTHING
    }), this.#tableContainer);
  }

  #renderSort() {
    render(this.#sortComponent, this.#tableContainer);
  }

  #renderPointsList() {
    render(this.#pointsListComponent, this.#tableContainer);

    this.#tablePoints.forEach((point) => {
      this.#renderPoint({
        point,
        allDestinations: this.#destinationsModel.destinations,
        destination: this.#destinationsModel.getDestinationById(point.destination),
        availableOffers: this.#offersModel.getOffersByType(point.type),
        selectedOffers: this.#offersModel.getOffersByIds(point.offers),
        pointTypes: this.#pointTypes
      });
    });
  }

  #renderTable() {
    if (this.#tablePoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }
}

export default TablePresenter;
