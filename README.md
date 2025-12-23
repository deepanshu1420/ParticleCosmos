# ✨ ParticleCosmos

[![Three.js](https://img.shields.io/badge/Graphics-Three.js-black)](https://threejs.org/)
[![MediaPipe](https://img.shields.io/badge/Hand_Tracking-MediaPipe-blue)](https://google.github.io/mediapipe/)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/Web-HTML5-orange)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/Style-CSS3-blue)](https://developer.mozilla.org/en-US/docs/Web/CSS)

**A fun, interactive web app where you control a universe of 3D particles using just your hand movements.**

---

🌐 **Try it Live:** [particlecosmos.netlify.app](https://particlecosmos.netlify.app/)

---

## 🌟 Overview
**ParticleCosmos** turns your webcam into a controller. By simply moving your hand, you can interact with thousands of floating particles that form beautiful 3D shapes.

It uses **MediaPipe** to track your hand and **Three.js** to create the visuals, allowing you to fly through different "digital universes" like a Nebula or a Cyber Cube without touching your keyboard or mouse.

---

## ⚡ Features
- **Control with Gestures:**
  - 👋 **Back of Hand:** Switches to the next shape.
  - ✊ **Fist:** Zooms into the particles.
  - ✋ **Open Palm:** Zooms out.
- **Cool 3D Shapes:** Watch particles instantly form into shapes like a *Nebula Swirl*, *Cyber Cube*, *Hyper Sphere*, and more.
- **Smooth Animation:** The particles flow and rotate automatically, reacting smoothly to your movements.
- **Modern Design:** Features a clean, glass-like interface that overlays the action.

---

## 🛠 Tech Stack
- **Three.js:** The tool used to draw the 3D particles and handle the graphics.
- **MediaPipe Hands:** The technology that lets the computer "see" and track your hand through the webcam.
- **JavaScript:** The logic that connects your hand movements to the visuals.
- **HTML & CSS:** Builds the website structure and makes it look good.

---

## 🖼 Screenshots

### Nebula Swirl
![Nebula Swirl](Screenshots/image1.png)
*A spiral galaxy shape made of particles.*

### Cyber Cube
![Cyber Cube](Screenshots/image2.png)
*A large 3D box filled with glowing dots.*

### Hyper Sphere
![Hyper Sphere](Screenshots/image3.png)
*A round, planet-like ball of particles.*

### Cyber Cube (Side View)
![Cyber Cube Side](Screenshots/image4.png)
*The cube viewed from a different angle.*

### Quantum Field
![Quantum Field](Screenshots/image5.png)
*A scattered field of particles floating freely.*

---

## 🛠 Installation / Usage

If you want to run this project on your own computer:

```bash
# 1. Download the project
git clone [https://github.com/deepanshu1420/particlecosmos.git](https://github.com/deepanshu1420/particlecosmos.git)

# 2. Go into the project folder
cd particlecosmos

# 3. Start a local server (Important for the webcam to work!)
# If you have Python installed, you can simply run:
python -m http.server 5500

# 4. Open your browser and go to:
# http://localhost:5500