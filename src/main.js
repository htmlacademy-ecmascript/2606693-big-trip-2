import { render, RenderPosition } from './render.js';
import ListFilterView from './view/list-filter-view.js';
import TripInfoView from './view/trip-info-view.js';
import TablePresenter from './presenter/table-presenter.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersContainerElement = tripMainElement.querySelector('.trip-controls__filters');
const pointsContainerElement = document.querySelector('.trip-events');

const tablePresenter = new TablePresenter({container: pointsContainerElement});

render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new ListFilterView(), filtersContainerElement);

tablePresenter.init();
