import { render, remove } from '../framework/render.js';
import ListSortView from '../view/list-sort-view.js';
import PointsListView from '../view/points-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import { NoPointsMessage } from '../const.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../const.js';
import { sortPointsByPrice, sortPointsByStartDate, sortPointsByTime } from '../utils/point.js';

class TablePresenter {
  #tableContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #pointsListComponent = new PointsListView();
  #sortComponent = null;

  #tablePoints = [];
  #pointTypes = [];
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedTablePoints = [];

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.#tableContainer = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#tablePoints = [...this.#pointsModel.points].sort(sortPointsByStartDate);
    this.#sourcedTablePoints = [...this.#tablePoints];
    this.#pointTypes = [...this.#offersModel.getPointTypes()];

    this.#renderTable();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedProperties) => {
    this.#tablePoints = updateItem(this.#tablePoints, updatedProperties.point);
    this.#sourcedTablePoints = updateItem(this.#sourcedTablePoints, updatedProperties.point);
    this.#pointPresenters.get(updatedProperties.point.id).init(updatedProperties);
  };

  #renderPoint(properties) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(properties);
    this.#pointPresenters.set(properties.point.id, pointPresenter);
  }

  #renderNoPoints() {
    render(new NoPointsView({
      message: NoPointsMessage.EVERYTHING
    }), this.#tableContainer);
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#tablePoints.sort(sortPointsByPrice);
        break;
      case SortType.TIME:
        this.#tablePoints.sort(sortPointsByTime);
        break;
      default:
        this.#tablePoints = [...this.#sourcedTablePoints];
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
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
    render(this.#sortComponent, this.#tableContainer);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
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
