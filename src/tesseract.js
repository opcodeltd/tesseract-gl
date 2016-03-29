import THREE from 'three';

function buildRotate4(xy, xz, yz, xw, yw, zw) {
    let rxy = new THREE.Matrix4();
    let rxz = new THREE.Matrix4();
    let ryz = new THREE.Matrix4();
    let rxw = new THREE.Matrix4();
    let ryw = new THREE.Matrix4();
    let rzw = new THREE.Matrix4();

    rxy.set(
        Math.cos(xy), -Math.sin(xy), 0, 0,
        Math.sin(xy), Math.cos(xy), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    rxz.set(
        Math.cos(xz), 0, -Math.sin(xz), 0,
        0, 1, 0, 0,
        Math.sin(xz), 0, Math.cos(xz), 0,
        0, 0, 0, 1
    );

    ryz.set(
        1, 0, 0, 0,
        0, Math.cos(yz), -Math.sin(yz), 0,
        0, Math.sin(yz), Math.cos(yz), 0,
        0, 0, 0, 1
    );

    rxw.set(
        Math.cos(xw), 0, 0, -Math.sin(xw),
        0, 1, 0, 0,
        0, 0, 1, 0,
        Math.sin(xw), 0, 0, Math.cos(xw)
    );

    ryw.set(
        1, 0, 0, 0,
        0, Math.cos(yw), 0, -Math.sin(yw),
        0, 0, 1, 0,
        0, Math.sin(yw), 0, Math.cos(yw)
    );
    rzw.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, Math.cos(zw), -Math.sin(zw),
        0, 0, Math.sin(zw), Math.cos(zw)
    );
    let r = rxy.clone();
    r.multiply(rxz);
    r.multiply(ryz);
    r.multiply(rxw);
    r.multiply(ryw);
    r.multiply(rzw);

    return r;
}

class Cube4 {
    constructor() {
        this.points = [
            new THREE.Vector4(0, 0, 0, 0),
            new THREE.Vector4(0, 0, 1, 0),
            new THREE.Vector4(0, 1, 0, 0),
            new THREE.Vector4(0, 1, 1, 0),
            new THREE.Vector4(1, 0, 0, 0),
            new THREE.Vector4(1, 0, 1, 0),
            new THREE.Vector4(1, 1, 0, 0),
            new THREE.Vector4(1, 1, 1, 0)
        ];

        this.lines = [
            [0, 1, 3, 2, 0],
            [4, 5, 7, 6, 4],
            [0, 4],
            [1, 5],
            [3, 7],
            [2, 6]
        ];

        this.faces = [
            [0, 1, 3, 2],
            [4, 5, 7, 6],
            [0, 4, 5, 1],
            [3, 7, 6, 2],
            [1, 5, 7, 3],
            [2, 6, 4, 0]
        ];
    }

    sub(v) {
        let c4 = this.clone();
        c4.points.forEach((p) => p.sub(v));
        return c4;
    }

    add(v) {
        let c4 = this.clone();
        c4.points.forEach((p) => p.add(v));
        return c4;
    }

    multiplyScalar(s) {
        let c4 = this.clone();
        c4.points.forEach((p) => p.multiplyScalar(s));
        return c4;
    }

    applyMatrix4(m) {
        let c4 = this.clone();
        c4.points.forEach((p) => p.applyMatrix4(m));
        return c4;
    }

    rotate4(xy, xz, yz, xw, yw, zw) {
        let r = buildRotate4(xy, xz, yz, xw, yw, zw);
        return this.applyMatrix4(r);
    }

    clone() {
        let c4 = new Cube4();
        for (let i = 0; i < this.points.length; i++) {
            c4.points[i] = this.points[i].clone();
        }
        return c4;
    }

    getLines() {
        let lines = [];
        this.lines.forEach((l) => {
            for (let i = 1; i < l.length; i++) {
                lines.push([this.points[l[i-1]], this.points[l[i]]]);
            }
        });
        return lines;
    }

    getLinesAsVector3() {
        return this.getLines().map((line) => {
            return [
                new THREE.Vector3(line[0].x, line[0].y, line[0].z),
                new THREE.Vector3(line[1].x, line[1].y, line[1].z),
            ]
        })
    }

    getVertices() {
        return this.points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    }

    getCubeAsGeometry() {
        let shape = new THREE.Geometry();
        shape.dynamic = true;
        this.getVertices().forEach((v) => {
            shape.vertices.push(v);
        });
        console.log(shape.vertices);

        this.faces.forEach((f) => {
            shape.faces.push(new THREE.Face3(f[0], f[1], f[2]));
            shape.faces.push(new THREE.Face3(f[2], f[3], f[0]));
            // shape.faces.push(new THREE.Face3(f[2], f[1], f[0]));
            // shape.faces.push(new THREE.Face3(f[0], f[3], f[2]));
        });

        shape.computeFaceNormals();
        return shape;
    }

    getFacesAsGeometry() {
        let vertices = this.getVertices();
        let results = [];

        this.faces.forEach((f) => {
            let shape = new THREE.Geometry();
            shape.dynamic = true;
            shape.vertices.push(vertices[f[0]]);
            shape.vertices.push(vertices[f[1]]);
            shape.vertices.push(vertices[f[2]]);
            shape.vertices.push(vertices[f[3]]);
            shape.faces.push(new THREE.Face3(0, 1, 2));
            shape.faces.push(new THREE.Face3(2, 3, 0));
            shape.computeFaceNormals();
            results.push(shape);
        });

        return results;
    }

    dumpVertices() {
        this.points.forEach((p) => {
            console.log(p.x, p.y, p.z, p.y);
        });
    }

    equals(cube) {
        for (let i = 0; i< this.points.length; i++) {
            if (!this.points[i].equals(cube.points[i])) {
                return false;
            }
        }
        return true;
    }
}

export default class Tesseract {
    constructor(size) {
        this.size = size;
        this.rotation = buildRotate4(0, 0, 0, 0, 0, 0);

        let base = new Cube4().sub(new THREE.Vector4(0.5, 0.5, 0.5, 0)).multiplyScalar(0.95).sub(new THREE.Vector4(0,0,0,-0.5));

        this.cubes = [
            base,
            base.rotate4(0, 0, 0, Math.PI, 0, 0),
            base.rotate4(0, 0, 0, Math.PI / 2, 0, 0),
            base.rotate4(0, 0, 0, -Math.PI / 2, 0, 0),
            base.rotate4(0, 0, 0, 0, Math.PI / 2, 0),
            base.rotate4(0, 0, 0, 0, -Math.PI / 2, 0),
            base.rotate4(0, 0, 0, 0, 0, Math.PI / 2),
            base.rotate4(0, 0, 0, 0, 0, -Math.PI / 2)
        ];
    }

    setRotation(xy, xz, yz, xw, yw, zw) {
        this.rotation = buildRotate4(xy, xz, yz, xw, yw, zw);
    }

    applyTransform(point) {
        point = point.clone();
        point.applyMatrix4(this.rotation);
        point.multiplyScalar(this.size);

        return point;
    }

    transform(c) {
        return c
            .applyMatrix4(this.rotation)
            .multiplyScalar(this.size);
    }

    getCubeSet() {
        return this.cubes.map((c) => this.transform(c));
    }
}
