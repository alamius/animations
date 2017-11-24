function Diagram(x_rng, y_rng){
    this.height = 100;
    this.x_min = x_rng[0] || x_rng.min || -3;
    this.x_max = x_rng[1] || x_rng.max || 3;
    this.y_min = y_rng[0] || y_rng.min || -1;
    this.y_max = y_rng[1] || y_rng.max || 1;
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
            if(near !== undefined && dist(p.x, p.y, near.x, near.y) < 1){
                this.px = map(   p.x, this.x_min, this.x_max, 0, width);
                this.py = map(   p.y, this.y_min, this.y_max, height, height-this.height);
                this.nx = map(near.x, this.x_min, this.x_max, 0, width);
                this.ny = map(near.y, this.y_min, this.y_max, height, height-this.height);
                line(this.px, this.py, this.nx, this.ny);
            }
        }
    }
}
