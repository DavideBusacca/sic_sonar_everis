// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/BjoM9oKOAKY

var inc = 0.02;//added
var scl = 20;//added
var cols, rows;//added
var zoff = 0;//added
//var fr;
var particles = [];//added
var flowfield;
//var clicked;
//let coordsX = [];
//let coordsY = [];
//var opcaity;
var dir;
//var rad_count;
//var rad_dir;

var no_cursor_x;
var no_cursos_y;
var no_cursor_angle;
var no_cursor_dir;
var no_cursor_mag;
var no_cursor_bar;
var prev_no_cursor_bar;

// for red, green, and blue color values
let r, g, b;

var set_w = 400;
var set_h = 400;
var color_list = []


var barrios = [];//new Barrio(0,0,1);
//var barrio2 = [];//new Barrio(0,0,1);
//var barrio3 = [];//new Barrio(0,0,1);
//var barrio4 = [];//new Barrio(0,0,1);

function setup() {
  createCanvas(set_w,set_h);
  no_cursor_bar = 0;
  prev_no_cursor_bar = no_cursor_bar;
  //noCursor();
  var count = 0;
  var size = 200;
  // var scl = 5;
  for (var i = 0; i < set_w/size; i++){
    for (var j = 0; j < set_w/size; j++){
      barrios[count] = new Barrio(i*size,j*size,count,size, scl);
      count++;
    }
  }


  //barrio1 = new Barrio(0,0,1);
  //barrio2 = new Barrio(100,0,2);
  //barrio3 = new Barrio(0,100,3);
  //barrio4 = new Barrio(100,100,4);
  //rad_dir = 5;
  rad_count = 0;
  dir = 1;
  opacity = 127;

  no_cursor_x = width/2;
  no_cursor_y = height/2;
  no_cursor_angle = 0;
  no_cursor_dir = 0.5;
  no_cursor_mag = 0.5;
  /*coordsX[0] =56.5;
  coordsY[0] =-204.66;



  coordsX[1] =56.5;
  coordsY[1] =-94.66;

  coordsX[2] =56.5;
  coordsY[2] =-69.66;

  coordsX[3] =56.5;
  coordsY[3] =-44.66;

  coordsX[4] =39;
  coordsY[4] =-11.03;

  coordsX[5] = 6.5;
  coordsY[5] =-0;

  coordsX[6] = -6.5;
  coordsY[6] = 5.34;

  coordsX[7] = -45;
  coordsY[7] = 23.54;

  coordsX[8] = -56.5;
  coordsY[8] = 55.34;

  coordsX[9] = -56.5;
  coordsY[9] = 80.34;

  coordsX[10] = -56.5;
  coordsY[10] = 105.34;

  coordsX[11] = -56.5;
  coordsY[11] = 130.34;

  coordsX[12] = -56.5;
  coordsY[12] = 155.34;
  coordsX[13] = -56.5;
  coordsY[13] = 180.34;*/

  //d = 10;
  //O = ellipse(width / 2, height / 2, d, d);
  //O.mouseOver(changeGray);

  //image(svg, 0, 0, 200, 200);rad_count
  //path = querySVG('path')[1];
  //colorMode(HSB, 255);
  //SVG stuff
  //clicked = 0;
  /*cols = ceil(width / scl);
  rows = ceil(height / scl);
  //fr = createP('');
//rad_dir
  flowfield = new Array(cols * rows);
  var count = 0
  for (var i = 0; i < rows; i ++){
    for (var j = 0; j < cols; j ++){
        particles[count] = new Particle(j*(scl)+scl/2,i*(scl)+scl/2);
        count++;
      }
    }*/

  background(0);
  //r = random(255);
  //g = random(255);
  //b = random(255);
}

/*function changeGray() {
  d = d + 10;
  if (d > 100) {2
    d = 0;
  }
}*/
//function refresh(){
//redraw();
//}

function draw() {
  clear();
  background(0);

  /*if (windowWidth > ){
    windowWidth = set_w;
  }

  if (windowHeight > set_h){
    windowHeight = set_h;
  }*/



//////////// CURSOR STUFF

  no_cursor_x = no_cursor_x + no_cursor_mag * cos(no_cursor_angle);
  no_cursor_y = no_cursor_y + no_cursor_mag * sin(no_cursor_angle);

  if (no_cursor_x > set_w) {
    no_cursor_x = 0;
  }
  if (no_cursor_x < 0) {
    no_cursor_x = set_w;
  }

  if (no_cursor_y > set_h) {
    no_cursor_y = 0;
  }
  if (no_cursor_y < 0) {
    no_cursor_y = set_h;
  }
  /*if no_cursor_x < 0 {
    no_cursor_x = width;
  }*/
  push();
  translate(no_cursor_x, no_cursor_y);
  rotate(no_cursor_angle);
  rect(-25, -5, 50, 10);
  pop();

//barrio.update(no_cursor_x,no_cursor_y);

  for (var c = 0; c< barrios.length; c++){
    push();
    translate(barrios[c].pos.x,barrios[c].pos.y,)
    if ((no_cursor_x > barrios[c].pos.x) && (no_cursor_x < (barrios[c].pos.x + barrios[c].size)) && (no_cursor_y > barrios[c].pos.y) && (no_cursor_y < (barrios[c].pos.y + barrios[c].size))){
      no_cursor_bar = barrios[c].id;
      if (prev_no_cursor_bar != no_cursor_bar){
        print("I'm entering " + barrios[c].id);

        // Freesound retriever
        search = initSearch(function () {
          // TODO: get list of countries from d3 component
          search.querySoundsFromCountries(["rim", "clap", "Africa", "guitar", "violin", "bass", "fx"], function (sounds) {
            // Audio Engine
            sampler = audioInit()
            notes = updateSounds(sounds);
          });

        });
      }
      prev_no_cursor_bar = no_cursor_bar;
      //this.no_cursor_in = true;
    }
    barrios[c].update(no_cursor_x,no_cursor_y);
    pop();
  }


  /*var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      var shortest_dist = 1000000;2
      var dist_ind = 0;
      var angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(0.02);*/


  /*if (clicked == 1){
    var xP = x * scl+scl/2;
    var yP = y * scl+scl/2;
    for (var i = 0; i < 14; i++){
      var point_dist = dist((windowWidth / 2)+coordsX[i], (windowHeight / 2)+coordsY[i], xP, yP);
        if (point_dist < shortest_dist){
          shortest_dist = point_dist;
          dist_ind = i;
        }
    }
    var dX_j = (windowWidth / 2) + coordsX[dist_ind] - xP;
    var dY_j = (windowHeight / 2) + coordsY[dist_ind] - yP;
    var dX_m = mouseX - xP;
    var dY_m = mouseY - yP;
    var magn = sqrt(pow(dX_m,2),pow(dY_m,2));
    var mouse_dist = dist(mouseX, mouseY, xP, yP);
    if (mouse_dist < 100){
      var angle = atan2(dY_m,dX_m)-PI;
      //var angle = (-(1/100) * mouse_dist + 1) *  atan2(dY_m,dX_m)-PI;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(0.01);
      //var angle = (-(1/100) * mouse_dist + 1);// *  atan2(dY_m,dX_m)-PI;
    }
    else{
      var angle = atan2(dY_j,dX_j);
      var v = p5.Vector.fromAngle(angle);
      v.setMag(0.01);
      //var angle = atan2(dY_j,dX_j);
    }
    //var xNorm = dX/magn;
    //var xNorm = dY/magn;
    //var angle = 0;//atan2(dY,dX)-PI;//);//index;//0;//atan2(yNorm,xNorm);
  }*/


  //v.setMag(4);
  /*flowfield[index] = v;
  xoff += inc;
    stroke(255, 50);*/

  ////// DRAW ROTATION
  /*push();
  translate(x * scl, y * scl);
  //ellipse(x, y, 190, 190);
  rotate(v.heading());
  //strokeWeight(2);
  line(0, 0, scl, 0);
 pop();*/
  /*}
  yoff += inc;

  zoff += 0.0003;
}

for (var i = 0; i < particles.length; i++) {
  particles[i].follow(flowfield);
  particles[i].update(no_cursor_x, no_cursor_y);
  particles[i].edges(200,200);
  particles[i].show();
}*/


  //fill();
  //stroke(255);
  /*if (clicked == 0){
    stroke(255, 255, 255, 127);
    fill(255, 255, 255, 127);
    push();
    translate(mouseX,mouseY);
    beginShape();
    vertex(0,0);
    vertex(10,0);
    bezierVertex(10,5.22,5.22,10,0,10);
    vertex(0,0);
    endShape();
    pop();
  }
  if (clicked == 1){
    stroke(255, 255, 255, 127);
    //fill(255, 255, 255, opacity);
    /*push();ellipse(x, y, 190, 190);
    translate(mouseX,mouseY);
    ellipse(0,0,20,20);
    pop();
    if (opacity > 127){
      dir = -1;
    }
    if (opacity <= 0){
      dir = 1;
    }
    opacity = opacity + dir;
  }*/
  //push();
  //translate(windowWidth / 2, windowHeight / 2);
  /*ellipse(56.5, -204.66, 100, 100);
  //rect(6.5,-144.66,100,100);
  //arc(6.5,-44.66,200,200,PI/2*4,PI/2);
  //arc(-6.5,55.34,200,200,PI,-PI/2);
  //rect(-106.5,55.34,100,100);

  //stroke(255, 255, 255, 127);//, g, b);    if (opacity > 127){
  //noStroke();0.51
  //fill(255, 255, 255, 127);ellipse(x, y, 190, 190);
  beginShape();
  vertex(6.5,55.34);
  vertex(6.5,-144.66);
  vertex(106.5,-144.66);
  vertex(106.5,-44.66);
  bezierVertex(106.5, 11.22,
               51.28, 55.34,
                6.5,55.34);
  vertex(6.5,55.34);

  endShape();


  beginShape();
  vertex(-6.5,-44.66);
  bezierVertex(-61.72,-44.66,-106.5,0.12 , -106.5,55.34)
  vertex(-106.5,254.66);
  bezierVertex(-51.28,254.66,-6.5,210.56 ,0.51 -6.5,155.34)
  vertex(-6.5,-44.66);
  endShape();*/
  //pop();


  /*if(clicked == 1){
    drawGradient(mouseX, mouseY);
  }
  if (opacity > 127){
    dir = -1;
  }
  if (opacity <= 0){
    dir = 1;
  }
  opacity = opacity + dir;*/
  /*push();
  fill(255,opacity);
  noStroke();
  translate(windowWidth/2,windowHeight - 50)
  textSize(32);
  textAlign(CENTER);
  //stroke(255,opacity);
  text('Coming Soon', 0, 0);
  pop();*/
}

// When the user clicks the mouse
//function mousePressed() {
// Check if mouse is inside the circle    ellipse(x, y, 100, 100);
//translate(windowWidth / 2, windowHeight / 2);
//ellipse(56.5, -204.66, 100, 100);
/*let d = dist(mouseX, mouseY, (windowWidth / 2)+56.5, (windowHeight / 2) - 204.66);
if (d < 50) {
  // Pick new random color values
  clicked = !clicked;
  if (clicked){
    //select('canvas','defaultCanvas0').position(100, 100);
    select('div','mySidenav').style('width:200px');
  }
  if (!clicked){
    //select('canvas','defaultCanvas0').position(0, 0);
    select('div','mySidenav').style('width:0px');
  }
  rad_count = 0;
  rad_dir = 5;
}*/
//}

/*function drawGradient(x, y) {
  let radius = 500
  let h = 0;
  //noStroke();
  //for (let r = radius; r > 20; --r) {
  //h = (h + 0.1) % 360;
//}
    fill(255,127)
    ellipse(x, y, 20, 20);
    noFill();
    //stroke(255, rad_count)//-100)
    stroke(255, 127-(rad_count+10)%127-100)
    ellipse(x, y, 200, 200);
    stroke(255, 127 -(rad_count+20)%127-90)
    ellipse(x, y, 190, 190);
    stroke(255, 127 -(rad_count+30)%127-80)
    ellipse(x, y, 180, 180);
    stroke(255, 127 -(rad_count+40)%127-70)
    ellipse(x, y, 170, 170);
    stroke(255, 127 -(rad_count+50)%127-60)
    ellipse(x, y, 160, 160);
    stroke(255, 127 -(rad_count+60)%127-50)
    ellipse(x, y, 150, 150);
    stroke(255, 127 -(rad_count+70)%127-40)
    ellipse(x, y, 140, 140);
    stroke(255, 127 -(rad_count+80)%127-30)
    ellipse(x, y, 130, 130);
    stroke(255, 127 -(rad_count+90)%127-20)
    ellipse(x, y, 120, 120);
    stroke(255, 127 -(rad_count+100)%127-10)
    ellipse(x, y, 110, 110);
    stroke(255, 127 -(rad_count+110)%127)
    ellipse(x, y, 100, 100);
    stroke(255, 127 -(rad_count+120)%127)
    ellipse(x, y, 90, 90);
    stroke(255, 127 -(rad_count+130)%127)
    ellipse(x, y, 80, 80);
    stroke(255, 127 -(rad_count+140)%127)
    ellipse(x, y, 70, 70);
    stroke(255, 127 -(rad_count+150)%127)
    ellipse(x, y, 60, 60);
    stroke(255, 127 -(rad_count+160)%127)
    ellipse(x, y, 50, 50);
    stroke(255, 127 -(rad_count+170)%127)
    ellipse(x, y, 40, 40);
    stroke(255, 127 -(rad_count+180)%127)
    ellipse(x, y, 30, 30);
    rad_count = rad_count + rad_dir;
    //if (rad_count >= 127 || rad_count <= 0){
    //  rad_dir = rad_dir * (-1)
    //}

}*/

/*function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}*/



function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    no_cursor_angle = no_cursor_angle - 0.1;
  } else if (keyCode === RIGHT_ARROW) {
    no_cursor_angle = no_cursor_angle + 0.1;
  }
}
