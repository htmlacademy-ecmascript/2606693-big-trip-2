import { destinations } from '../mock/destinations.js';

class DestinationsModel {
  #destinations = destinations;

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id = '') {
    return this.destinations.find((destination) => destination.id === id) || {};
  }

}

export default DestinationsModel;
