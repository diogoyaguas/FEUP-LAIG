/**
 * Creates a board game
 *
 * @class Cell
 */
class Cell {
  constructor(plane, x, y, pieceType, num) {
    this.num = num;
    this.plane = plane;
    this.x = x;
    this.y = y;
    this.pieceType = pieceType;
  };

  distanceBetween(otherCell, direction) {
    if (direction == "vertical" || direction == "diagonal")
      return Math.abs(otherCell.x - this.x);
    else if (direction == "horizontal")
      return Math.abs(otherCell.y - this.y);
  };
};