// --- 1. UTILITIES ---
window.onload = function() {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isSecure = window.location.protocol === 'https:';
    if (!isLocalhost && !isSecure && window.location.protocol !== 'file:') {
        document.getElementById('current-ip').innerText = window.location.host;
        document.getElementById('security-error').style.display = 'block';
    } else if (window.location.protocol === 'file:') {
        alert("Please use Live Server extension in VS Code.");
    } else {
        document.getElementById('start-screen').style.display = 'block';
    }
};

function switchToLocalhost() {
    const port = window.location.port ? ':' + window.location.port : '';
    window.location.href = 'http://localhost' + port + window.location.pathname;
}

// --- 2. CORE VARIABLES ---
let scene, camera, renderer, particles, geometry;
let positions, colors, targetPositions = [];
let time = 0;
let currentShape = 0;

// Interaction State
let handState = { 
    x: 0, y: 0,              
    isFist: false,           
    pinchDist: 0,
    isBackHand: false,       
    lastShapeChange: 0
};

// Auto Rotation State
let autoRotateSpeed = 0.002; 

// --- 3. INITIALIZATION ---
async function startExperience() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById('video-input');
        videoElement.srcObject = stream;
        
        initThree();
        await initMediaPipe(videoElement);

        document.getElementById('overlay').style.display = 'none';
        document.getElementById('ui').style.display = 'block';

    } catch (err) {
        alert("Error: " + err.message);
    }
}

function initThree() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.03);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const count = 20000; 
    geometry = new THREE.BufferGeometry();
    positions = new Float32Array(count * 3);
    colors = new Float32Array(count * 3);

    for(let i=0; i<count*3; i++) {
        positions[i] = (Math.random()-0.5)*100;
        colors[i] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.2, 
        vertexColors: true, 
        blending: THREE.AdditiveBlending, 
        transparent: true, 
        opacity: 0.9,
        depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    generateShape(0);
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- 4. SHAPE GENERATION ---
function generateShape(idx) {
    targetPositions = [];
    const count = 20000;
    const shapes = [
        { name: "NEBULA SWIRL", gen: (i) => {
            const r = Math.random()*25; 
            const th = r*0.5 + (i%5)*(Math.PI*2)/5;
            return {x:Math.cos(th)*r, y:(Math.random()-0.5)*r*0.5, z:Math.sin(th)*r};
        }},
        { name: "CYBER CUBE", gen: (i) => {
            const s = 15;
            let x,y,z;
            const face = i % 6;
            const u = Math.random()*2-1; const v = Math.random()*2-1;
            if(face===0) {x=1; y=u; z=v;} else if(face===1) {x=-1; y=u; z=v;}
            else if(face===2) {x=u; y=1; z=v;} else if(face===3) {x=u; y=-1; z=v;}
            else if(face===4) {x=u; y=v; z=1;} else {x=u; y=v; z=-1;}
            return {x:x*s, y:y*s, z:z*s};
        }},
        { name: "GEMINI CLOUD", gen: (i) => {
            const r = 16 * Math.pow(Math.random(), 1.5); 
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const swirl = r * 0.1;
            return {
                x: r * Math.sin(phi) * Math.cos(theta + swirl),
                y: r * Math.sin(phi) * Math.sin(theta + swirl),
                z: r * Math.cos(phi)
            };
        }},
        { name: "QUANTUM LOTUS", gen: (i) => {
            if (i < 4000) {
                return {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 25, 
                    z: (Math.random() - 0.5) * 2
                };
            } else {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * (Math.PI * 0.8) + (Math.PI * 0.1); 
                const petal = Math.pow(Math.sin(3 * theta), 2); 
                const r = 10 + 6 * petal; 
                return {
                    x: r * Math.sin(phi) * Math.cos(theta),
                    y: (r * Math.cos(phi)) * 0.8, 
                    z: r * Math.sin(phi) * Math.sin(theta)
                };
            }
        }},
        { name: "HYPER SPHERE", gen: (i) => {
            const r=14;
            const phi = Math.acos( -1 + ( 2 * i ) / count );
            const theta = Math.sqrt( count * Math.PI ) * phi;
            return {x:r*Math.cos(theta)*Math.sin(phi), y:r*Math.sin(theta)*Math.sin(phi), z:r*Math.cos(phi)};
        }},
        { name: "QUANTUM FIELD", gen: (i) => {
            return {x:(Math.random()-0.5)*40, y:(Math.random()-0.5)*20, z:(Math.random()-0.5)*40};
        }}
    ];
    
    let actualIdx = idx % shapes.length;
    if (actualIdx < 0) actualIdx += shapes.length;

    const shape = shapes[actualIdx];
    document.getElementById('shape-name').innerText = shape.name;
    for(let i=0; i<count; i++) targetPositions.push(shape.gen(i));
}

// --- 5. ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    time += 0.026; 
    
    const pos = geometry.attributes.position.array;
    const col = geometry.attributes.color.array;

    // --- AUTO ROTATION ---
    particles.rotation.y += autoRotateSpeed;
    particles.rotation.x += autoRotateSpeed * 0.2; 
    
    if (autoRotateSpeed > 0.002) {
        autoRotateSpeed *= 0.95; 
    }

    // Zoom Logic
    let targetZoom = 30;
    if(handState.pinchDist > 0.05) {
        targetZoom = 30 - (handState.pinchDist * 40); 
        targetZoom = Math.max(5, targetZoom); 
    }
    camera.position.z += (targetZoom - camera.position.z) * 0.1;

    // --- UI STATUS UPDATE ---
    const indicator = document.getElementById('gesture-indicator');
    const timeSinceChange = Date.now() - handState.lastShapeChange;

    // Priority 1: Recent Shape Change (Back Hand)
    if (timeSinceChange < 2000) {
        indicator.innerText = "SHAPE CHANGED"; 
        indicator.className = "status-backhand"; 
    } 
    // Priority 2: Fist (Zoom In)
    else if (handState.isFist) {
        indicator.innerText = "PUNCH (ZOOM IN)"; 
        indicator.className = "status-punch"; 
    } 
    // Priority 3: Palm (Zoom Out)
    else if (handState.pinchDist > 0.05) {
        indicator.innerText = "PALM (ZOOM OUT)"; 
        indicator.className = "status-palm"; 
    } 
    else {
        indicator.innerText = "IDLE"; 
        indicator.className = "status-idle";
    }

    for(let i=0; i<20000; i++) {
        const ix = i*3, iy = i*3+1, iz = i*3+2;
        let tx, ty, tz;
        
        if (handState.isFist) {
            tx = targetPositions[i].x * 0.45; 
            ty = targetPositions[i].y * 0.45; 
            tz = targetPositions[i].z * 0.45; 
        } else {
            tx = targetPositions[i].x;
            ty = targetPositions[i].y;
            tz = targetPositions[i].z;
        }

        const speed = handState.isFist ? 0.08 : 0.13; 
        const noise = Math.sin(time + i) * 0.05;

        pos[ix] += (tx - pos[ix]) * speed + noise;
        pos[iy] += (ty - pos[iy]) * speed + noise;
        pos[iz] += (tz - pos[iz]) * speed + noise;

        // Color Logic
        const hue = (time * 0.1 + (pos[ix]*0.01)) % 1; 
        const brightness = handState.isFist ? 0.4 : 0.7; 
        
        const c = new THREE.Color();
        c.setHSL(0.7 + hue * 0.3, 1.0, brightness);
        col[ix] = c.r; col[iy] = c.g; col[iz] = c.b;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    renderer.render(scene, camera);
}

// --- 6. GESTURE RECOGNITION ---
async function initMediaPipe(videoElement) {
    const hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
    hands.setOptions({
        maxNumHands: 1, 
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
    });

    hands.onResults(results => {
        if (results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            const handedness = results.multiHandedness[0].label; // 'Left' or 'Right'
            
            // --- 1. Detect Back of Hand (vs Palm) ---
            const thumbX = landmarks[4].x;
            const pinkyX = landmarks[17].x;
            let isBackHand = false;

            if (handedness === 'Left') { // User's Right Hand
                // Normal Palm: Thumb (Right) > Pinky (Left) 
                // Back Hand: Thumb (Left) < Pinky (Right)
                if (thumbX < pinkyX) isBackHand = true;
            } else { // User's Left Hand ('Right' Label)
                // Normal Palm: Thumb (Left) < Pinky (Right)
                // Back Hand: Thumb (Right) > Pinky (Left)
                if (thumbX > pinkyX) isBackHand = true;
            }
            
            // Trigger Shape Change if Back Hand is detected (Debounced)
            const now = Date.now();
            if (isBackHand) {
                // *** FIX: DISABLE ZOOM IF BACK HAND IS DETECTED ***
                // If backhand is visible, we force pinchDist to 0 so zoom out doesn't trigger.
                handState.pinchDist = 0; 
                handState.isFist = false;

                if (now - handState.lastShapeChange > 1500) {
                    currentShape++;
                    generateShape(currentShape);
                    autoRotateSpeed = 0.15;
                    handState.lastShapeChange = now;
                }
            } else {
                // If NOT backhand, proceed with normal Pinch/Fist detection
                
                // --- 2. Fist Detection ---
                const wrist = landmarks[0];
                const tips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]]; 
                let totalDist = 0;
                tips.forEach(tip => { totalDist += Math.hypot(tip.x - wrist.x, tip.y - wrist.y); });
                const avgDist = totalDist / 4;
                handState.isFist = avgDist < 0.35; 

                // --- 3. Pinch Detection ---
                const thumb = landmarks[4];
                const index = landmarks[8];
                handState.pinchDist = Math.hypot(thumb.x - index.x, thumb.y - index.y);
            }

        } else {
            handState.isFist = false;
            handState.pinchDist = 0;
        }
    });

    const cam = new Camera(videoElement, {
        onFrame: async () => { await hands.send({image: videoElement}); },
        width: 640, height: 480
    });
    await cam.start();
}