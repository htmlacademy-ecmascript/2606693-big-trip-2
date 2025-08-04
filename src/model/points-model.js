import Observable from '../framework/observable.js';

import { points } from '../mock/points.js';
import { POINTS_COUNT } from '../const.js';
import { getRandomItemsArray } from '../utils/common.js';

class PointsModel extends Observable {
  #points = getRandomItemsArray(points, POINTS_COUNT);

  get points() {
    return this.#points;
  }

}

export default PointsModel;
