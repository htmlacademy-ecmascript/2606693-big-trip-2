import { destinations } from '../mock/destinations.js';

class DestinationsModel {
  #destinations = destinations;

  get destinations() {
    return this.#destinations;
  }

}

export default DestinationsModel;
