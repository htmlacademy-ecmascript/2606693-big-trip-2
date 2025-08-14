import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import { sortPointsByStartDate, sortPointsByEndDate } from '../utils/point.js';

class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;

  #tripInfoComponent = null;

  constructor({tripInfoContainer, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const points = [...this.#pointsModel.points];

    return points.sort(sortPointsByStartDate);
  }

  get dates() {
    const startDate = this.points.at(0)?.dateFrom;
    const endDate = this.points.sort(sortPointsByEndDate).at(0)?.dateTo;

    return startDate && endDate ? [startDate, endDate] : [];
  }

  get destinationNames() {
    return this.points.map((point) => this.#pointsModel.getDestinationById(point.destination).name);
  }

  get totalCost() {
    const totalPointsPrice = this.points.reduce((total, point) => total + point.basePrice, 0);

    const allSelectedOffers = this.points.flatMap((point) => this.#pointsModel.getOffersByIds(point.offers));
    const totalSelectedOffersPrice = allSelectedOffers.reduce((total, offer) => total + offer.price, 0);

    return totalPointsPrice + totalSelectedOffersPrice;
  }

  init() {
    const destinationNames = this.destinationNames;
    const dates = this.dates;
    const totalCost = this.totalCost;
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView ({
      destinationNames,
      dates,
      totalCost
    });

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}

export default TripInfoPresenter;
