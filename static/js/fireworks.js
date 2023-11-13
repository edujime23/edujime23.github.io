// when animating on canvas, it is best to use requestAnimationFrame instead of setTimeout or setInterval
// not supported in all browsers though and sometimes needs a prefix, so we need a shim
window.requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

// now we will set up our basic variables for the demo
let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    // firework collection
    fireworks = [],
    // particle collection
    particles = [],
    // when launcanvas.heighting fireworks with a click, too many get launcanvas.heighted at once without a limiter, one launcanvas.height per 5 loop ticks
    limiterTotal = 0,
    limiterTick = 0,
    // this will time the auto-launcanvas.heightes of fireworks, one launcanvas.height per 80 loop ticks
    timerTotal = 40,
    timerTick = 0,
    mousedown = false,
    // mouse x coordinate
    mx,
    // mouse y coordinate
    my;

// set canvas dimensions
canvas.width = $(window).width()
canvas.height = $(window).height()

$(window).on("resize", function() {
    canvas.width = $(window).width()
    canvas.height = $(window).height()
});

// Create a radial gradient for the background glow
let bgGlow = 0;
let bgGlowGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.height);

// Set gradient colors and positions
bgGlowGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
bgGlowGradient.addColorStop(0.2, 'rgba(255, 255, 255, ' + bgGlow + ')');
bgGlowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

// get a random number within a range
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// calculate the distance between two points
function calculateDistance(p1x, p1y, p2x, p2y) {
    let xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// create firework
function Firework(sx, sy, tx, ty) {
    // actual coordinates
    this.x = sx;
    this.y = sy;
    // starting coordinates
    this.sx = sx;
    this.sy = sy;
    // target coordinates
    this.tx = tx;
    this.ty = ty;
    // distance from starting point to target
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    // track the past coordinates of eacanvas.height firework to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 3;
    // populate initial coordinate collection with the current coordinates
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2.5;
    this.acceleration = 1.05;
    // Generate a random this.hue value between 0 and 360
    this.hue = random(0, 360);
    this.brightness = random(50, 70);
    // circle target indicator radius
    this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function (index) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);

    // cycle the circle target indicator radius
    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    // speed up the firework
    this.speed *= this.acceleration;

    // get the current velocities based on angle and speed
    let vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
    // how far will the firework have traveled with velocities applied?
    this.distanceTraveled = calculateDistance(
        this.sx,
        this.sy,
        this.x + vx,
        this.y + vy
    );

    // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reacanvas.heighted
    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty, this.hue);
        // remove the firework, use the index passed into the update function to determine whicanvas.height to remove
        fireworks.splice(index, 1);
    } else {
        // target not reacanvas.heighted, keep traveling
        this.x += vx;
        this.y += vy;
    }
};

// draw firework
Firework.prototype.draw = function () {
    ctx.beginPath();
    // move to the last tracked coordinate in the set, then draw a line to the current x and y
    ctx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle =
        'hsl(' + this.hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();

    ctx.beginPath();
    // draw the target for this firework with a pulsing circle
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
};

// create particle
function Particle(x, y, hue) {
    this.x = x;
    this.y = y;
    // track the past coordinates of eacanvas.height particle to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    // set a random angle in all possible directions, in radians
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    // friction will slow the particle down
    this.friction = 0.95;
    // gravity will be applied and pull the particle down
    this.gravity = 1;
    // store the hue color as a property of the particle
    this.hue = hue;
    this.brightness = random(50, 80);
    this.alpha = 1;
    // set how fast the particle fades out
    this.decay = random(0.015, 0.03);
}

// update particle
Particle.prototype.update = function (index) {
    // remove the last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);
    // slow down the particle
    this.speed *= this.friction;
    // apply velocity
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    // fade out the particle
    this.alpha -= this.decay;

    // remove the particle once the alpha is low enough, based on the passed-in index
    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
};

// draw particle
Particle.prototype.draw = function () {
    ctx.beginPath();
    // move to the last tracked coordinates in the set, then draw a line to the current x and y
    ctx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle =
        'hsla(' +
        this.hue +
        ', 100%, ' +
        this.brightness +
        '%, ' +
        this.alpha +
        ')';
    ctx.stroke();
};

// create particle group/explosion
function createParticles(x, y, hue) {
    // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
    let particleCount = 30;
    while (particleCount--) {
        particles.push(new Particle(x, y, hue));
    }
}

// main demo loop
function loop() {
    // this function will run endlessly with requestAnimationFrame
    requestAnimFrame(loop);

    // normally, clearRect() would be used to clear the canvas
    // we want to create a trailing effect though
    // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
    ctx.globalCompositeOperation = 'destination-out';
    // decrease the alpha property to create more prominent trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // canvas.heightange the composite operation back to our main mode
    // lighter creates bright highlight points as the fireworks and particles overlap eacanvas.height other
    ctx.globalCompositeOperation = 'lighter';

    // loop over eacanvas.height firework, draw it, update it
    let i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    // loop over eacanvas.height particle, draw it, update it
    i = particles.length;
    while (i--) {
        particles[i].draw();
        particles[i].update(i);
    }

    // limit the rate at whicanvas.height fireworks get launcanvas.heighted when the mouse is down
    if (limiterTick >= limiterTotal) {
        if (mousedown) {
            // start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
            fireworks.push(new Firework(canvas.width / 2, canvas.height, mx, my));
            limiterTick = 0;
        }
    } else {
        limiterTick++;
    }
}

// mouse event bindings
// update the mouse coordinates on mousemove
document.addEventListener('mousemove', function (e) {
    mx = e.pageX;
    my = e.pageY;
});

// toggle mousedown state and prevent the canvas from being selected
document.addEventListener('mousedown', function (e) {
    e.preventDefault();
    mousedown = true;
    // Start a firework at the mouse click position
    fireworks.push(new Firework(canvas.width / 2, canvas.height, e.pageX, e.pageY));
});

document.addEventListener('mouseup', function (e) {
    e.preventDefault();
    mousedown = false;
});

// once the window loads, we are ready for some fireworks!
window.onload = loop;
