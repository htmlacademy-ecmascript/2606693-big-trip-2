import AbstractView from '../framework/view/abstract-view.js';

function createTemplate() {
  return (
    `<p class="trip-events__msg">
      Loading...
    </p>`
  );
}

class LoadingView extends AbstractView {
  get template() {
    return createTemplate();
  }
}

export default LoadingView;
