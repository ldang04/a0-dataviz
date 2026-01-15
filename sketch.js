// setup() is called once at page-load
function setup() {
    createCanvas(windowWidth, windowHeight); // Responsive canvas
}

// Handle window resize
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Draw sky background (AM = light blue, PM = dark blue)
function drawSky(isAM) {
    if (isAM) {
        background(135, 206, 235); // Light sky blue
    } else {
        background(25, 25, 112); // Midnight blue
    }
}

// Draw sun in AM mode (top-right corner, same as moon)
function drawSun() {
    push();
    translate(width * 0.75, height * 0.25);
    fill(255, 255, 0); // Yellow
    noStroke();
    ellipse(0, 0, width * 0.15, width * 0.15);
    // Subtle rays
    for (let i = 0; i < 8; i++) {
        let angle = (TWO_PI / 8) * i;
        let x1 = cos(angle) * (width * 0.08);
        let y1 = sin(angle) * (width * 0.08);
        let x2 = cos(angle) * (width * 0.1);
        let y2 = sin(angle) * (width * 0.1);
        stroke(255, 255, 0);
        strokeWeight(3);
        line(x1, y1, x2, y2);
    }
    pop();
}

// Draw moon in PM mode (top-right)
function drawMoon() {
    push();
    translate(width * 0.75, height * 0.25);
    fill(220, 220, 220); // Light gray
    noStroke();
    ellipse(0, 0, width * 0.12, width * 0.12);
    // Crescent effect with cutout
    fill(25, 25, 112); // Same as background
    ellipse(-width * 0.02, 0, width * 0.1, width * 0.1);
    pop();
}

// Draw purple vase below bouquet
function drawVase(centerX, vaseCenterY, vaseHeight, vaseBaseWidth, vaseNeckWidth, S) {
    // Vase center Y is passed directly - vase extends from (vaseCenterY - h/2) to (vaseCenterY + h/2)
    // Vase base is at (vaseCenterY + h/2) - may go off-screen, which is OK
    
    push();
    translate(centerX, vaseCenterY);
    fill(128, 0, 128); // Purple
    noStroke();
    
    // Vase shape: wider base, narrower neck
    let h = vaseHeight;
    let wBase = vaseBaseWidth;
    let wNeck = vaseNeckWidth;
    
    beginShape();
    // Left side
    vertex(-wNeck * 0.5, -h * 0.5); // Top left (neck)
    vertex(-wNeck * 0.6, -h * 0.3); // Neck narrowing
    vertex(-wBase * 0.4, h * 0.2); // Mid left (expanding)
    vertex(-wBase * 0.5, h * 0.5); // Base left
    // Right side
    vertex(wBase * 0.5, h * 0.5); // Base right
    vertex(wBase * 0.4, h * 0.2); // Mid right (expanding)
    vertex(wNeck * 0.6, -h * 0.3); // Neck narrowing
    vertex(wNeck * 0.5, -h * 0.5); // Top right (neck)
    endShape(CLOSE);
    
    // Add rim
    fill(160, 0, 160); // Slightly lighter purple
    rectMode(CENTER);
    rect(0, -h * 0.5, wNeck * 1.1, h * 0.05);
    
    pop();
    
    // Add subtle shadow/grounding ellipse at vase base
    // Vase base is at vaseCenterY + h/2
    let vaseBaseY = vaseCenterY + h / 2;
    push();
    translate(centerX, vaseBaseY);
    fill(0, 0, 0, 30); // Very subtle black shadow
    noStroke();
    ellipse(0, 0, wBase * 1.2, wBase * 0.3); // Subtle shadow ellipse
    pop();
}

// Draw a pink 5-petal flower (with optional rotation)
function drawFlower(x, y, size, rotation = 0) {
    push();
    translate(x, y);
    rotate(rotation); // Apply rotation if provided
    noStroke();
    
    // Draw 5 petals
    fill(255, 192, 203); // Pink
    for (let i = 0; i < 5; i++) {
        push();
        rotate((TWO_PI / 5) * i);
        ellipse(0, -size * 0.3, size * 0.4, size * 0.6);
        pop();
    }
    
    // Center
    fill(255, 105, 180); // Darker pink
    ellipse(0, 0, size * 0.3, size * 0.3);
    
    pop();
}

// Draw an orange tulip-shaped bud (with optional rotation)
function drawTulipBud(x, y, size, rotation = 0) {
    push();
    translate(x, y);
    rotate(rotation); // Apply rotation if provided
    fill(255, 165, 0); // Orange
    noStroke();
    
    // Tulip shape: rounded teardrop with notch at top
    beginShape();
    vertex(0, -size * 0.5); // Top center (notch)
    bezierVertex(
        -size * 0.15, -size * 0.4, // Control point 1
        -size * 0.25, -size * 0.2, // Control point 2
        -size * 0.3, 0 // Left mid
    );
    bezierVertex(
        -size * 0.25, size * 0.2,
        -size * 0.15, size * 0.35,
        -size * 0.1, size * 0.5 // Bottom left
    );
    vertex(0, size * 0.5); // Bottom center
    bezierVertex(
        size * 0.1, size * 0.5, // Bottom right
        size * 0.15, size * 0.35,
        size * 0.25, size * 0.2
    );
    bezierVertex(
        size * 0.3, 0, // Right mid
        size * 0.25, -size * 0.2,
        size * 0.15, -size * 0.4
    );
    bezierVertex(
        size * 0.05, -size * 0.45,
        0, -size * 0.5, // Back to top
        0, -size * 0.5
    );
    endShape(CLOSE);
    
    pop();
}

// Draw bouquet representing hours (hours12 flowers/buds)
function drawBouquet(hours12, centerX, centerY, bouquetRadius, S) {
    // Always use 12 positions for uniform distribution
    const totalSlots = 12;
    
    // Flower size relative to bouquet radius for dense, overlapping bouquet
    let flowerSize = bouquetRadius * 0.55;
    
    // Phyllotaxis (sunflower spiral) constants
    // Golden angle in radians ≈ 137.508 degrees
    const goldenAngle = 2.399963229728653; // radians
    
    // Total number of flowers/buds to distribute
    let totalItems = hours12 + (totalSlots - hours12); // Should always be 12
    
    // Draw exactly hours12 pink flowers (bloomed) using phyllotaxis layout
    for (let i = 0; i < hours12; i++) {
        // Phyllotaxis spiral: angle increases by golden angle
        // Radius scales with sqrt(i/N) to fill disk uniformly
        let angle = (i + 1) * goldenAngle;
        let r = bouquetRadius * sqrt((i + 1) / totalItems);
        
        // Add small jitter to avoid algorithmic look (±0.02*S)
        let jitterX = ((i * 73.29) % 100) / 100 - 0.5; // Deterministic jitter -1 to 1
        let jitterY = ((i * 127.48) % 100) / 100 - 0.5; // Deterministic jitter -1 to 1
        let jitterScale = 0.02 * S;
        
        // Calculate position within circular disk with jitter
        // Keep jittered position within bouquet radius
        let baseX = centerX + cos(angle) * r;
        let baseY = centerY + sin(angle) * r;
        let jitteredX = baseX + jitterX * jitterScale;
        let jitteredY = baseY + jitterY * jitterScale;
        
        // Ensure jittered position stays within disk (slight overlap allowed)
        let distFromCenter = dist(jitteredX, jitteredY, centerX, centerY);
        if (distFromCenter > bouquetRadius) {
            // Pull back to radius if jitter pushed it out
            let angleToCenter = atan2(jitteredY - centerY, jitteredX - centerX);
            jitteredX = centerX + cos(angleToCenter) * bouquetRadius;
            jitteredY = centerY + sin(angleToCenter) * bouquetRadius;
        }
        
        // Draw flower with deterministic random rotation for organic look
        // Use index-based "random" rotation so it's stable across frames
        let rotation = (i * 123.456) % TWO_PI; // Deterministic pseudo-random rotation
        drawFlower(jitteredX, jitteredY, flowerSize, rotation); // Pink flower (bloomed)
    }
    
    // Draw remaining slots as orange buds (unbloomed) using phyllotaxis layout
    for (let i = hours12; i < totalSlots; i++) {
        // Phyllotaxis spiral: angle increases by golden angle
        // Radius scales with sqrt(i/N) to fill disk uniformly
        let angle = (i + 1) * goldenAngle;
        let r = bouquetRadius * sqrt((i + 1) / totalItems);
        
        // Add small jitter to avoid algorithmic look (±0.02*S)
        let jitterX = ((i * 73.29) % 100) / 100 - 0.5; // Deterministic jitter -1 to 1
        let jitterY = ((i * 127.48) % 100) / 100 - 0.5; // Deterministic jitter -1 to 1
        let jitterScale = 0.02 * S;
        
        // Calculate position within circular disk with jitter
        let baseX = centerX + cos(angle) * r;
        let baseY = centerY + sin(angle) * r;
        let jitteredX = baseX + jitterX * jitterScale;
        let jitteredY = baseY + jitterY * jitterScale;
        
        // Ensure jittered position stays within disk (slight overlap allowed)
        let distFromCenter = dist(jitteredX, jitteredY, centerX, centerY);
        if (distFromCenter > bouquetRadius) {
            // Pull back to radius if jitter pushed it out
            let angleToCenter = atan2(jitteredY - centerY, jitteredX - centerX);
            jitteredX = centerX + cos(angleToCenter) * bouquetRadius;
            jitteredY = centerY + sin(angleToCenter) * bouquetRadius;
        }
        
        // Draw bud with deterministic random rotation for organic look
        // Use index-based "random" rotation so it's stable across frames
        let rotation = (i * 123.456) % TWO_PI; // Deterministic pseudo-random rotation
        drawTulipBud(jitteredX, jitteredY, flowerSize, rotation); // Orange bud (unbloomed)
    }
}

// Draw 60-leaf ring representing minutes (each leaf = one minute)
function drawLeafRing(minutes, seconds, milliseconds, centerX, centerY, ringRadius, S) {
    let angleStep = TWO_PI / 60;
    
    // Calculate progress within current minute (0.0 to < 1.0)
    // This gives smooth continuous filling (~1.67% per second)
    const progress = (seconds + milliseconds / 1000) / 60;
    
    // Define colors
    const yellow = color(255, 255, 0);
    const green = color(34, 139, 34);
    
    for (let i = 0; i < 60; i++) {
        let angle = angleStep * i - HALF_PI; // Start at top (12 o'clock)
        let x = centerX + cos(angle) * ringRadius;
        let y = centerY + sin(angle) * ringRadius;
        
        push();
        translate(x, y);
        rotate(angle + HALF_PI); // Orient leaf along ring
        
        // Determine leaf color based on minute progress
        let leafColor;
        if (i < minutes) {
            // Completed minutes: fully green
            leafColor = green;
        } else if (i > minutes) {
            // Future minutes: yellow
            leafColor = yellow;
        } else {
            // Current minute (i === minutes): interpolate from yellow to green based on progress
            leafColor = lerpColor(yellow, green, progress);
        }
        
        fill(leafColor);
        noStroke();
        
        // Draw leaf shape
        ellipse(0, 0, S * 0.015, S * 0.025);
        
        pop();
    }
}

// Draw brown window frame with crossbars
function drawWindowFrame(thickness, sillY, S) {
    push();
    fill(101, 67, 33); // Brown
    noStroke();
    
    // Outer frame (full canvas border)
    rect(0, 0, width, thickness); // Top
    rect(0, height - thickness, width, thickness); // Bottom
    rect(0, 0, thickness, height); // Left
    rect(width - thickness, 0, thickness, height); // Right
    
    // Crossbars
    let centerX = width / 2;
    let centerY = height / 2;
    
    // Vertical crossbar
    rect(centerX - thickness / 2, 0, thickness, height);
    
    // Horizontal crossbar (standard thickness)
    rect(0, centerY - thickness / 2, width, thickness);
    
    pop();
}

// draw() is called 60 times per second
function draw() {
    // Get current time using Date object
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let milliseconds = now.getMilliseconds();
    
    // Determine AM/PM
    let isAM = hours < 12;
    
    // Convert to 12-hour format
    let hours12 = hours % 12;
    if (hours12 === 0) {
        hours12 = 12;
    }
    
    // === LAYOUT CALCULATIONS ===
    // Calculate base scale
    let S = min(width, height);
    let cx = width / 2; // Center X
    let sillY = height * 0.68; // Where the sill visually is (tweakable)
    
    // Detect mobile (portrait orientation or narrow width)
    let isMobile = width < height || width < 600;
    
    // Bouquet parameters - larger and more dense
    // On mobile: slightly larger bouquet
    let R_bouquet = isMobile ? S * 0.22 : S * 0.20; // Bouquet radius (0.20 default, 0.22 on mobile)
    
    // Vase dimensions (bigger and more stable)
    let H_vase = S * 0.28; // Vase height
    let W_base = S * 0.18; // Vase width at base
    let W_neck = S * 0.10; // Vase width at neck
    
    // Position bouquet center - fixed position in the window
    // On mobile: place bouquet lower
    let bouquetCenterY = isMobile ? height * 0.55 : height * 0.48; // Lower on mobile
    
    // Position vase BELOW the bouquet circle
    // Vase top (neck opening) should be below the bottom of the bouquet
    // Bouquet extends from (bouquetCenterY - R_bouquet) to (bouquetCenterY + R_bouquet)
    let bouquetBottom = bouquetCenterY + R_bouquet;
    
    // Position vase so its top is clearly below the bouquet bottom
    // Gap between bouquet bottom and vase top
    let gap = S * 0.05; // Small gap between bouquet and vase
    let vaseTopY = bouquetBottom + gap; // Vase top (neck opening) position
    
    // Vase center Y = vase top Y + H_vase/2
    let vaseCenterY = vaseTopY + H_vase / 2;
    
    // Note: Vase base (at vaseCenterY + H_vase/2) may go off-screen - that's OK
    // The vase base sits at: vaseTopY + H_vase = bouquetBottom + gap + H_vase
    
    // Leaf ring parameters - follow the bouquet
    let R_ring = R_bouquet + S * 0.10; // Ring radius slightly larger than bouquet
    
    // Window frame
    let frameThickness = S * 0.06;
    
    // Draw everything in back-to-front order
    drawSky(isAM);
    
    if (isAM) {
        drawSun();
    } else {
        drawMoon();
        // Optional: Add subtle stars in PM mode (deterministic positions)
        fill(255, 255, 255, 100); // Semi-transparent white
        noStroke();
        for (let i = 0; i < 20; i++) {
            // Use hash-like approach for deterministic positions
            let seed = i * 137.508; // Golden angle approximation
            let x = (seed * width) % width;
            let y = (seed * seed * height) % height;
            ellipse(x, y, 2, 2);
        }
    }
    
    // Window frame (drawn early so bouquet appears in front)
    drawWindowFrame(frameThickness, sillY, S);
    
    // Vase - positioned below bouquet (may go off-screen at base - that's OK)
    drawVase(cx, vaseCenterY, H_vase, W_base, W_neck, S);
    
    // Bouquet (hours) - larger, denser, in front of window frame
    drawBouquet(hours12, cx, bouquetCenterY, R_bouquet, S);
    
    // Leaf ring (minutes with seconds+milliseconds for smooth filling) - centered on bouquet
    drawLeafRing(minutes, seconds, milliseconds, cx, bouquetCenterY, R_ring, S);
}
