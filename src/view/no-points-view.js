import AbstractView from '../framework/view/abstract-view.js';
import { NoPointsMessage } from '../const.js';

function createTemplate({filterType}) {
  const noPointsTextValue = NoPointsMessage[filterType];

  return (
    `<p class="trip-events__msg">
      ${noPointsTextValue}
    </p>`
  );
}

class NoPointsView extends AbstractView{
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createTemplate({
      filterType: this.#filterType
    });
  }
}

export default NoPointsView;
