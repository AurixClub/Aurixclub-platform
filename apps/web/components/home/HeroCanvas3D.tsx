"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const isMobile = window.innerWidth < 768;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ========== PARTICLE SYSTEM ==========
    const particleCount = isMobile ? 350 : 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities: { x: number; y: number; z: number }[] = [];

    // Soft indigo → violet → fuchsia palette
    const colorPalette = [
      new THREE.Color("#818cf8"),
      new THREE.Color("#a78bfa"),
      new THREE.Color("#c084fc"),
      new THREE.Color("#e879f9"),
      new THREE.Color("#67e8f9"),
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 18 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = radius * Math.cos(phi) - 10;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 2.2 + 0.4;

      velocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.006,
        z: (Math.random() - 0.5) * 0.005,
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float pulse = sin(uTime * 1.5 + position.x * 0.5) * 0.25 + 0.85;
          gl_PointSize = size * pulse * (180.0 / -mvPosition.z) * (uPixelRatio / 1.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist) * 0.75;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ========== CONSTELLATION LINES ==========
    const maxLines = isMobile ? 30 : 80;
    const linePositions = new Float32Array(maxLines * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.12,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Dynamic line updates
    const updateConstellation = () => {
      let lineIndex = 0;
      const pos = geometry.attributes.position.array as Float32Array;
      const connectionDist = isMobile ? 7 : 9;

      for (let i = 0; i < Math.min(particleCount, 80) && lineIndex < maxLines; i++) {
        for (let j = i + 1; j < Math.min(particleCount, 80) && lineIndex < maxLines; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionDist) {
            linePositions[lineIndex * 6] = pos[i * 3];
            linePositions[lineIndex * 6 + 1] = pos[i * 3 + 1];
            linePositions[lineIndex * 6 + 2] = pos[i * 3 + 2];
            linePositions[lineIndex * 6 + 3] = pos[j * 3];
            linePositions[lineIndex * 6 + 4] = pos[j * 3 + 1];
            linePositions[lineIndex * 6 + 5] = pos[j * 3 + 2];
            lineIndex++;
          }
        }
      }
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIndex * 2);
    };

    // Parallax mouse effect
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Animation Loop with Visibility Control
    let animationId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return; // Pause rendering when scrolled out of view

      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;

      // Update particle drift
      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        if (Math.abs(pos[i * 3]) > 30) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 25) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 30) velocities[i].z *= -1;
      }
      geometry.attributes.position.needsUpdate = true;
      if (!isMobile) updateConstellation();

      particles.rotation.y = elapsed * 0.03 + mouseX * 0.08;
      particles.rotation.x = mouseY * 0.05;
      lines.rotation.copy(particles.rotation);

      camera.position.x = Math.sin(elapsed * 0.15) * 1.5 + mouseX * 1.2;
      camera.position.y = Math.cos(elapsed * 0.12) * 0.8 + mouseY * 0.8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}