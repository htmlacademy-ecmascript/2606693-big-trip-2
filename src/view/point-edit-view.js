import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDateTime } from '../utils/point.js';

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
  return allDestinations.map(({name}) => (
    `<option value="${name}"></option>`
  )).join('');
}

function createOffersTemplate (availableOffers, selectedOfferIds) {
  if (availableOffers.length === 0) {
    return '';
  }

  const offersListTemplate = availableOffers.map(({id, title, price}) => {
    const isChecked = selectedOfferIds.includes(id);
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${id}">
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

function createTemplate({point, allDestinations, destination, pointTypes, availableOffers}) {
  const {base_price: basePrice, date_from: dateFrom, date_to: dateTo, offers: selectedOfferIds, type, id} = point;
  const {name: destinationName} = destination;

  const humanDateTimeFrom = humanizeDateTime(dateFrom);
  const humanDateTimeTo = humanizeDateTime(dateTo);

  const eventTypeTemplate = createEventTypeTemplate(pointTypes, type);
  const destinationsTemplate = createDestinationsTemplate(allDestinations);
  const offersTemplate = createOffersTemplate(availableOffers, selectedOfferIds);
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
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${id}">
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

class PointEditView extends AbstractView {
  #point = null;
  #destination = null;
  #allDestinations = [];
  #pointTypes = [];
  #availableOffers = [];

  #handleFormSubmit = null;
  #handleQuitEditClick = null;

  constructor({point, destination, allDestinations, availableOffers, pointTypes, onFormSubmit, onQuitEditClick}) {
    super();
    this.#point = point;
    this.#allDestinations = allDestinations;
    this.#destination = destination;
    this.#pointTypes = pointTypes;
    this.#availableOffers = availableOffers;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleQuitEditClick = onQuitEditClick;
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createTemplate({
      point: this.#point,
      allDestinations: this.#allDestinations,
      destination: this.#destination,
      pointTypes: this.#pointTypes,
      availableOffers: this.#availableOffers,
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#point);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleQuitEditClick();
  };
}

export default PointEditView;
