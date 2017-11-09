var Z = {x:0, y:0};
var r = {x:0.5, y:4};
var A = {x:0, y:1};
var c = -2; //== theta == time == x of the diagram
var c_incr = 0.2; //resolution of theta ...
var length; //== sqrt(sq(A.x - cos(c) * r.x - Z.x) + sq(A.y - sin(c) * r.y - Z.y));

var diagram;
var grid;

function setup() {
    createCanvas(600, 600);
    diagram = new Diagram();
    grid = new Grid();
    looping = true;
    frameRate(3);
}

function formula(c){
    return sqrt(sq(A.x - cos(c) * r.x - Z.x) + sq(A.y - sin(c) * r.y - Z.y));
}

function draw() {
    c += c_incr;
    background(255);
    noFill();
    stroke(0);
    grid.show();
    strokeWeight(2);
    grid.ellipse(Z.x, Z.y, r.x, r.y);
    grid.dot(Z.x, Z.y, [0]);
    C = {
        x:cos(c) * r.x + Z.x,
        y:sin(c) * r.y + Z.y,
    }
    grid.dot(A.x, A.y, [0, 0, 170]);
    stroke(170, 0, 0);
    grid.line(A.x, A.y, C.x, C.y);
    grid.dot(C.x, C.y);
    length = formula(c);
    // if(c < TWO_PI){
        diagram.write({x:c/2, y:length});
    // }
    diagram.show();
    // noLoop();
}

function keyPressed(){
    if(keyCode == 32){
        looping = !looping;
        if(looping){      loop();
        }else{            noLoop();
        }
    }
}

function Grid(){
    this.height = height - diagram.height;
    this.x_min = min(A.x, Z.x-r.x) - 1;
    this.x_max = max(A.x, Z.x+r.x) + 1;
    this.w = this.x_max - this.x_min;
    this.y_min = min(A.y, Z.y-r.y) - 1;
    this.y_max = max(A.y, Z.y+r.y) + 1;
    this.h = this.y_max - this.y_min;
    this.diff = createVector(width / this.w, (this.height) / this.h);

    this.show = function(){
        for(var x = this.x_min; x < this.x_max; x++){
            if(x == 0){           strokeWeight(2);
            }else{                strokeWeight(1);
            }
            x_s = this.map_x(x); //flipping to standard coodinate-representation
            line(x_s, 0, x_s, this.height);
        }
        for(var y = this.y_min; y < this.y_max; y++){
            if(y == 0){           strokeWeight(2);
            }else{                strokeWeight(1);
            }
            y_s = this.map_y(y); //flipping to standard coodinate-representation
            line(width, y_s, 0, y_s);
        }
    }

    this.ellipse = function(Zx, Zy, rx, ry){
        ellipse(
            this.map_x(Zx),
            this.map_y(Zy),
            rx * this.diff.x * 2,
            ry * this.diff.y * 2
        );
    }

    this.dot = function(Zx, Zy, size, color){
        if(size === undefined){        size = 3;        }
        else if(size instanceof Array){color = size; size = 3;    }
        if(!(color instanceof Array)){ color = [170, 0, 0, 255];
        }else{
            if(color.length === 0){    color = [     170,        0,        0,      255];    }else
            if(color.length === 1){    color = [color[0], color[0], color[0],      255];    }else
            if(color.length === 2){    color = [color[0], color[0], color[0], color[1]];    }else
            if(color.length === 3){    color = [color[0], color[1], color[2],      255];    }else
            if(color.length >=  4){    color = [color[0], color[1], color[2], color[3]];    }
        }
        fill(color);
        stroke(color);
        ellipse(
            this.map_x(Zx),
            this.map_y(Zy),
            size * 2,
            size * 2
        );
    }

    this.line = function(x1, y1, x2, y2){
        line(
            this.map_x(x1),
            this.map_y(y1),
            this.map_x(x2),
            this.map_y(y2)
        );
    }

    this.map_x = function(x){
        return map(x, this.x_min, this.x_max, 0, width);
    }
    this.map_y = function(y){
        return map(y, this.y_min, this.y_max, this.height, 0);
    }
}

function Diagram(){
    this.height = 100;
    this.x_min = -2;
    this.x_max = 8;
    this.y_min = -5;
    this.y_max = 15;
    this.P = [];

    this.formula = function(x){
        c = x;
        y = sqrt(sq(A.x - cos(c) * r.x - Z.x) + sq(A.y - sin(c) * r.y - Z.y));
        this.P.push({x:x, y:y});
        return y;
    }

    this.write = function(point){
        if(
            point.x > this.x_max
            || point.x < this.x_min
            || point.y > this.y_max
            || point.y < this.y_min
        ){return 0;}
        this.P.push(point);
    }

    this.show = function(){
        for(i = 1; i < this.P.length; i++){
            p = this.P[i];
            // near = get_nearest_point(this.P, p);
            near = this.P[i-1];
            if(near !== undefined){
                this.px = map(   p.x, this.x_min, this.x_max, 0, width);
                this.py = map(   p.y, this.y_min, this.y_max, height, height-this.height);
                this.nx = map(near.x, this.x_min, this.x_max, 0, width);
                this.ny = map(near.y, this.y_min, this.y_max, height, height-this.height);
                line(this.px, this.py, this.nx, this.ny);
            }
        }
    }
}

function get_nearest_point(P, p){
    minimum = Infinity;
    m_index = -1;
    for(j = 0; j < P.length; j++){
        d = dist(P[j].x, P[j].y, p.x, p.y);
        // d = abs(P[j].x - p.x);
        if(d < minimum && d > 0){
            m_index = j;
            minimum = dist(P[m_index].x, P[m_index].y, p.x, p.y);
        }
    }
    if(m_index == -1){
        return undefined;
    }else{
        return P[m_index];
    }
}
