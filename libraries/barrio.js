var color_palette = ['red','orange','yellow','green','blue','purple','pink'];

function Barrio(X,Y, id, size, scl){
    this.pos = createVector(X,Y);
    this.size = size;
    this.inc = 0.2;
    this.scl = scl;
    this.col_rows = ceil(this.size / this.scl);
    this.zoff = ceil(random(0,1000));
    this.particles = [];
    this.id = id;
    this.no_cursor_in = 0;
    this.colors = randomColor({
        count: 7,
        hue: color_palette[this.id%7],
        format: 'rgba'
    });
    this.flowfield = new Array(this.col_rows * this.col_rows);
    var count = 0
    for (var i = 0; i < this.col_rows; i ++){
        for (var j = 0; j < this.col_rows; j ++){
            var particle_id = int(random(0,7));
            var color = this.colors[particle_id];
            //print(color);
            this.particles[count] = new Particle(j*(this.scl)+this.scl/2,i*(this.scl)+this.scl/2,particle_id,color);
            count++;
        }
    }
    //print(this.col_rows);

    this.update = function(no_cursor_x, no_cursor_y){
        //Below checking if the cursor is in the current barrio
        //else{
        //  this.no_cursor_in = false;
        //}
        /*else{
          this.no_cursor_in = false;
        }*/
        //print(yoff);
        var yoff = 0;
        for (var y = 0; y < this.col_rows; y++) {
            //print(yoff);
            var xoff = 0;
            for (var x = 0; x < this.col_rows; x++) {
                var index = x + y * this.col_rows;
                //print(index);
                //var shortest_dist = 1000000;
                var dist_ind = 0;
                var angle = noise(yoff, xoff, this.zoff) * TWO_PI * 32;
                var v = p5.Vector.fromAngle(angle);
                v.setMag(0.01);
                //v.setMag(4);
                this.flowfield[index] = v;
                xoff += this.inc;
                stroke(255, 50);
                ////// DRAW ROTATION
                /*push();
                translate(x * this.scl, y * this.scl);
                //ellipse(x, y, 190, 190);
                rotate(v.heading());
                strokeWeight(2);
                line(0, 0, this.scl, 0);
                pop();*/
                //noFill();
                //scale(0.5);
                //rect(0,0,this.size,this.size);
            }
        }
        yoff += this.inc;
        this.zoff += 0.0005;

        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].follow(this.flowfield,this.scl,this.col_rows);
            this.particles[i].update(no_cursor_x, no_cursor_y,this.pos.x,this.pos.y);
            this.particles[i].edges(this.size,this.size);
            this.particles[i].show();
        }
    }
}
