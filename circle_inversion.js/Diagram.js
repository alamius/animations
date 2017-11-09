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
