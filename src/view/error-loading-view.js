import AbstractView from '../framework/view/abstract-view.js';

function createTemplate() {
  return (
    `<p class="trip-events__msg">
      Failed to load latest route information
    </p>`
  );
}

class ErrorLoadingView extends AbstractView {
  get template() {
    return createTemplate();
  }
}

export default ErrorLoadingView;
