let c = document.getElementById('canvas');
let ctx = c.getContext('2d');

c.width = window.innerWidth;
c.height = window.innerHeight;


let dt = 0.0;
let oldTimeStamp = 0.0;


meshPrefabs = {

    mesh1: [

        [0, -100.0],
        [86.6, 50.0],
        [-86.6, 50.0]

    ],

    mesh2: [

        [0, -100.0],
        [86.6, 50.0],
        [-86.6, 50.0]

    ]

}



class Geometry {

    constructor(mesh) {

        this.vertices = mesh;
        this.motion = {

            position: {

                current: {

                    x: 0,
                    y: 0

                },

                old: {

                    x: 0,
                    y: 0

                },

                acceleration: {

                    x: 0,
                    y: 0

                },

            },

            rotation: {

                current: 0,

                old: 0,

                acceleration: 0

            }

        };

    };

}

let a = new Geometry(meshPrefabs.mesh1);
let b = new Geometry(meshPrefabs.mesh2);

a.motion.position.current.x = 500
a.motion.position.current.y = 500
b.motion.position.current.x = 670
b.motion.position.current.y = 450

// Loop
function loop(timeStamp) {

    // Calculate the number of seconds passed since the last frame
    dt = timeStamp - oldTimeStamp;
    oldTimeStamp = timeStamp;

    ctx.clearRect(0 ,0, c.width, c.height);

    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'red';
    ctx.lineWidth = 2;

    drawGeometry(a);
    drawGeometry(b);

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;

    collide(a, b);

    a.motion.rotation.current += 0.005
    b.motion.rotation.current += 0.008

    window.requestAnimationFrame(loop);

}

// Start gameLoop
loop(0);

function collide(A, B) {

    let lenA = A.vertices.length;
    let lenB = B.vertices.length;
    let rotA = A.motion.rotation.current;
    let rotB = B.motion.rotation.current;
    let pointA;
    let pointB;
    let pointC;
    let pointD;

    for (let i = 0; i < lenA; i++) {

        let p = A.vertices[i];
        pointA = [A.motion.position.current.x, A.motion.position.current.y];
        pointB = [A.motion.position.current.x + p[0] * Math.cos(rotA) - p[1] * Math.sin(rotA), A.motion.position.current.y + p[1] * Math.cos(rotA) + p[0] * Math.sin(rotA)];


        for (let ii = 0; ii < lenB; ii++) {

            let p0 = B.vertices[ii % lenB];
            let p1 = B.vertices[(ii + 1) % lenB];
            pointC = [B.motion.position.current.x + p0[0] * Math.cos(rotB) - p0[1] * Math.sin(rotB), B.motion.position.current.y + p0[1] * Math.cos(rotB) + p0[0] * Math.sin(rotB)];
            pointD = [B.motion.position.current.x + p1[0] * Math.cos(rotB) - p1[1] * Math.sin(rotB), B.motion.position.current.y + p1[1] * Math.cos(rotB) + p1[0] * Math.sin(rotB)];

            ctx.moveTo(pointA[0], pointA[1]);
            ctx.lineTo(pointB[0], pointB[1]);
            ctx.stroke();

            ctx.moveTo(pointC[0], pointC[1]);
            ctx.lineTo(pointD[0], pointD[1]);
            ctx.stroke();

            if (lineSegmentCollision(pointA, pointB, pointC, pointD)) {

                ctx.strokeStyle = 'purple';
                ctx.fillStyle = 'green';
                ctx.lineWidth = 2;

                drawGeometry(a);

            }

        }

    }

    for (let i = 0; i < lenB; i++) {

        let p = B.vertices[i];
        pointA = [B.motion.position.current.x, B.motion.position.current.y];
        pointB = [B.motion.position.current.x + p[0] * Math.cos(rotB) - p[1] * Math.sin(rotB), B.motion.position.current.y + p[1] * Math.cos(rotB) + p[0] * Math.sin(rotB)];

        for (let ii = 0; ii < lenA; ii++) {

            let p0 = A.vertices[ii % lenA];
            let p1 = A.vertices[(ii + 1) % lenA];
            pointC = [A.motion.position.current.x + p0[0] * Math.cos(rotA) - p0[1] * Math.sin(rotA), A.motion.position.current.y + p0[1] * Math.cos(rotA) + p0[0] * Math.sin(rotA)];
            pointD = [A.motion.position.current.x + p1[0] * Math.cos(rotA) - p1[1] * Math.sin(rotA), A.motion.position.current.y + p1[1] * Math.cos(rotA) + p1[0] * Math.sin(rotA)];

            ctx.moveTo(pointA[0], pointA[1]);
            ctx.lineTo(pointB[0], pointB[1]);
            ctx.stroke();

            ctx.moveTo(pointC[0], pointC[1]);
            ctx.lineTo(pointD[0], pointD[1]);
            ctx.stroke();

            if (lineSegmentCollision(pointA, pointB, pointC, pointD)) {

                ctx.strokeStyle = 'purple';
                ctx.fillStyle = 'green';
                ctx.lineWidth = 2;

                drawGeometry(b);

            }

        }

    }

}

function drawGeometry(geometry) {

    let vertices = geometry.vertices;
    let rotation = geometry.motion.rotation.current;
    let x = geometry.motion.position.current.x;
    let y = geometry.motion.position.current.y;

    ctx.beginPath();

    let len = vertices.length;

    let p = vertices[0];
    ctx.moveTo(x + p[0] * Math.cos(rotation) - p[1] * Math.sin(rotation), y + p[1] * Math.cos(rotation) + p[0] * Math.sin(rotation));

    for (let i = 0; i < len; i++) {

        let p = vertices[(i + 1) % len];

        ctx.lineTo(x + p[0] * Math.cos(rotation) - p[1] * Math.sin(rotation), y + p[1] * Math.cos(rotation) + p[0] * Math.sin(rotation));
        ctx.stroke();

    }

    ctx.fill();

}

function lineSegmentCollision(A, B, C, D) {

    let a1 = B[1] - A[1];
    let b1 = A[0] - B[0];
    let c1 = a1 * A[0] + b1 * A[1];

    let a2 = D[1] - C[1];
    let b2 = C[0] - D[0];
    let c2 = a2 * C[0] + b2 * C[1];

    let determinant = a1 * b2 - a2 * b1;

    if (determinant === 0) return undefined;

    let x = (b2 * c1 - b1 * c2) / determinant;
    let y = (a1 * c2 - a2 * c1) / determinant;

    if (

        x >= Math.floor(Math.min(A[0], B[0])) &&
        x <= Math.ceil(Math.max(A[0], B[0])) &&
        y >= Math.floor(Math.min(A[1], B[1])) &&
        y <= Math.ceil(Math.max(A[1], B[1])) &&

        x >= Math.floor(Math.min(C[0], D[0])) &&
        x <= Math.ceil(Math.max(C[0], D[0])) &&
        y >= Math.floor(Math.min(C[1], D[1])) &&
        y <= Math.ceil(Math.max(C[1], D[1]))

    ) return [x, y];

    return undefined;

}
