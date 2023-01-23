const WIDTH = 1200;
const HEIGHT = 850;

let canvas;
let context;

let boids = [];

let rockImg;
let paperImg;
let scissorsImg;

function preload() {
    rockImg = loadImage('./rock.png');
    paperImg = loadImage('./paper.png');
    scissorsImg = loadImage('./scissors.png');
}

function setup() {
    canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent("canvas");

    context = canvas.drawingContext;

    frameRate(30);
    // background(100);

    for (let i = 0; i < 40; i++) {
        boids.push(new Boid(Math.floor(random(1, 4))));
    }
}

function draw() {
    for (const b of boids) {
        b.update();
    }
    for (const b of boids) {
        for (const o of boids.filter((o) => o.type === BEHAVIOUR[b.type].DOM)) {
            if (b.pos.dist(o.pos) < 2*R) {
                b.type = o.type;
            }
        }
    }

    background(80);
    var bgGraient = context.createRadialGradient(WIDTH/2, HEIGHT/2, max(WIDTH/2, HEIGHT/2)*1.15,
        WIDTH/2, HEIGHT/2, max(WIDTH/2, HEIGHT/2)*0.85);
    bgGraient.addColorStop(1, 'transparent');
    bgGraient.addColorStop(0, color(0, 0, 0, 50));
    context.fillStyle = bgGraient;
    rect(0, 0, WIDTH, HEIGHT);

    for (const b of boids) {
        b.draw();
    }
}

function show(x, y, r, c) {
    noStroke();

    var gradient = context.createRadialGradient(x, y, r*1.05, x, y, 0);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, color(0, 0, 0, 100));
    context.fillStyle = gradient;
    ellipse(x, y, r*1.05*2, r*1.05*2);

    context.fillStyle = c;
    ellipse(x, y, r, r);
}

const R = 40;
const TERM_VEL = 100;
const ACC_FORCE = 180;

const SEPERATION_RADIUS = R*1;
const FIGHT_RADIUS = 300;
const FIGHT_FAC = Math.log(10) / FIGHT_RADIUS;
const FLIGHT_RADIUS = 200;
const FLIGHT_FAC = Math.log(10) / FLIGHT_RADIUS;

const TYPE = {
    null: 0,
    rock: 1,
    paper: 2,
    siccorcs: 3,
};

const COLOR = {
    0: 'rgb(255, 255, 255)',
    1: 'rgb(255, 0, 0)',
    2: 'rgb(0, 255, 0)',
    3: 'rgb(0, 0, 255)',
};

const BEHAVIOUR = {
    0: { WALL_AVOIDANCE: 5, SEPERATION: 5, FIGHT: 4, FLIGHT: 3, SUB: 10, DOM: 10 },
    1: { WALL_AVOIDANCE: 5, SEPERATION: 5, FIGHT: 4, FLIGHT: 3, SUB: TYPE.siccorcs, DOM: TYPE.paper },
    2: { WALL_AVOIDANCE: 5, SEPERATION: 5, FIGHT: 4, FLIGHT: 3, SUB: TYPE.rock, DOM: TYPE.siccorcs },
    3: { WALL_AVOIDANCE: 5, SEPERATION: 5, FIGHT: 4, FLIGHT: 3, SUB: TYPE.paper, DOM: TYPE.rock },
}

class Boid {

    type = TYPE.null;

    pos = new p5.Vector();
    vel = new p5.Vector();
    acc = new p5.Vector();

    constructor(type = TYPE.null, x = random(WIDTH), y = random(HEIGHT)) {
        this.type = type;
        this.pos.x = x;
        this.pos.y = y;

        this.vel.x = random(-1, 1);
        this.vel.y = random(-1, 1);
        this.vel.setMag(random(TERM_VEL));
    }

    update() {
        this.acc.set(0, 0);

        // SEPERATION
        let com = new p5.Vector();
        let count = 0;
        for (const b of boids.filter((b) => b.type === this.type)) {
            if (this.pos.dist(b.pos) <= SEPERATION_RADIUS) {
                com.add(b.pos);
                count++;
            }
        }
        if (count > 0) {
            com.div(count);
            const force = new p5.Vector(com.x-this.pos.x, com.y-this.pos.y)
                .setMag(-ACC_FORCE*BEHAVIOUR[this.type].SEPERATION);
            this.acc.add(force);
        }

        // FIGHT
        com.set(0, 0);
        count = 0;
        for (const b of boids.filter((b) => b.type === BEHAVIOUR[this.type].SUB)) {
            if (this.pos.dist(b.pos) <= FIGHT_RADIUS) {
                const w = Math.floor(10/(Math.pow(Math.E, FIGHT_FAC*this.pos.dist(b.pos))));
                com.x += b.pos.x * w;
                com.y += b.pos.y * w;
                count += w;
            }
        }
        if (count > 0) {
            com.div(count);
            const force = new p5.Vector(com.x-this.pos.x, com.y-this.pos.y)
                .setMag(ACC_FORCE*BEHAVIOUR[this.type].FIGHT);
            this.acc.add(force);
        }
        
        // FLIGHT
        com.set(0, 0);
        count = 0;
        for (const b of boids.filter((b) => b.type === BEHAVIOUR[this.type].DOM)) {
            if (this.pos.dist(b.pos) <= FLIGHT_RADIUS) {
                const w = Math.floor(10/(Math.pow(Math.E, FLIGHT_FAC*this.pos.dist(b.pos))));
                com.x += b.pos.x * w;
                com.y += b.pos.y * w;
                count += w;
            }
        }
        if (count > 0) {
            com.div(count);
            const force = new p5.Vector(com.x-this.pos.x, com.y-this.pos.y)
                .setMag(-ACC_FORCE*BEHAVIOUR[this.type].FLIGHT);
            this.acc.add(force);
        }

        // AVOID WALLS
        if (this.pos.x < SEPERATION_RADIUS*0.5) {
            this.acc.x += ACC_FORCE*BEHAVIOUR[this.type].WALL_AVOIDANCE;
        } else if (this.pos.x > WIDTH-SEPERATION_RADIUS*2) {
            this.acc.x -= ACC_FORCE*BEHAVIOUR[this.type].WALL_AVOIDANCE;
        }
        if (this.pos.y < SEPERATION_RADIUS*0.5) {
            this.acc.y += ACC_FORCE*BEHAVIOUR[this.type].WALL_AVOIDANCE;
        } else if (this.pos.y > HEIGHT-SEPERATION_RADIUS*2) {
            this.acc.y -= ACC_FORCE*BEHAVIOUR[this.type].WALL_AVOIDANCE;
        }

        // If nothing else: accelerate forward
        if (this.acc.mag() == 0) {
            this.acc = this.vel.copy()
        }

        // Apply forces
        this.acc.setMag(ACC_FORCE);
        this.acc.add(this.getAirResistance());

        this.vel.x += this.acc.x * (deltaTime / 1000);
        this.vel.y += this.acc.y * (deltaTime / 1000);

        this.pos.x += this.vel.x * (deltaTime / 1000);
        this.pos.y += this.vel.y * (deltaTime / 1000);
    }

    getAirResistance() {
        var resistanceForce = Math.pow(this.vel.mag(), 2) * (ACC_FORCE / Math.pow(TERM_VEL, 2))

        return this.vel.copy().setMag(-resistanceForce);
    }

    draw() {
        noStroke();

        var gradient = context.createRadialGradient(this.pos.x, this.pos.y, R*1.05, this.pos.x, this.pos.y, 0);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, color(0, 0, 0, 100));
        context.fillStyle = gradient;
        ellipse(this.pos.x, this.pos.y, R*1.05*2, R*1.05*2);

        // context.fillStyle = color(COLOR[this.type]);
        // ellipse(this.pos.x, this.pos.y, R, R);
        let img;
        if (this.type === TYPE.paper) {
            img = paperImg;
        } else if (this.type === TYPE.rock) {
            img = rockImg;
        } else if (this.type === TYPE.siccorcs) {
            img = scissorsImg;
        }
        image(img, this.pos.x-R, this.pos.y-R, R*2, R*2);
    }
}
