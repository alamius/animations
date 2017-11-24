var Z = {x:0, y:0}; //inversion center
var i = {x:1, y:1}; //inversion radii
var M = {x:0, y:0}; //inversed center
var r = {x:0.5, y:1.5}; //inversed radii
var c = 0;
var c_incr = 0.01; //resolution/speed of change in c
var c_max = 10;
// var length; //== sqrt(sq(A.x - cos(c) * r.x - Z.x) + sq(A.y - sin(c) * r.y - Z.y));
// const TWO_PI = 6.28;
var t = new Range([-3, 3, 0.05]);
M_movement = {
    noise: false,
    velocity: true,
    move: function(){
        if(M_movement.noise){                   M = { x: noise(c)*3-1.5, y: noise(c+1)*3-1.5} }
        if(M_movement.velocity && vel.active){  M = { x: M.x + vel.x,    y: M.y + vel.y     } }
    }
};
var vel = {x:0, y:0};

var shape;
var diagram, diagram2;
var stretch;

function setup() {
    createCanvas(600, 600);
    shape = new Para_function(
        // function(t){ return cos(t) * r.x + M.x; },
        // function(t){ return sin(t) * r.y + M.y; }
        function(t){ return t + M.x; },
        function(t){ return pow(t, 2) + M.y; },
        t
    );
    diagram = new Diagram(
        t,
        [-HALF_PI, HALF_PI]
    );
    diagram2 = new Diagram(
        t,
        [-HALF_PI, HALF_PI]
    );
    stretch = new Stretch();
    looping = true;
    frameRate(3);
}

function inverse(x, y, Z, i){
    return {x: (x/(sq(x) + sq(y))), y: (y/(sq(x) + sq(y)))};
}

function angle_points(I, J){
    return atan((J.y - I.y)/(J.x - I.x));
}

function draw() {
    c += c_incr;
    background(255);
    noFill();
    stroke(0);
    M_movement.move();
    stretch.show(); //grid lines
    strokeWeight(2);
    stretch.ellipse(Z.x, Z.y, i.x, i.y); //circle of inversion
    // stretch.dot(Z.x, Z.y, [0]);
    shape.get_graph();
    if(typeof t == "number"){
        console.log("number!");
    }
    for(t.init(); t.in_range(); t.next()){
        col = map(t.val, t.min, t.max, 0, 170);
        O = shape.get_point(t.val);
        // stretch.dot(O.x, O.y, [0, 0, col]);
        try{
            stroke(0, 0, col);
            stretch.line(P.x, P.y, O.x, O.y);
        }catch(ReferenceError){
            P = shape.get_point('last');
            stroke(0, 0, col);
            stretch.line(P.x, P.y, O.x, O.y);
        };

        I = inverse(O.x, O.y, Z, i);
        // stretch.dot(I.x, I.y, [col, col, 0]);
        try{
            stroke(col, col, 0);
            stretch.line(J.x, J.y, I.x, I.y);
        }catch(ReferenceError){
            J = inverse(shape.get_point(shape.t.max));
            stroke(col, col, 0);
            stretch.line(J.x, J.y, I.x, I.y);
        };
        //diagramming the arctan(derivative)
        if(t.in_range()){
            diagram.write({x:t.val, y:angle_points(I, J)});
            diagram2.write({x:t.val, y:angle_points(O, P)});
        }
        //replacing the old by the new, relevant for the next iteration
        P = O;
        J = I;
        // console.log(round(O.x), round(O.y), round(I.x), round(I.y));
    }
    diagram.show();
    diagram.P = [];
    diagram2.show();
    diagram2.P = [];
    // if(frameCount > 10){
    // if(c > 10){
    //     noLoop();
    // }
}

function keyPressed(){
    if(!M_movement.velocity){
        if(keyCode == 32){
            looping = !looping;
            if(looping){      loop();
            }else{            noLoop();
            }
        }else if(keyCode == RIGHT_ARROW){
            M.x += 0.1;
        }else if(keyCode == UP_ARROW){
            M.y += 0.1;
        }else if(keyCode == LEFT_ARROW){
            M.x -= 0.1;
        }else if(keyCode == DOWN_ARROW){
            M.y -= 0.1;
        }
    }else{
        if(
            keyCode == 32 && !vel.active ||
            [RIGHT_ARROW, UP_ARROW, LEFT_ARROW, DOWN_ARROW].includes(keyCode)
        ){
            vel.active = true;
        }else if(keyCode == 32){
            vel.active = false;
        }else if(keyCode == 64 + 14){ // N
            vel = {x:0, y:0};
        }else if(keyCode == 64 + 13){ // M
            M = {x:0, y:0};
        }
        if(keyCode == RIGHT_ARROW){
            vel.x += 0.01;
        }else if(keyCode == UP_ARROW){
            vel.y += 0.01;
        }else if(keyCode == LEFT_ARROW){
            vel.x -= 0.01;
        }else if(keyCode == DOWN_ARROW){
            vel.y -= 0.01;
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

function Range(rng){
    if(rng instanceof Array){
        this.min = rng[0] || 0;
        this.max = rng[1] || 1;
        this.incr = rng[2] || 0.01;
        this.val = rng[3] || this.from;
    }else{
        this.min = rng.min || 0;
        this.max = rng.max || 1;
        this.incr = rng.incr || 0.01;
        this.val = rng.val || this.from;
    }

    this.init = function(){
        this.val = this.min;
    }

    this.next = function(n){
        if(n !== undefined && n >= 0){
            for(k = 0; k < n; k++){
                this.val += this.incr;
            }
        }else{
            this.val += this.incr;
        }
        return this.val;
    }

    this.in_range = function(){
        return (this.min <= this.val + this.incr/2) && (this.val < this.max);
    }

    this.map_val = function(){
        return map(this.val, this.min, this.max, 0, 1);
    }
}
