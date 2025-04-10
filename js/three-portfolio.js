// Three.js Portfolio Visualization
class Portfolio {
    constructor() {
        // DOM Elements
        this.canvas = document.getElementById('canvas');
        this.loadingBar = document.getElementById('loadingBar');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.mainContent = document.getElementById('mainContent');
        this.particleCounter = document.getElementById('particleCounter');
        
        // UI Controls
        this.toggleAnimationBtn = document.getElementById('toggleAnimation');
        this.toggleParticlesBtn = document.getElementById('toggleParticles');
        this.resetCameraBtn = document.getElementById('resetCamera');
        
        // Scene Setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 5);
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Portfolio Data (from your resume)
        this.portfolioData = {
            skills: [
                { name: 'Python', value: 0.95 },
                { name: 'Java', value: 0.9 },
                { name: 'JavaScript', value: 0.85 },
                { name: 'C++', value: 0.8 },
                { name: 'React', value: 0.8 },
                { name: 'ML/AI', value: 0.9 },
                { name: 'Computer Vision', value: 0.85 },
                { name: 'SQL', value: 0.8 }
            ],
            experience: [
                { 
                    title: 'Software Engineer',
                    company: 'UC Irvine',
                    period: 'Jun 2022 - Present',
                    duration: 22 // months
                },
                { 
                    title: 'Undergraduate Researcher',
                    company: 'He Lab, UC Irvine',
                    period: 'Jan 2024 - Present',
                    duration: 3 // months
                }
            ],
            projects: [
                { 
                    name: 'AI Stock Trading',
                    tech: ['Python', 'REST APIs'],
                    complexity: 0.9
                },
                { 
                    name: 'Object Recognition',
                    tech: ['Python', 'OpenCV', 'CNN'],
                    complexity: 0.85
                },
                { 
                    name: 'Discord Bots',
                    tech: ['Python', 'REST APIs', 'PostgreSQL'],
                    complexity: 0.7
                },
                { 
                    name: 'Compiler & Interpreter',
                    tech: ['Python'],
                    complexity: 0.8
                }
            ]
        };
        
        // Particles and Animation Properties
        this.particles = null;
        this.particlesData = [];
        this.particleCount = 5000;
        this.particleSystem = null;
        this.animationPaused = false;
        this.sceneObjects = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.tooltip = document.getElementById('tooltip');
        this.hoveredObject = null;
        
        // Camera Movement
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.cameraRotation = { x: 0, y: 0 };
        this.targetCameraRotation = { x: 0, y: 0 };
        this.isPointerDown = false;
        this.pointerStart = { x: 0, y: 0 };
        this.cameraDistance = 5;
        
        // Initialize the Portfolio
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Setup Camera
        this.camera.position.z = this.cameraDistance;
        
        // Create Background
        this.createBackground();
        
        // Create Skill Particles
        this.createParticles();
        
        // Create Interactive Elements based on portfolio data
        this.createPortfolioVisualizations();
        
        // Simulate Loading
        this.simulateLoading();
    }
    
    createBackground() {
        // Create stars (small background particles)
        const starsGeometry = new THREE.BufferGeometry();
        const starPositions = [];
        const starColors = [];
        
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            
            starPositions.push(x, y, z);
            
            // Create star colors (some blue-ish, some purple-ish)
            const color = Math.random() > 0.5 
                ? new THREE.Color(0x4284fd) 
                : new THREE.Color(0x6b57ff);
            
            starColors.push(color.r, color.g, color.b);
        }
        
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
        
        const starsMaterial = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(starField);
    }
    
    createParticles() {
        // Main particle system
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        
        for (let i = 0; i < this.particleCount; i++) {
            // Initial random positions
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 10;
            positions[i3 + 1] = (Math.random() - 0.5) * 10;
            positions[i3 + 2] = (Math.random() - 0.5) * 10;
            
            // Generate particle data for animations
            this.particlesData.push({
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                ),
                targetPosition: new THREE.Vector3(
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 8
                ),
                originalPosition: new THREE.Vector3(
                    positions[i3],
                    positions[i3 + 1],
                    positions[i3 + 2]
                ),
                lastUpdate: 0,
                updateInterval: Math.random() * 2000 + 1000
            });
            
            // Colors - use a gradient from blue to purple
            const mixRatio = Math.random();
            const color = new THREE.Color().lerpColors(
                new THREE.Color(0x4284fd),
                new THREE.Color(0x6b57ff),
                mixRatio
            );
            
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Sizes - slightly random
            sizes[i] = Math.random() * 0.05 + 0.02;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create shader material for better particles
        const particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) discard;
                    
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    float dist = length(coord);
                    
                    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true,
            depthWrite: false
        });
        
        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
        
        // Update counter
        this.particleCounter.textContent = `Particles: ${this.particleCount}`;
    }
    
    // Modify the createPortfolioVisualizations function in three-portfolio.js
// Find this function and replace the code for creating lines with this updated version:

createPortfolioVisualizations() {
    // Create 3D objects to represent skills and projects
    
    // 1. Create a central node (representing you)
    const nodeGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const nodeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x6b57ff,
        transparent: true,
        opacity: 0.8
    });
    
    const centralNode = new THREE.Mesh(nodeGeometry, nodeMaterial);
    centralNode.position.set(0, 0, 0);
    centralNode.userData = {
        type: 'central',
        label: 'Neelansh Khare',
        description: 'Software Engineer & ML Researcher'
    };
    
    this.scene.add(centralNode);
    this.sceneObjects.push(centralNode);
    
    // 2. Create skill nodes
    const skillRadius = 3;
    this.portfolioData.skills.forEach((skill, index) => {
        const angle = (index / this.portfolioData.skills.length) * Math.PI * 2;
        
        // Position skill nodes in a circle
        const x = Math.cos(angle) * skillRadius;
        const y = Math.sin(angle) * skillRadius;
        const z = (Math.random() - 0.5) * 2;
        
        // Size based on skill level
        const size = 0.15 + skill.value * 0.2;
        
        const skillGeometry = new THREE.SphereGeometry(size, 16, 16);
        const skillMaterial = new THREE.MeshBasicMaterial({
            color: 0x4284fd,
            transparent: true,
            opacity: 0.8
        });
        
        const skillNode = new THREE.Mesh(skillGeometry, skillMaterial);
        skillNode.position.set(x, y, z);
        skillNode.userData = {
            type: 'skill',
            name: skill.name,
            value: skill.value,
            description: `Proficiency: ${Math.round(skill.value * 100)}%`
        };
        
        this.scene.add(skillNode);
        this.sceneObjects.push(skillNode);
        
        // Create connection line to central node - FIX: Add minimum opacity
        if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1 || Math.abs(z) > 0.1) { // Avoid lines too close to center
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(x, y, z)
            ]);
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x6b57ff,
                transparent: true,
                opacity: 0.1 // Reduced opacity to make lines less prominent
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            this.scene.add(line);
        }
    });
    
    // 3. Create project nodes
    const projectRadius = 5;
    this.portfolioData.projects.forEach((project, index) => {
        const angle = (index / this.portfolioData.projects.length) * Math.PI * 2;
        
        // Position in 3D space
        const x = Math.cos(angle) * projectRadius;
        const z = Math.sin(angle) * projectRadius;
        const y = (Math.random() - 0.5) * 3;
        
        // Size based on project complexity
        const size = 0.2 + project.complexity * 0.3;
        
        // Create custom geometry for projects (cubes)
        const projectGeometry = new THREE.BoxGeometry(size, size, size);
        const projectMaterial = new THREE.MeshBasicMaterial({
            color: 0xff9d00,
            transparent: true,
            opacity: 0.8
        });
        
        const projectNode = new THREE.Mesh(projectGeometry, projectMaterial);
        projectNode.position.set(x, y, z);
        projectNode.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        projectNode.userData = {
            type: 'project',
            name: project.name,
            tech: project.tech,
            complexity: project.complexity,
            description: `Technologies: ${project.tech.join(', ')}`
        };
        
        this.scene.add(projectNode);
        this.sceneObjects.push(projectNode);
        
        // Create connection to central node - FIX: Add minimum distance check and reduce opacity
        if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1 || Math.abs(z) > 0.1) { // Avoid lines too close to center
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(x, y, z)
            ]);
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xff9d00,
                transparent: true,
                opacity: 0.1 // Reduced opacity to make lines less prominent
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            this.scene.add(line);
        }
    });
    
    // 4. Create experience nodes
    const experienceRadius = 4;
    this.portfolioData.experience.forEach((exp, index) => {
        const angle = (index / this.portfolioData.experience.length) * Math.PI;
        
        // Position using angle
        const x = Math.cos(angle) * experienceRadius;
        const z = Math.sin(angle) * experienceRadius;
        const y = -2 + (Math.random() - 0.5);
        
        // Size based on duration
        const size = 0.2 + (exp.duration / 24) * 0.4; // Scale based on years
        
        // Create cylinder for experience
        const expGeometry = new THREE.CylinderGeometry(size, size, 0.5, 32);
        const expMaterial = new THREE.MeshBasicMaterial({
            color: 0x00cc88,
            transparent: true,
            opacity: 0.8
        });
        
        const expNode = new THREE.Mesh(expGeometry, expMaterial);
        expNode.position.set(x, y, z);
        expNode.userData = {
            type: 'experience',
            title: exp.title,
            company: exp.company,
            period: exp.period,
            description: `${exp.title} at ${exp.company}\n${exp.period}`
        };
        
        this.scene.add(expNode);
        this.sceneObjects.push(expNode);
        
        // Create connection to central node - FIX: Add minimum distance check and reduce opacity
        if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1 || Math.abs(z) > 0.1) { // Avoid lines too close to center
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(x, y, z)
            ]);
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x00cc88,
                transparent: true,
                opacity: 0.1 // Reduced opacity to make lines less prominent
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            this.scene.add(line);
        }
    });
}
    
    simulateLoading() {
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                // Hide loading screen
                setTimeout(() => {
                    this.loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        this.loadingScreen.style.display = 'none';
                        this.mainContent.classList.add('visible');
                    }, 1000);
                }, 500);
            }
            
            this.loadingBar.style.width = `${progress}%`;
        }, 200);
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mouse movement for ray casting and camera control
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('mousedown', (event) => this.onMouseDown(event));
        window.addEventListener('mouseup', () => this.onMouseUp());
        window.addEventListener('wheel', (event) => this.onMouseWheel(event));
        
        // Touch events for mobile
        window.addEventListener('touchstart', (event) => this.onTouchStart(event));
        window.addEventListener('touchmove', (event) => this.onTouchMove(event));
        window.addEventListener('touchend', () => this.onTouchEnd());
        
        // UI Controls
        this.toggleAnimationBtn.addEventListener('click', () => this.toggleAnimation());
        this.toggleParticlesBtn.addEventListener('click', () => this.toggleParticleCount());
        this.resetCameraBtn.addEventListener('click', () => this.resetCamera());
        
        // Object clicking
        window.addEventListener('click', (event) => this.onObjectClick(event));
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        // Update mouse coordinates for raycasting
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Camera rotation if mouse is held down
        if (this.isPointerDown) {
            const deltaX = event.clientX - this.pointerStart.x;
            const deltaY = event.clientY - this.pointerStart.y;
            
            this.targetCameraRotation.y += deltaX * 0.001;
            this.targetCameraRotation.x += deltaY * 0.001;
            
            // Limit vertical rotation
            this.targetCameraRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.targetCameraRotation.x));
            
            this.pointerStart.x = event.clientX;
            this.pointerStart.y = event.clientY;
        }
    }
    
    onMouseDown(event) {
        if (event.button === 0) { // Left mouse button
            this.isPointerDown = true;
            this.pointerStart.x = event.clientX;
            this.pointerStart.y = event.clientY;
        }
    }
    
    onMouseUp() {
        this.isPointerDown = false;
    }
    
    onMouseWheel(event) {
        // Zoom in/out with scroll wheel
        this.cameraDistance += event.deltaY * 0.005;
        this.cameraDistance = Math.max(2, Math.min(15, this.cameraDistance));
    }
    
    onTouchStart(event) {
        if (event.touches.length === 1) {
            this.isPointerDown = true;
            this.pointerStart.x = event.touches[0].clientX;
            this.pointerStart.y = event.touches[0].clientY;
        }
    }
    
    onTouchMove(event) {
        if (this.isPointerDown && event.touches.length === 1) {
            const deltaX = event.touches[0].clientX - this.pointerStart.x;
            const deltaY = event.touches[0].clientY - this.pointerStart.y;
            
            this.targetCameraRotation.y += deltaX * 0.002;
            this.targetCameraRotation.x += deltaY * 0.002;
            
            // Limit vertical rotation
            this.targetCameraRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.targetCameraRotation.x));
            
            this.pointerStart.x = event.touches[0].clientX;
            this.pointerStart.y = event.touches[0].clientY;
        }
    }
    
    onTouchEnd() {
        this.isPointerDown = false;
    }
    
    toggleAnimation() {
        this.animationPaused = !this.animationPaused;
        this.toggleAnimationBtn.innerHTML = this.animationPaused ? '⏸️' : '▶️';
    }
    
    toggleParticleCount() {
        // Toggle between particle counts
        if (this.particleCount === 5000) {
            this.particleCount = 10000;
        } else if (this.particleCount === 10000) {
            this.particleCount = 2000;
        } else {
            this.particleCount = 5000;
        }
        
        // Remove old particles
        this.scene.remove(this.particles);
        
        // Reset particle data
        this.particlesData = [];
        
        // Recreate particles
        this.createParticles();
    }
    
    resetCamera() {
        this.targetCameraRotation.x = 0;
        this.targetCameraRotation.y = 0;
        this.cameraDistance = 5;
    }
    
    onObjectClick(event) {
    // Cast ray from mouse position to detect object clicks
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.sceneObjects, true);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        const mainContent = document.getElementById('mainContent');
        
        // Close all sections first
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Hide the main content
        mainContent.style.display = 'none';
        
        // Lock background scrolling
        document.body.style.overflow = 'hidden';
        
        // Then open the appropriate section
        if (object.userData.type === 'skill') {
            document.getElementById('skillsSection').classList.add('active');
        } else if (object.userData.type === 'project') {
            document.getElementById('projectsSection').classList.add('active');
        } else if (object.userData.type === 'experience') {
            document.getElementById('experienceSection').classList.add('active');
        } else if (object.userData.type === 'central') {
            document.getElementById('aboutSection').classList.add('active');
        }
    }
}
    
    checkIntersection() {
        // Raycast for object hover effects and tooltips
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.sceneObjects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            // Show tooltip with object information
            if (this.hoveredObject !== object) {
                this.hoveredObject = object;
                
                // Show tooltip
                this.tooltip.textContent = `${object.userData.name || object.userData.title || object.userData.label}\n${object.userData.description}`;
                this.tooltip.style.opacity = '1';
            }
            
            // Update tooltip position
            const vector = new THREE.Vector3();
            vector.setFromMatrixPosition(object.matrixWorld);
            vector.project(this.camera);
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
            
            this.tooltip.style.left = `${x}px`;
            this.tooltip.style.top = `${y - 50}px`;
            
            // Highlight object
            object.material.opacity = 1;
        } else {
            // Hide tooltip when not hovering
            if (this.hoveredObject) {
                this.hoveredObject.material.opacity = 0.8;
                this.hoveredObject = null;
                this.tooltip.style.opacity = '0';
            }
        }
    }
    
    updateParticles() {
        if (this.animationPaused) return;
        
        const time = Date.now();
        const positions = this.particles.geometry.attributes.position.array;
        
        // Update particles position with animations
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const data = this.particlesData[i];
            
            // Check if it's time to update target position
            if (time - data.lastUpdate > data.updateInterval) {
                data.targetPosition.set(
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 8
                );
                data.lastUpdate = time;
                data.updateInterval = Math.random() * 2000 + 1000;
            }
            
            // Move towards target position
            const currentPosition = new THREE.Vector3(
                positions[i3],
                positions[i3 + 1],
                positions[i3 + 2]
            );
            
            // Calculate direction and move towards target
            const direction = new THREE.Vector3().subVectors(data.targetPosition, currentPosition);
            
            if (direction.length() > 0.1) {
                direction.normalize().multiplyScalar(0.01);
                
                positions[i3] += direction.x;
                positions[i3 + 1] += direction.y;
                positions[i3 + 2] += direction.z;
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        // Update shader time uniform if it exists
        if (this.particles.material.uniforms && this.particles.material.uniforms.time) {
            this.particles.material.uniforms.time.value = time * 0.001;
        }
    }
    
    updateCamera() {
        // Smooth camera rotation
        this.cameraRotation.x += (this.targetCameraRotation.x - this.cameraRotation.x) * 0.05;
        this.cameraRotation.y += (this.targetCameraRotation.y - this.cameraRotation.y) * 0.05;
        
        // Calculate camera position based on rotation and distance
        const x = Math.sin(this.cameraRotation.y) * Math.cos(this.cameraRotation.x) * this.cameraDistance;
        const y = Math.sin(this.cameraRotation.x) * this.cameraDistance;
        const z = Math.cos(this.cameraRotation.y) * Math.cos(this.cameraRotation.x) * this.cameraDistance;
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.cameraTarget);
    }
    
    updateSceneObjects() {
        // Animate scene objects
        if (this.animationPaused) return;
        
        this.sceneObjects.forEach(object => {
            if (object.userData.type === 'project') {
                // Rotate project cubes
                object.rotation.x += 0.005;
                object.rotation.y += 0.005;
            } else if (object.userData.type === 'skill') {
                // Gentle pulsing for skill nodes
                object.scale.x = object.scale.y = object.scale.z = 1 + Math.sin(Date.now() * 0.002) * 0.1;
            } else if (object.userData.type === 'experience') {
                // Gentle rotation for experience cylinders
                object.rotation.y += 0.01;
            } else if (object.userData.type === 'central') {
                // Pulse the central node
                object.scale.x = object.scale.y = object.scale.z = 1 + Math.sin(Date.now() * 0.001) * 0.2;
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update camera position
        this.updateCamera();
        
        // Update particles
        this.updateParticles();
        
        // Update interactive objects
        this.updateSceneObjects();
        
        // Check for object intersections (hover effects)
        this.checkIntersection();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize Portfolio on window load
window.addEventListener('load', () => {
    new Portfolio();
});