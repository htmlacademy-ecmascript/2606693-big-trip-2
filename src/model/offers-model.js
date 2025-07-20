import { offers } from '../mock/offers.js';

class OffersModel {
  #offers = offers;

  get offers() {
    return this.#offers;
  }

}

export default OffersModel;
