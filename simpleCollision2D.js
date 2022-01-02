class simpleCollision2D {

    constructor() {

        this.meshPrefabs = {

            mesh1: [

                [-100, -100],
                [-50, -50],
                [100, -100],
                [50, -50],
                [100, 100],
                [50, 50],
                [-100, 100],
                [-50, 50]

            ],

            mesh2: [

                [0, -100.0],
                [86.6, 50.0],
                [-86.6, 50.0]

            ]

        }

        this.entity = class {

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

    }

    lineSegmentCollision(A, B, C, D) {

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

    updatePosition(entity, friction) {

        let temp = entity.motion.position.current.x;
        entity.motion.position.current.x = (2 - friction[0]) * entity.motion.position.current.x - (1 - friction[0]) * entity.motion.position.old.x + entity.motion.position.acceleration.x;
        entity.motion.position.old.x = temp;

        temp = entity.motion.position.current.y;
        entity.motion.position.current.y = (2 - friction[1]) * entity.motion.position.current.y - (1 - friction[1]) * entity.motion.position.old.y + entity.motion.position.acceleration.y;
        entity.motion.position.old.y = temp;

        temp = entity.motion.rotation.current;
        entity.motion.rotation.current = (2 - friction[2]) * entity.motion.rotation.current - (1 - friction[2]) * entity.motion.rotation.old + entity.motion.rotation.acceleration;
        entity.motion.rotation.old = temp;

        entity.motion.position.acceleration.x = 0;
        entity.motion.position.acceleration.y = 0;
        entity.motion.rotation.acceleration = 0;

    }

    checkCollision(A, B) {

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

                if (this.lineSegmentCollision(pointA, pointB, pointC, pointD)) {

                    return true

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

                if (this.lineSegmentCollision(pointA, pointB, pointC, pointD)) {

                    return true

                }

            }

        }

        return false

    }

    drawGeometry(geometry, context) {

        let vertices = geometry.vertices;
        let rotation = geometry.motion.rotation.current;
        let x = geometry.motion.position.current.x;
        let y = geometry.motion.position.current.y;

        context.beginPath();

        let len = vertices.length;

        let p = vertices[0];
        context.moveTo(x + p[0] * Math.cos(rotation) - p[1] * Math.sin(rotation), y + p[1] * Math.cos(rotation) + p[0] * Math.sin(rotation));

        for (let i = 0; i < len; i++) {

            let p = vertices[(i + 1) % len];

            context.lineTo(x + p[0] * Math.cos(rotation) - p[1] * Math.sin(rotation), y + p[1] * Math.cos(rotation) + p[0] * Math.sin(rotation));
            context.stroke();

        }

        context.fill();

    }

    collide(A, B) {

        if (this.checkCollision(A, B)) {

            let deltaPositionA = [(A.motion.position.current.x - A.motion.position.old.x) * 0.5, (A.motion.position.current.y - A.motion.position.old.y) * 0.5];
            let deltaPositionB = [(B.motion.position.current.x - B.motion.position.old.x) * 0.5, (B.motion.position.current.y - B.motion.position.old.y) * 0.5];

            let deltaRotationA = (A.motion.rotation.current - A.motion.rotation.old) * 0.5;
            let deltaRotationB = (B.motion.rotation.current - B.motion.rotation.old) * 0.5;

            A.motion.position.current.x -= deltaPositionA[0];
            A.motion.position.current.y -= deltaPositionA[1];
            B.motion.position.current.x -= deltaPositionB[0];
            B.motion.position.current.y -= deltaPositionB[1];

            A.motion.rotation.current -= deltaRotationA;
            B.motion.rotation.current -= deltaRotationB;

            for (let i = 0; i < 7; i++) {

                deltaPositionA[0] *= 0.5;
                deltaPositionA[1] *= 0.5;
                deltaPositionB[0] *= 0.5;
                deltaPositionB[1] *= 0.5;

                deltaRotationA *= 0.5;
                deltaRotationB *= 0.5;

                if (this.checkCollision(A, B)) {

                    A.motion.position.current.x -= deltaPositionA[0];
                    A.motion.position.current.y -= deltaPositionA[1];
                    B.motion.position.current.x -= deltaPositionB[0];
                    B.motion.position.current.y -= deltaPositionB[1];

                    A.motion.rotation.current -= deltaRotationA;
                    B.motion.rotation.current -= deltaRotationB;

                } else {

                    A.motion.position.current.x += deltaPositionA[0];
                    A.motion.position.current.y += deltaPositionA[1];
                    B.motion.position.current.x += deltaPositionB[0];
                    B.motion.position.current.y += deltaPositionB[1];

                    A.motion.rotation.current += deltaRotationA;
                    B.motion.rotation.current += deltaRotationB;

                }

            }

            if (this.checkCollision(A, B)) {

                A.motion.position.current.x -= deltaPositionA[0];
                A.motion.position.current.y -= deltaPositionA[1];
                B.motion.position.current.x -= deltaPositionB[0];
                B.motion.position.current.y -= deltaPositionB[1];

                A.motion.rotation.current -= deltaRotationA;
                B.motion.rotation.current -= deltaRotationB;

            }

            A.motion.position.acceleration.x = (A.motion.position.current.x - A.motion.position.old.x) * -2;
            A.motion.position.acceleration.y = (A.motion.position.current.y - A.motion.position.old.y) * -2;
            B.motion.position.acceleration.x = (B.motion.position.current.x - B.motion.position.old.x) * -2;
            B.motion.position.acceleration.y = (B.motion.position.current.y - B.motion.position.old.y) * -2;

            A.motion.rotation.acceleration = (A.motion.rotation.current - A.motion.rotation.old) * -2;
            B.motion.rotation.acceleration = (B.motion.rotation.current - B.motion.rotation.old) * -2;

            console.log(this.checkCollision(A, B));

        }

    }

}