import dayjs from 'dayjs';
import { FilterType } from '../const.js';

const isFromFuture = (date) => dayjs().isBefore(dayjs(date));

const isPresent = (dateFrom, dateTo) => {
  const currentDate = dayjs();
  return currentDate.isBefore(dayjs(dateTo)) && currentDate.isAfter(dayjs(dateFrom));
};

const isFromPast = (date) => dayjs().isAfter(dayjs(date));

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFromFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isFromPast(point.dateTo)),
};

export {filter};

