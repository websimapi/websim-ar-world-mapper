import * as THREE from 'three';

export class Creature {
    constructor() {
        this.mesh = this.createMesh();
        this.mixer = null;
        this.spawnSound = new Audio('creature_spawn.mp3');
        this.clock = new THREE.Clock();
    }

    createMesh() {
        const group = new THREE.Group();

        // Core
        const coreGeo = new THREE.IcosahedronGeometry(0.15, 1);
        const coreMat = new THREE.MeshStandardMaterial({ 
            color: 0xff0055, 
            emissive: 0x550022,
            roughness: 0.2,
            metalness: 0.8,
            flatShading: true
        });
        this.core = new THREE.Mesh(coreGeo, coreMat);
        group.add(this.core);

        // Inner Ring
        const ring1Geo = new THREE.TorusGeometry(0.25, 0.01, 8, 32);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.1 });
        this.ring1 = new THREE.Mesh(ring1Geo, ringMat);
        group.add(this.ring1);

        // Outer Ring segments
        this.orbiters = [];
        for(let i=0; i<3; i++) {
            const orbiterGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
            const orbiter = new THREE.Mesh(orbiterGeo, ringMat);
            this.orbiters.push(orbiter);
            group.add(orbiter);
        }

        // Floating animation parameters
        this.time = 0;

        return group;
    }

    spawn(position, quaternion) {
        this.mesh.position.copy(position);
        this.mesh.quaternion.copy(quaternion);
        
        // Pop up animation effect
        this.mesh.scale.set(0,0,0);
        
        // Simple manual animation for spawn
        let s = 0;
        const animateSpawn = () => {
            s += 0.1;
            if (s > 1) s = 1;
            else requestAnimationFrame(animateSpawn);
            
            // Elastic bounce
            const scale = s === 1 ? 1 : Math.sin(s * Math.PI * 1.5) * 1.2; 
            this.mesh.scale.set(scale, scale, scale);
        };
        animateSpawn();

        this.spawnSound.play().catch(e => console.log("Audio play failed", e));
        return this.mesh
    }
}