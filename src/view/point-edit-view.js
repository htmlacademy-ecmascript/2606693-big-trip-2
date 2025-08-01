import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDateTime } from '../utils/point.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

function createEventTypeTemplate (pointTypes, selectedType) {
  return pointTypes.map((type, i) => (
    `<div class="event__type-item">
      <input id="event-type-${type}-${i}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === selectedType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${i}">
        ${type}
      </label>
    </div>`
  )).join('');
}

function createDestinationsTemplate (allDestinations) {
  return allDestinations.map(({name, id}) => (
    `<option value="${name}" id=${id}></option>`
  )).join('');
}

function createOffersTemplate (availableOffers, selectedOffers) {
  if (availableOffers.length === 0) {
    return '';
  }

  const offersListTemplate = availableOffers.map(({id, title, price}) => {
    const isChecked = selectedOffers.some((offer) => offer.id === id);
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-${id}" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join('');

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersListTemplate}
      </div>
    </section>`
  );
}

function createDescriptionTemplate ({description, pictures}) {
  if(!description) {
    return '';
  }

  const picturesListTemplate = pictures.map((picture) => (
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
  )).join('');

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">
        Destination
      </h3>
      <p class="event__destination-description">
        ${description}
      </p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${picturesListTemplate}
        </div>
      </div>
    </section>`
  );
}

function createTemplate({point, extraData}) {
  const {base_price: basePrice, date_from: dateFrom, date_to: dateTo, type, id} = point;
  const {allDestinations, destination, pointTypes, availableOffers, selectedOffers} = extraData;
  const {name: destinationName} = destination;

  const humanDateTimeFrom = humanizeDateTime(dateFrom);
  const humanDateTimeTo = humanizeDateTime(dateTo);

  const eventTypeTemplate = createEventTypeTemplate(pointTypes, type);
  const destinationsTemplate = createDestinationsTemplate(allDestinations);
  const offersTemplate = createOffersTemplate(availableOffers, selectedOffers);
  const descriptionTemplate = createDescriptionTemplate(destination);

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypeTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input
            class="event__input event__input--destination"
            id="event-destination-${id}"
            type="text"
            name="event-destination"
            value="${destinationName}"
            list="destination-list-${id}"
          >
          <datalist id="destination-list-${id}">
            ${destinationsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanDateTimeFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanDateTimeTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>&euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersTemplate}
        ${descriptionTemplate}
      </section>
    </form>`
  );
}

class PointEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleQuitEditClick = null;
  #handleDataRequest = null;

  constructor({point, extraData, onFormSubmit, onQuitEditClick, onDataRequest}) {
    super();
    this._setState(PointEditView.parsePointToState({
      point,
      extraData
    }));

    this.#handleFormSubmit = onFormSubmit;
    this.#handleQuitEditClick = onQuitEditClick;
    this.#handleDataRequest = onDataRequest;

    this._restoreHandlers();
  }

  get template() {
    return createTemplate(this._state);
  }


  reset(properties) {
    this.updateElement(
      PointEditView.parsePointToState(properties),
    );
  }

  _restoreHandlers() {
    this.element.querySelectorAll('.event__type-input').forEach((input) => input.addEventListener('change', this.#eventTypeChangeHandler));
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#eventDestinationChangeHandler);
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#basePriceChangeHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((input) => input.addEventListener('input', this.#selectedOffersChangeHandler));
  }

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const updatedPoint = {
      ...this._state.point,
      type: evt.target.value,
      offers: [],
    };
    this.updateElement({
      point:updatedPoint,
      extraData:this.#handleDataRequest(updatedPoint)
    });
  };

  #eventDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const updatedDestination = this._state.extraData.allDestinations.find((destination) => destination.name === evt.target.value);
    if (!updatedDestination) {
      return;
    }
    const updatedPoint = {
      ...this._state.point,
      destination: updatedDestination.id
    };
    this.updateElement({
      point:updatedPoint,
      extraData: this.#handleDataRequest(updatedPoint),
    });
  };

  #basePriceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      point: {
        ...this._state.point,
        'base_price': parseInt(evt.target.value,10)
      }
    });
  };

  #selectedOffersChangeHandler = () => {
    const updatedPoint = {
      ...this._state.point,
      offers: [...this.element.querySelectorAll('.event__offer-checkbox:checked')].map((item) => item.id)
    };
    this.updateElement({
      point:updatedPoint,
      extraData: this.#handleDataRequest(updatedPoint),
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleQuitEditClick();
  };

  static parsePointToState(properties) {
    return {...properties};
  }

  static parseStateToPoint(state) {
    return {...state};
  }
}

export default PointEditView;
