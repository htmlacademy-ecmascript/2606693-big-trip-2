import { render, remove, RenderPosition } from '../framework/render.js';
import ListSortView from '../view/list-sort-view.js';
import PointsListView from '../view/points-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import { NoPointsMessage } from '../const.js';
import PointPresenter from './point-presenter.js';
import {SortType} from '../const.js';
import { sortPointsByPrice, sortPointsByStartDate, sortPointsByTime } from '../utils/point.js';

class TablePresenter {
  #tableContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #pointsListComponent = new PointsListView();
  #sortComponent = null;

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.#tableContainer = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortPointsByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPointsByPrice);
    }
    return [...this.#pointsModel.points].sort(sortPointsByStartDate);
  }

  init() {
    this.#renderTable();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedProperties) => {
    this.#pointPresenters.get(updatedProperties.point.id).init(updatedProperties);
  };

  #handleDataRequest = (point) => ({
    allDestinations: this.#destinationsModel.destinations,
    pointTypes: this.#offersModel.getPointTypes(),
    destination: this.#destinationsModel.getDestinationById(point.destination),
    availableOffers: this.#offersModel.getOffersByType(point.type),
    selectedOffers: this.#offersModel.getOffersByIds(point.offers)
  });

  #renderPoint(properties) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
      onDataRequest: this.#handleDataRequest
    });

    pointPresenter.init(properties);
    this.#pointPresenters.set(properties.point.id, pointPresenter);
  }

  #renderNoPoints() {
    render(new NoPointsView({
      message: NoPointsMessage.EVERYTHING
    }), this.#tableContainer);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointsList();
    this.#clearSort();
    this.#renderTable();
  };

  #clearSort() {
    remove(this.#sortComponent);
  }

  #renderSort() {
    this.#sortComponent = new ListSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#tableContainer, RenderPosition.AFTERBEGIN);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPointsList() {
    render(this.#pointsListComponent, this.#tableContainer);

    this.points.forEach((point) => {
      this.#renderPoint({
        point,
        extraData: this.#handleDataRequest(point)
      });
    });
  }

  #renderTable() {
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }
}

export default TablePresenter;
