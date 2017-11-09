function Stretch(){
    this.height = height - diagram.height;
    // this.x_min = -3;
    // this.x_max =  3;
    // this.y_min = -3;
    // this.y_max =  3;
    this.x_min = int(min(   M.x-r.x,    Z.x-i.x)) - 2;
    this.x_max = int(max(   M.x+r.x,    Z.x+i.x)) + 2;
    this.w = this.x_max - this.x_min;
    this.y_min = int(min(   M.y-r.y,    Z.y-i.y)) - 2;
    this.y_max = int(max(   M.y+r.y,    Z.y+i.y)) + 2;
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
