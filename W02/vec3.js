class Vec3 {
    
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    sum() {
        return this.x + this.y + this.z;
    }

    min() {
        let min = this.x;
        if (this.y < min) {min = this.y;}
        if (this.z < min) {min = this.z;}
        return min;
    }

    max() {
        let max = this.x;
        if (this.y > max) {max = this.y;}
        if (this.z > max) {max = this.z;}
        return max;
    }

    mid() {
        let max = this.max();
        let min = this.min();
        if (max !== this.x && min !== this.x) {return this.x;}
        if (max !== this.y && min !== this.y) {return this.y;}
        if (max !== this.z && min !== this.z) {return this.z;}
    }

}