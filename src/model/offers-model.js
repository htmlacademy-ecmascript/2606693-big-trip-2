import { offers } from '../mock/offers.js';

class OffersModel {
  #offers = offers;

  get offers() {
    return this.#offers;
  }

  #getAllOffers() {
    return this.offers.flatMap((item) => item.offers);
  }

  getOffersByType(type = '') {
    return this.offers.find((item) => item.type === type)?.offers || [];
  }

  getOffersByIds(ids = []) {
    return this.#getAllOffers().filter((offer) => ids.includes(offer.id));
  }

  getPointTypes() {
    return this.offers.map((item) => item.type);
  }
}

export default OffersModel;
