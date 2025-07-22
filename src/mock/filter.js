import { filter } from '../utils/filter.js';

function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterType, filterPonts]) => ({
      type: filterType,
      count: filterPonts(points).length,
    }),
  );
}

export { generateFilter };
