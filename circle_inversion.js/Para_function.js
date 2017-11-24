function Para_function(fx, fy, range){
    this.fx = fx    || function(t){    return t;   };
    this.fy = fy    || function(t){    return t;   };
    if(range !== undefined){
        this.t = new Range(range);
    }else{
        this.t = new Range([0, 6.28, 0.05]);
    }
    this.G = [];

    this.get_graph = function(){
        this.G = [];
        for(this.t.init(); this.t.in_range(); this.t.next()){
            this.G.push(createVector(
                this.fx(this.t.val),
                this.fy(this.t.val)
            ));
        }
    }

    this.get_point = function(t){
        if(t === 'last'){
            return this.G[this.G.length-1];
        }
        return this.G[floor(map(t, this.t.min, this.t.max, 0, this.G.length))];
    }

    this.show_graph = function(x_range, y_range){
        x_min = x_range[0] || -1;
        x_max = x_range[1] || 5;
        dx = x_range[2]    || 0;
        y_min = y_range[0] || -1;
        y_max = y_range[1] || 5;
        dy = y_range[2]    || 0;
        for(i = 0; i < this.G.length; i++){
            x = map(this.G[i].x, x_min, x_max, height, 0);
            y = map(this.G[i].y, y_min, y_max, 0, width);
            noStroke();
            // fill(i/this.G.length*255, i/this.G.length*255, i/this.G.length*255, 20);
            fill(64, 0, 0, 1);
            ellipse(x, y, 15);
        }
    }

    this.eliminate = function(){
        passed_under = 0;
        passed_over = 5;
        for(i = 0; i < this.G.length; i++){
            for(j = i+1; j < this.G.length; j++){
                if(
                    !( // not at (0|0)
                        this.G[i].x == 0
                        && this.G[i].y == 0
                    ) && dist( // near point i
                        this.G[i].x,
                        this.G[i].y,
                        this.G[j].x,
                        this.G[j].y
                    ) < 0.02
                    && j - i > (this.G.length / 200) // not at the same spot #TODO: make it precise and calulate the number of intersections
                ){
                    if(j - passed_under >= 10 && j - passed_over < 10){
                        console.log(
                            round(this.G[i].x*100)/100,
                            round(this.G[i].y*100)/100,
                            round(this.G[j].x*100)/100,
                            round(this.G[j].y*100)/100,
                            i, j
                        );
                        this.G[j-2] = createVector(0, 0);
                        this.G[j-1] = createVector(0, 0);
                        this.G[j] = createVector(0, 0);
                        this.G[j+1] = createVector(0, 0);
                        this.G[j+2] = createVector(0, 0);
                        j += 2;
                        passed_under = j;
                    }else
                    if(j - passed_over >= 10 && j - passed_under < 10){
                        console.log(
                            round(this.G[i].x*100)/100,
                            round(this.G[i].y*100)/100,
                            round(this.G[j].x*100)/100,
                            round(this.G[j].y*100)/100,
                            i, j
                        );
                        this.G[i-2] = createVector(0, 0);
                        this.G[i-1] = createVector(0, 0);
                        this.G[i] = createVector(0, 0);
                        this.G[i+1] = createVector(0, 0);
                        this.G[i+2] = createVector(0, 0);
                        i += 2;
                        passed_over = j;
                    }
                }
            }
        }
    }

    this.joined = function(){
        return dist(this.G[0].x, this.G[0].y, this.G[this.G.length-1].x, this.G[this.G.length-1].y) < 0.05;
    }

    this.set_to_next_joined_c = function(step){
        step = step || 0.01;
        c_original = c;
        c += 0.1;
        this.get_graph();
        while(!this.joined() && abs(c - c_original) < 3){
            c += step;
            this.get_graph();
        }
        return c_original;
    }

    this.get_partial_vector = function(t){ //approximation of the derivative
        g1 = this.G[floor(t/thid.dt)];
        g2 = this.G[floor(t/thid.dt) + 1];
        return createVector(
            g1.x,
            g1.y,
            g2.x,
            g2,y
        );
    }
}
