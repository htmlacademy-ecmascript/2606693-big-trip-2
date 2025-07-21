import AbstractView from '../framework/view/abstract-view.js';

function createTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

class PointsListView extends AbstractView{
  get template() {
    return createTemplate();
  }
}

export default PointsListView;
