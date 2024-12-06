class BulletImpactParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.life = 30; // Lifetime in frames
    this.color = color;
  }

  updateAndDraw() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    push();
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.life * 8);
    ellipse(this.x, this.y, 4);
    pop();
  }

  isDone() {
    return this.life <= 0;
  }
}

let bulletImpactParticles = [];
