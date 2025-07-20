import { getRandomPoint } from '../mock/points.js';
import { POINTS_COUNT } from '../const.js';

class PointsModel {
  #points = Array.from({length: POINTS_COUNT}, getRandomPoint);

  get points() {
    return this.#points;
  }

}

export default PointsModel;
