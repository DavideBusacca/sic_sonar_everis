// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/BjoM9oKOAKY

var inc = 0.02;//added
var scl = 20;//added
var cols, rows;//added
var zoff = 0;//added

var barrios_coords = [
  [0,	0,	0,	56,	0,	0,	0,	0,	0],//1
  [0,	0,	55,	50,	53,	57,	0,	0,	0],//2
  [0,	0,	54,	48,	51,	52,	58,	0,	0],//3
  [0,	0,	49,	47,	46,	45,	59,	0,	0],//4
  [0,	40,	43,	36,	44,	60,	61,	73,	0],//5
  [41,	42,	38,	37,	34,	35,	62,	63,	72],//6
  [39,	28,	29,	30,	33,	64,	65,	71,	70],//7
  [22,	25,	27,	31,	32,	6,	66,	68,	69],//8
  [23,	24,	26,	8,	7,	5,	4,	67,	0],//9
  [21,	20,	19,	9,	1,	2,	3,	0,	0],//10
  [0,	17,	18,	15,	10,	0,	0,	0,	0],//11
  [0,	0,	16,	14,	11,	0,	0,	0,	0],//12
  [0,	0,	0,	13,	12,	0,	0,	0,	0]//13
]

var rect_size = 53;

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

var curr_barrio;
var prev_curr_barrio;

// for red, green, and blue color values
let r, g, b;

var set_w = 700;
var set_h = 700;
var bar_size = 700;
var color_list = []


var barrios = [];//new Barrio(0,0,1);

let table;
let dens_table;

function preload() {
  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  table = loadTable('data/grid_bcn.csv', 'csv', 'header');
  dens_table = loadTable('data/barris_geo1.csv','csv','header');
  //the file can be remote
  //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
  //                  "csv", "header");
}


function setup() {
  createCanvas(1366,768);

  curr_barrio = 0;
  prev_curr_barrio = curr_barrio;


  no_cursor_bar = 0;
  prev_no_cursor_bar = no_cursor_bar;
  //noCursor();
  var count = 0;
  //var size = 100;
  // var scl = 5;
  for (var i = 0; i < set_w/bar_size; i++){
    for (var j = 0; j < set_w/bar_size; j++){
      barrios[count] = new Barrio(i*bar_size,j*bar_size,count,bar_size, scl);
      count++;
    }
  }

  rad_count = 0;
  dir = 1;
  opacity = 127;

  no_cursor_x = width/2;
  no_cursor_y = height/2;
  no_cursor_angle = 0;
  no_cursor_dir = 0.5;
  no_cursor_mag = 5;

  background(0);

}

function draw() {
  clear();
  background(0);


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
push();
translate(1366-700-34,34);
translate(no_cursor_x, no_cursor_y);
rotate(no_cursor_angle);
rect(-25, -5, 50, 10);
pop();
  for (var c = 0; c< barrios.length; c++){
    push();
    translate(1366-700-34,34);
    translate(barrios[c].pos.x,barrios[c].pos.y,)
    barrios[c].update(no_cursor_x,no_cursor_y);
    pop();
  }

  //cycle through the table
  push();
  translate(80,34);
  for (let r = 0; r < table.getRowCount(); r++){
    //for (let c = 0; c < table.getColumnCount(); c++) {
    var rect_y = int(table.getString(r,1))-1;
    var rect_x = int(table.getString(r,2))-1;
    rect(rect_x*rect_size,rect_y*rect_size,rect_size,rect_size);
  }
  pop();
  if (keyIsDown(LEFT_ARROW)){
    no_cursor_angle = no_cursor_angle - 0.1;
  }
  if (keyIsDown(RIGHT_ARROW)){
    no_cursor_angle = no_cursor_angle + 0.1;
  }

}



/*function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    no_cursor_angle = no_cursor_angle - 0.1;
  } else if (keyCode === RIGHT_ARROW) {
    no_cursor_angle = no_cursor_angle + 0.1;
  }
}*/

function mouseClicked() {
  var Y = int((mouseX-80)/rect_size);
  var X = int((mouseY-34)/rect_size);
  if (X>=0 && Y>0){
  if (barrios_coords[X][Y]){
    curr_bario = barrios_coords[X][Y];
    if (curr_bario != prev_curr_barrio){
      barrios.splice(0, barrios.length);
      //print(barrios_coords[X][Y]);
      notes = [];

      search = initSearch(function () {
        // TODO: get list of countries from d3 component
        search.querySoundsFromCountries(["rim", "clap", "Africa", "guitar", "violin", "bass", "fx"], function (sounds) {
            // Audio Engine
            [sampler, samplerDistortion, lfoSamplerDistortion] = audioInit()
            notes = updateSounds(sounds);
          });
      });


      for (var i = 0; i < set_w/bar_size; i++){
        for (var j = 0; j < set_w/bar_size; j++){
          barrios[0] = new Barrio(i*bar_size,j*bar_size,barrios_coords[X][Y],bar_size, scl);
        }
      }

      prev_curr_barrio = curr_bario;
    }
  }
  }
}
