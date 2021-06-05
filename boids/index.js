var WIDTH = 1200
var HEIGHT = 850

var numBoids = 75
var boids = []

var predator

function setup() {
    var canv = createCanvas(WIDTH, HEIGHT)
    canv.parent("canvas")
    frameRate(30)

    init()
}

function init() {
    boids = []
    for (i = 0; i < numBoids; i++) {
        boids[i] = new Boid(random(WIDTH), random(HEIGHT))
    }

    predator = new Predator(random(WIDTH), random(HEIGHT))
}

function draw() {
    for (b of boids) {
        b.update()
    }
    if (PREDATOR_ENABLED) {
        predator.update()
    }

    background(68, 70, 75)
    for (b of boids) {
        b.draw()
    }
    if (PREDATOR_ENABLED) {
        predator.draw()
    }
}

function menuItemChanged(item) {
    switch (item.id) {
        case "num-boids":
            numBoids = item.value
            init()
            break
        case "boid-radius":
            BOID_R = item.value
            break
        case "show-acc":
            SHOW_ACC = item.checked
            break
        case "show-vel":
            SHOW_VEL = item.checked
            break
        case "show-vis-range":
            SHOW_VIS_RANGE = item.checked
            break
        case "show-sep-range":
            SHOW_SEP_RANGE = item.checked
            break
        case "vis-range":
            BOID_VISUAL_RANGE = item.value;
            break
        case "sep-range":
            BOID_SEPERATION_RANGE = item.value;
            break
        case "cohesion":
            ENABLE_COHESION = item.checked
            break
        case "seperation":
            ENABLE_SEPERATION = item.checked
            break
        case "alignment":
            ENABLE_ALIGNMENT = item.checked
            break
        case "acc-force":
            BOID_ACC_FORCE = int(item.value)
            break
        case "term-vel":
            BOID_TERM_VEL = int(item.value)
            break
        case "predator":
            PREDATOR_ENABLED = item.checked
            break
        case "mouse-ctl":
            predator.pointerControll = item.checked
            break
    }
}