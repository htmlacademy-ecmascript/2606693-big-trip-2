import { points } from '../mock/points.js';
import { POINTS_COUNT } from '../const.js';

class PointsModel {
  #points = points.slice(0, POINTS_COUNT);

  get points() {
    return this.#points;
  }

}

export default PointsModel;
