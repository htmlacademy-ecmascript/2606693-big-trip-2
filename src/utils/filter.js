import dayjs from 'dayjs';
import { TEST_DATE, FilterType } from '../const.js';

// Тестовая дата для проверки рендера разных фильтров (taxi Kioto)
const testDate = TEST_DATE;

const isFromFuture = (date) => dayjs(testDate).isBefore(dayjs(date));

const isPresent = (dateFrom, dateTo) => {
  const currentDate = dayjs(testDate);
  return currentDate.isBefore(dayjs(dateTo)) && currentDate.isAfter(dayjs(dateFrom));
};

const isFromPast = (date) => dayjs(testDate).isAfter(dayjs(date));

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFromFuture(point.date_from)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresent(point.date_from, point.date_to)),
  [FilterType.PAST]: (points) => points.filter((point) => isFromPast(point.date_to)),
};

export {filter};

