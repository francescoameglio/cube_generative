let boxes = []; // Array to hold multiple boxes
let boxSize = 100;

// C major scale frequencies (C4 scale)
let cMajorScale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];

let playing = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Start with no boxes, they will be added on mouse press
}

function draw() {
  background(255);

  if (!playing) return; // Wait until audio is started by user interaction

  // Draw the bounding box
  noFill();
  stroke(0);
  strokeWeight(1);
  push();
  translate(0, 0, 0);
  box(windowWidth - boxSize, windowHeight - boxSize, 200); // Visualize the boundary
  pop();

  // Update and display each box
  for (let b of boxes) {
    b.update();
    b.display();
  }
}

// Adjust canvas and boundaries on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (let b of boxes) {
    b.updateBoundaries();
  }
}

// Create a new box on mouse press
function mousePressed() {
  userStartAudio();
  playing = true;
  boxes.push(new BouncingBox());
}






// Class to handle bouncing box logic
class BouncingBox {
  constructor() {
    // Initialize position
    
    this.x = random(-width / 2 + boxSize , width / 2 - boxSize );
    this.y = random(-height / 2 + boxSize , height / 2 - boxSize );
    this.z = random(-100, 100);
    
  

    // Random speeds for movement
    this.xSpeed = random(2, 5);
    this.ySpeed = random(2, 5);
    this.zSpeed = random(2, 5);

    // Random speeds for rotation
    this.rotationSpeedX = random(0.5, 2); // Speed for X-axis rotation
    this.rotationSpeedY = random(0.5, 2); // Speed for Y-axis rotation
    this.rotationSpeedZ = random(0.5, 2); // Speed for Z-axis rotation

    // Initial rotation values
    this.rotationX = random(360);
    this.rotationY = random(360);
    this.rotationZ = random(360);

    // Boundaries
    this.updateBoundaries();

    // Create an oscillator for the box
    this.oscillator = new p5.Oscillator();
    this.oscillator.setType('sine');
    this.oscillator.freq(random(cMajorScale)); // Assign a random note from the C major scale
    this.oscillator.amp(0); // Start silent
    this.oscillator.start();
  }

  updateBoundaries() {
    this.boundaryX = width / 2 - boxSize;
    this.boundaryY = height / 2 - boxSize;
    this.boundaryZ = 100; // Depth boundary
  }

  update() {
    // Move the box
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    //this.z += this.zSpeed;

    // Rotate the box
    this.rotationX += this.rotationSpeedX;
    this.rotationY += this.rotationSpeedY;
    this.rotationZ += this.rotationSpeedZ;

    // Check collisions and bounce
    if (this.x > this.boundaryX || this.x < -this.boundaryX) {
      this.xSpeed *= -1;
      this.playNote();
    }
    if (this.y > this.boundaryY || this.y < -this.boundaryY) {
      this.ySpeed *= -1;
      this.playNote();
    }
    if (this.z > this.boundaryZ || this.z < -this.boundaryZ) {
      this.zSpeed *= -1;
      this.playNote();
    }
  }

  display() {
    // Draw the box
    push();
    translate(this.x, this.y, this.z);
    rotateX(radians(this.rotationX));
    rotateY(radians(this.rotationY));
    rotateZ(radians(this.rotationZ));
    fill(189, 0, 91); // Magenta
    box(boxSize, boxSize, boxSize);
    pop();
  }

  playNote() {
    if (!playing) return;

    // Play a random note from the C major scale
    let note = random(cMajorScale);
    this.oscillator.freq(note);

    // Ramp up the amplitude quickly, then fade out gradually
    this.oscillator.amp(0.5, 1);
    setTimeout(() => {
      this.oscillator.amp(0, 5);
    }, 100);
  }
}
