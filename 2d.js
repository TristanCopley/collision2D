let c = document.getElementById('canvas');
let ctx = c.getContext('2d');

c.width = window.innerWidth;
c.height = window.innerHeight;


let dt = 0.0;
let oldTimeStamp = 0.0;


geometryPrefabs = {

    square: [

        [-100, -100],
        [100, -100],
        [100, 100],
        [-100, 100],
        [-50, 0]

    ],

}

// Loop
function loop(timeStamp) {

    // Calculate the number of seconds passed since the last frame
    dt = timeStamp - oldTimeStamp;
    oldTimeStamp = timeStamp;

    ctx.clearRect(0 ,0, c.width, c.height);

    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'red';
    ctx.lineWidth = 2;

    drawGeometry(c.width / 2, c.height / 2, timeStamp / 1000, geometryPrefabs.square)

    window.requestAnimationFrame(loop);

}

// Start gameLoop
loop(0);

function collide(geometry1, geometry2) {



}

function drawGeometry(x, y, rotation, vertexes) {

    ctx.beginPath();

    let len = vertexes.length;

    let p = vertexes[0];
    ctx.moveTo(x + p[0] * Math.cos(rotation) - p[1] * Math.sin(rotation), y + p[1] * Math.cos(rotation) + p[0] * Math.sin(rotation));

    for (let i = 0; i < len; i++) {

        let p = vertexes[(i + 1) % len];

        ctx.lineTo(x + p[0] * Math.cos(rotation) - p[1] * Math.sin(rotation), y + p[1] * Math.cos(rotation) + p[0] * Math.sin(rotation));
        ctx.stroke();

    }

    ctx.fill();

}