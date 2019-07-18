// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/BjoM9oKOAKY

let tail = [];

function Particle(X,Y) {
  this.pos = createVector(X, Y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.dir = 0.5;
  this.maxspeed = 2;
  this.id = int(random(0,5));
  this.h = 255/this.id;
  this.no_cursor_dist = 100000000;
  this.in = 0;

  this.prevPos = this.pos.copy();

  this.update = function(cur_x, cur_y) {
    this.no_cursor_dist = sqrt(pow(cur_x - this.pos.x,2)+pow(cur_y - this.pos.y,2));
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if ((this.no_cursor_dist < 10) && (this.in == 0)){
      print("hit " + this.id);
      playEvent(this.id);
      //var input = document.getElementById("test");
      //this.in = 1;
    }

    if (this.no_cursor_dist > 10){
      this.in = 0;
    }
  }

  this.follow = function(vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.show = function() {
    stroke(this.h, 127-255/this.id, 255 - this.h, 255);
    fill(this.h, 127-255/this.id, 255 - this.h, 255);
    //this.h = this.h + this.dir;
    if (this.h > 255) {
      this.dir = this.dir *(-1);
      //this.h = 0;
    }
    if (this.h <= 0) {
      this.dir = this.dir * (-1);
      //this.h = 0;
    }
    strokeWeight(2);

    //line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    ellipse(this.pos.x, this.pos.y, 3, 3);
    this.updatePrev();
  }

  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  this.edges = function() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }

  }

}
