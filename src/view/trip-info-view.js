import AbstractView from '../framework/view/abstract-view.js';
import { TripInfo } from '../const.js';
import { humanizeTripInfoDates } from '../utils/point.js';

function createTitleTemplate(destinationNames) {
  if (destinationNames.length > TripInfo.MAX_NAMES_COUNT) {
    return `${destinationNames.at(TripInfo.START)}${TripInfo.SEPARATOR_TITLE_MAX}${destinationNames.at(TripInfo.END)}`;
  }
  return destinationNames.join(TripInfo.SEPARATOR_TITLE);
}

function createDatesTemplate (dates) {
  const formatedDates = humanizeTripInfoDates(dates);
  return formatedDates.join(TripInfo.SEPARATOR_DATE);
}

function createTemplate({destinationNames, dates, totalCost}) {
  if (!destinationNames.length || !dates.length) {
    return '<section class="trip-main__trip-info  trip-info"></section>';
  }

  const titleTemplate = createTitleTemplate(destinationNames);
  const datesTemplate = createDatesTemplate(dates);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${titleTemplate}</h1>
        <p class="trip-info__dates">${datesTemplate}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
}

class TripInfoView extends AbstractView{
  #detinationNames = [];
  #dates = [];
  #totalCost = null;

  constructor({destinationNames, dates, totalCost}) {
    super();
    this.#detinationNames = destinationNames;
    this.#dates = dates;
    this.#totalCost = totalCost;
  }

  get template() {
    return createTemplate({
      destinationNames: this.#detinationNames,
      dates: this.#dates,
      totalCost: this.#totalCost
    });
  }
}

export default TripInfoView;
