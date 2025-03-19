class Item {
  constructor(startX, startY, id, src) {
    this.startX = startX;
    this.startY = startY;
    this.width = 70;
    this.height = 70;
    this.id = id;
    this.src = src;
  }

  draw(ctx, src, x, y) {
    const image = new Image();
    image.src = src;
    ctx.drawImage(image, x, y, this.width, this.height);
  }

  move(x, y) {
    this.startX = x;
    this.startY = y;
  }

  mouseInItem(x, y) {
    if (
      x < this.startX &&
      x > this.startX + this.width &&
      y < this.startY &&
      y > this.startY + this.height
    ) {
      return true;
    } else if (
      x > this.startX &&
      x < this.startX + this.width &&
      y > this.startY &&
      y < this.startY + this.height
    ) {
      return true;
    }
    return false
  }
}

export default Item;