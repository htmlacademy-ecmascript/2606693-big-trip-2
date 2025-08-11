const GAP_IN_MILLISECONDS = 3_600_000;

const DefaultPoint = {
  DATE_FROM: new Date().toISOString(),
  DATE_TO: new Date((new Date().getTime() + GAP_IN_MILLISECONDS)).toISOString(),
  TYPE: 'bus',
};

const BLANK_POINT = {
  basePrice: '',
  dateFrom: DefaultPoint.DATE_FROM,
  dateTo: DefaultPoint.DATE_TO,
  destination: '',
  isFavorite: false,
  offers: [],
  type: DefaultPoint.TYPE,
};

const UNVALID_BASE_PRICE_PATTERN = /\D+/;

const DateFormat = {
  MONTH_DAY:'MMM D',
  HOUR_MINUTE: 'HH:mm',
  DAY_MONTH_YEAR_HOUR_MINUTE: 'DD/MM/YY HH:mm',
  DURATION_MINUTE: 'mm[M]',
  DURATION_HOUR_MINUTE: 'HH[H] mm[M]',
  DURATION_DAY_HOUR_MINUTE: 'DD[D] HH[H] mm[M]',
  FLATPICKR_OUTPUT: 'd/m/y H:i'
};

const BasePrice = {
  MIN: 1,
  DEFAULT: 0
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST:'past'
};

const NoPointsMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const Url = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {
  DateFormat,
  BasePrice,
  NoPointsMessage,
  FilterType,
  Mode,
  SortType,
  GAP_IN_MILLISECONDS,
  UserAction,
  UpdateType,
  BLANK_POINT,
  UNVALID_BASE_PRICE_PATTERN,
  Method,
  Url,
  TimeLimit
};
