// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/BjoM9oKOAKY
//console.log("I'm starting");

let tail = [];

function Particle(X,Y,id,color) {
  this.pos = createVector(X, Y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.dir = 0.5;
  this.color = color;
  this.maxspeed = 2;
  this.id = id;
  this.h = 255/this.id;
  this.no_cursor_dist = 100000000;
  this.in = 0;

  this.prevPos = this.pos.copy();

  this.update = function(cur_x, cur_y, bar_x, bar_y) {
    this.no_cursor_dist = sqrt(pow((cur_x - (this.pos.x + bar_x)),2)+pow((cur_y - (this.pos.y+bar_y)),2));
    //print(this.pos.y + bar_y);
    //print(no_cursor_dist);
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if ((this.no_cursor_dist < 10) && (this.in == 0)){
      //print("hit " + this.id);
      //chickenWrapper();
      //var input = document.getElementById("test");
      //console.log("I'm calling " + this.id);
      changeColor(this.color);
      playEvent(this.id);
      this.in = 1;
    }

    if (this.no_cursor_dist > 10){
      this.in = 0;
    }
  }

  this.follow = function(vectors,scl,cols) {
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
    stroke(color);
    fill(color);

    //stroke(this.h, 127-255/this.id, 255 - this.h, 255);
    //fill(this.h, 127-255/this.id, 255 - this.h, 255);

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
    ellipse(this.pos.x, this.pos.y, this.id+1, this.id+1);
    this.updatePrev();
  }

  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  this.edges = function(w,h) {
    if (this.pos.x > w) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = w;
      this.updatePrev();
    }
    if (this.pos.y > h) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = h;
      this.updatePrev();
    }

  }

}
