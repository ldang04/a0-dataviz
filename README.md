# Bloom Clock - Data Visualization Assignment 0

**Course:** Introduction to Data Visualization  
**Institution:** Columbia University  
**Assignment:** a0

## Overview

Bloom Clock is an abstract clock visualization built with p5.js that represents time through a bouquet of flowers, leaves, and a windowsill scene. The visualization uses organic, natural elements (flowers, buds, leaves, sun/moon) to represent different time units in a visually engaging way.

## Time Mapping Logic

### Hours → Bouquet Composition
- Uses 12-hour format (`hours % 12`, with 0 converted to 12)
- **Number of bloomed flowers** = current hour (1-12)
- Each hour is represented by exactly that many **pink, 5-petal flowers**
- Remaining positions (up to 12 total) are filled with **orange tulip-shaped buds**
- All flowers/buds are arranged using a **phyllotaxis (sunflower spiral)** layout to evenly distribute them within a circular disk
- Flower positions include small deterministic jitter for an organic, natural look

### Minutes → Leaf Ring
- 60 leaves arranged in a ring around the bouquet
- Each leaf corresponds to one minute (0-59)
- **Leaf states:**
  - `i < minutes`: Fully green (completed minutes)
  - `i === minutes`: Gradually fills from yellow to green based on seconds progress
  - `i > minutes`: Yellow (future minutes)
- Color interpolation uses `lerpColor()` with millisecond precision for smooth continuous filling (~1.67% per second)
- Progress calculation: `(seconds + milliseconds / 1000) / 60`

### AM/PM → Sky Background & Celestial Objects
- **AM (hours < 12):** Light blue sky with yellow sun in top-right corner
- **PM (hours >= 12):** Dark blue sky with white crescent moon in top-right corner
- Optional subtle stars appear in PM mode

### Time Calculation
Uses JavaScript's `Date` object:
```javascript
const now = new Date();
let hours = now.getHours();
let minutes = now.getMinutes();
let seconds = now.getSeconds();
let milliseconds = now.getMilliseconds();
```

Time is recalculated every frame (60 fps), ensuring real-time accuracy without drift.

## Technical Notes

- Built with p5.js in global mode
- No external dependencies beyond p5.js
- Uses deterministic random values (index-based) for stable visual appearance across frames
- All drawing uses `push()`/`pop()` for proper transformation management
- Color interpolation via p5.js `lerpColor()` function

## Usage

1. Open `index.html` in a web browser
2. The clock automatically updates in real-time
3. Resize the window to see responsive behavior

## File Structure

```
a0_template/
├── index.html      # HTML file with p5.js setup
├── sketch.js       # Main visualization code
├── p5.js           # p5.js library (minified)
├── p5.min.js       # Alternative p5.js library
└── README.md       # This file
```
