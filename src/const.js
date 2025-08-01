const POINTS_COUNT = 10;

const TEST_DATE = '2025-10-07T07:00:00';

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
  MIN: 100,
  MAX: 9999
};

const NoPointsMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST:'past'
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

export {
  POINTS_COUNT,
  TEST_DATE,
  DateFormat,
  BasePrice,
  NoPointsMessage,
  FilterType,
  Mode,
  SortType
};
