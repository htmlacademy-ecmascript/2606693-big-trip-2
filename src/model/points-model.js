import { destinations } from '../mock/destinations.js';
import { offers } from '../mock/offers.js';
import { getRandomPoint } from '../mock/points.js';
import { POINTS_COUNT } from '../const.js';

class PointsModel {
  constructor() {
    this.points = [];
    this.destinations = [];
    this.offers = [];
  }

  init() {
    this.points = Array.from({length: POINTS_COUNT}, getRandomPoint);
    this.destinations = destinations;
    this.offers = offers;
  }

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}

export default PointsModel;
