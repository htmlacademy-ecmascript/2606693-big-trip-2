import AbstractView from '../framework/view/abstract-view.js';

function createTemplate({message}) {
  return (
    `<p class="trip-events__msg">
      ${message}
    </p>`
  );
}

class NoPointsView extends AbstractView{
  #message = '';

  constructor({message}) {
    super();
    this.#message = message;
  }

  get template() {
    return createTemplate({
      message: this.#message
    });
  }
}

export default NoPointsView;
