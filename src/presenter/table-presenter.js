import { render, remove, RenderPosition } from '../framework/render.js';
import ListSortView from '../view/list-sort-view.js';
import PointsListView from '../view/points-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import { NoPointsMessage } from '../const.js';
import PointPresenter from './point-presenter.js';
import { SortType, UpdateType, UserAction} from '../const.js';
import { sortPointsByPrice, sortPointsByStartDate, sortPointsByTime } from '../utils/point.js';
import {filter} from '../utils/filter.js';

class TablePresenter {
  #tableContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #pointsListComponent = new PointsListView();
  #sortComponent = null;
  #noPointsComponent = new NoPointsView({
    message: NoPointsMessage.EVERYTHING
  });

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor({container, pointsModel, destinationsModel, offersModel, filterModel}) {
    this.#tableContainer = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
    }
    return filteredPoints.sort(sortPointsByStartDate);
  }

  init() {
    this.#renderTable();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, update.point);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, update.point);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, update.point);
        break;
    }
  };

  #handleModelEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(point.id).init({
          point,
          extraData: this.#handleDataRequest(point)
        });
        break;
      case UpdateType.MINOR:
        this.#clearTable();
        this.#renderTable();
        break;
      case UpdateType.MAJOR:
        this.#clearTable({resetSortType: true});
        this.#renderTable();
        break;
    }
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
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onDataRequest: this.#handleDataRequest
    });

    pointPresenter.init(properties);
    this.#pointPresenters.set(properties.point.id, pointPresenter);
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#tableContainer);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTable();
    this.#renderTable();
  };

  #renderSort() {
    this.#sortComponent = new ListSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#tableContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoints() {
    this.points.forEach((point) => {
      this.#renderPoint({
        point,
        extraData: this.#handleDataRequest(point)
      });
    });
  }

  #clearTable({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderTable() {
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    render(this.#pointsListComponent, this.#tableContainer);

    this.#renderSort();
    this.#renderPoints();
  }
}

export default TablePresenter;
