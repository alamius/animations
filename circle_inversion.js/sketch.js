var Z = {x:0, y:0}; //inversion center
var i = {x:1, y:1}; //inversion radii
var M = {x:1, y:0}; //inversed center
var r = {x:0.5, y:1.5}; //inversed radii
var c = 0;
var c_incr = 0.01; //resolution/speed of change in c
var c_max = 10;
// var length; //== sqrt(sq(A.x - cos(c) * r.x - Z.x) + sq(A.y - sin(c) * r.y - Z.y));
var t_incr = 0.05;
M_movement = {
    noise: false,
    velocity: true
};
var vel = {x:0, y:0};

var diagram;
var stretch;

function setup() {
    createCanvas(600, 600);
    diagram = new Diagram();
    stretch = new Stretch();
    looping = true;
    // frameRate();
}

function inverse(x, y, Z, i){
    return {x: (x/(sq(x) + sq(y))), y: (y/(sq(x) + sq(y)))};
}

function draw() {
    c += c_incr;
    background(255);
    noFill();
    stroke(0);
    // M.y = -1 + c;
    if(M_movement.noise){
        M = {
            x: noise(c)*3-1.5,
            y: noise(c+1)*3-1.5
        }
    }
    if(M_movement.velocity && vel.active){
        M = {
            x: M.x + vel.x,
            y: M.y + vel.y
        }
    }
    stretch.show(); //grid lines
    strokeWeight(2);
    stretch.ellipse(Z.x, Z.y, i.x, i.y);
    // stretch.dot(Z.x, Z.y, [0]);
    for(t = 0; t < TWO_PI; t += t_incr){
        col = t/TWO_PI*170;
        O = {
            x:cos(t) * r.x + M.x,
            y:sin(t) * r.y + M.y
        }
        // stretch.dot(O.x, O.y, [0, 0, col]);
        try{
            stroke(0, 0, col);
            stretch.line(P.x, P.y, O.x, O.y);
        }catch(ReferenceError){
            P = {
                x: cos(TWO_PI) * r.x + M.x,
                y: sin(TWO_PI) * r.y + M.y
            }
            stroke(0, 0, col);
            stretch.line(P.x, P.y, O.x, O.y);
        };

        I = inverse(O.x, O.y, Z, i);
        // stretch.dot(I.x, I.y, [col, col, 0]);
        try{
            stroke(col, col, 0);
            stretch.line(J.x, J.y, I.x, I.y);
        }catch(ReferenceError){
            J = inverse(P);
            stroke(col, col, 0);
            stretch.line(J.x, J.y, I.x, I.y);
        };
        P = O;
        J = I;
        // console.log(round(O.x), round(O.y), round(I.x), round(I.y));
    }
    // length = formula(c);
    // // if(c < TWO_PI){
    //     diagram.write({x:c/2, y:length});
    // // }
    // diagram.show();
    // if(frameCount > 1){
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
