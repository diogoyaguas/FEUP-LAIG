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
};