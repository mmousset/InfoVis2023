function crossProduct(v1, v2) {
    let x = (v1.y * v2.z) - (v1.z * v2.y);
    let y = (v1.z * v2.x) - (v1.x * v2.z);
    let z = (v1.x * v2.y) - (v1.y * v2.x);
    return new Vec3(x, y, z);
}

function length(v) {
    var sum = 0;
    sum += Math.pow(v.x, 2);
    sum += Math.pow(v.y, 2);
    sum += Math.pow(v.z, 2);
    return Math.sqrt(sum);
}

function areaOfTriangle(v0, v1, v2) {
    return 1 / 2 * Math.abs(length(crossProduct(v1.sub(v0), v2.sub(v0))));
}