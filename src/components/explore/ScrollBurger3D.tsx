"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import {
  Layers,
  ArrowRight,
  Sparkles,
  Sliders,
  Eye,
  CheckCircle2,
  RefreshCw,
  Info
} from "lucide-react";

export function ScrollBurger3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [assemblyProgress, setAssemblyProgress] = useState(0.85); // 0 = exploded, 1 = assembled
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Layer groups references for smooth Three.js interpolation
  const layersRef = useRef<{
    topBun?: THREE.Group;
    lettuce?: THREE.Group;
    tomatoes?: THREE.Group;
    onions?: THREE.Group;
    cheese?: THREE.Group;
    patty?: THREE.Group;
    bottomBun?: THREE.Group;
  }>({});

  const rotationRef = useRef({ x: 0.2, y: -0.3 });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const currentAssemblyRef = useRef(0.85);

  // Synchronize ref
  useEffect(() => {
    currentAssemblyRef.current = assemblyProgress;
  }, [assemblyProgress]);

  // Connect scroll progress to burger assembly
  useEffect(() => {
    const handleScroll = () => {
      if (isManualOverride || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress between when section enters and leaves
      // 0 when section enters top, 1 when centered, stays assembled
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distance = sectionCenter - viewportCenter;
      const totalRange = windowHeight * 0.8;

      // Map: distance > 0 (approaching) -> exploded (0.1), centered -> assembled (1.0)
      const normalized = Math.max(0, Math.min(1, 1 - distance / totalRange));
      setAssemblyProgress(Math.max(0.1, Math.min(1.0, normalized)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isManualOverride]);

  // Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x140e0a);
    scene.fog = new THREE.FogExp2(0x140e0a, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.5);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const warmFillLight = new THREE.DirectionalLight(0xff9944, 1.8);
    warmFillLight.position.set(-6, 3, -4);
    scene.add(warmFillLight);

    const rimLight = new THREE.SpotLight(0xffe4cc, 3.2);
    rimLight.position.set(0, 10, -5);
    rimLight.angle = Math.PI / 4;
    rimLight.penumbra = 0.8;
    scene.add(rimLight);

    // 5. Materials
    const bunMaterial = new THREE.MeshStandardMaterial({
      color: 0xc87d32,
      roughness: 0.35,
      metalness: 0.05,
    });

    const pattyMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2012,
      roughness: 0.85,
      metalness: 0.1,
    });

    const cheeseMaterial = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      roughness: 0.25,
      metalness: 0.05,
    });

    const tomatoMaterial = new THREE.MeshStandardMaterial({
      color: 0xd9261c,
      roughness: 0.25,
      metalness: 0.05,
    });

    const lettuceMaterial = new THREE.MeshStandardMaterial({
      color: 0x38b000,
      roughness: 0.45,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    const onionMaterial = new THREE.MeshStandardMaterial({
      color: 0x800f48,
      roughness: 0.3,
      metalness: 0.1,
    });

    // 6. Burger Mesh Hierarchies
    const burgerRoot = new THREE.Group();
    scene.add(burgerRoot);

    // Bottom Bun
    const bottomBunGroup = new THREE.Group();
    const bottomBunGeo = new THREE.CylinderGeometry(1.4, 1.3, 0.45, 32);
    const bottomBunMesh = new THREE.Mesh(bottomBunGeo, bunMaterial);
    bottomBunMesh.castShadow = true;
    bottomBunMesh.receiveShadow = true;
    bottomBunGroup.add(bottomBunMesh);
    burgerRoot.add(bottomBunGroup);

    // Smashed Wagyu Patty
    const pattyGroup = new THREE.Group();
    const pattyGeo = new THREE.CylinderGeometry(1.45, 1.48, 0.38, 28);
    const pattyMesh = new THREE.Mesh(pattyGeo, pattyMaterial);
    pattyMesh.castShadow = true;
    pattyMesh.receiveShadow = true;
    pattyGroup.add(pattyMesh);
    burgerRoot.add(pattyGroup);

    // Melted Cheese
    const cheeseGroup = new THREE.Group();
    const cheeseGeo = new THREE.BoxGeometry(2.3, 0.08, 2.3);
    const cheeseMesh = new THREE.Mesh(cheeseGeo, cheeseMaterial);
    cheeseMesh.rotation.y = Math.PI / 4;
    cheeseMesh.castShadow = true;
    cheeseGroup.add(cheeseMesh);
    burgerRoot.add(cheeseGroup);

    // Onions
    const onionsGroup = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const ringGeo = new THREE.TorusGeometry(0.8 + i * 0.3, 0.09, 12, 32);
      const ringMesh = new THREE.Mesh(ringGeo, onionMaterial);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set((i - 0.5) * 0.2, 0, (i - 0.5) * 0.1);
      onionsGroup.add(ringMesh);
    }
    burgerRoot.add(onionsGroup);

    // Heirloom Tomatoes
    const tomatoesGroup = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const tomGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.12, 24);
      const tomMesh = new THREE.Mesh(tomGeo, tomatoMaterial);
      tomMesh.position.set((i === 0 ? -0.45 : 0.45), 0, 0);
      tomMesh.rotation.z = (i === 0 ? -0.1 : 0.1);
      tomMesh.castShadow = true;
      tomatoesGroup.add(tomMesh);
    }
    burgerRoot.add(tomatoesGroup);

    // Crisp Lettuce
    const lettuceGroup = new THREE.Group();
    const lettuceGeo = new THREE.CylinderGeometry(1.6, 1.5, 0.12, 24);
    const lettuceMesh = new THREE.Mesh(lettuceGeo, lettuceMaterial);
    lettuceMesh.rotation.z = 0.05;
    lettuceMesh.castShadow = true;
    lettuceGroup.add(lettuceMesh);
    burgerRoot.add(lettuceGroup);

    // Top Brioche Bun
    const topBunGroup = new THREE.Group();
    const topBunGeo = new THREE.SphereGeometry(1.48, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const topBunMesh = new THREE.Mesh(topBunGeo, bunMaterial);
    topBunMesh.scale.set(1, 0.65, 1);
    topBunMesh.castShadow = true;
    topBunGroup.add(topBunMesh);

    // Sesame Seeds
    const seedGeo = new THREE.SphereGeometry(0.04, 8, 6);
    seedGeo.scale(1, 0.4, 2);
    const seedMat = new THREE.MeshStandardMaterial({ color: 0xfff0db, roughness: 0.3 });
    for (let i = 0; i < 40; i++) {
      const u = Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(1 - 0.85 * u);
      const r = 1.48;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi) * 0.65 + 0.02;
      const z = r * Math.sin(phi) * Math.sin(theta);
      const seed = new THREE.Mesh(seedGeo, seedMat);
      seed.position.set(x, y, z);
      seed.lookAt(0, 0, 0);
      topBunGroup.add(seed);
    }
    burgerRoot.add(topBunGroup);

    layersRef.current = {
      bottomBun: bottomBunGroup,
      patty: pattyGroup,
      cheese: cheeseGroup,
      onions: onionsGroup,
      tomatoes: tomatoesGroup,
      lettuce: lettuceGroup,
      topBun: topBunGroup,
    };

    // 7. Mouse/Touch Orbit Handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      rotationRef.current.y += deltaX * 0.008;
      rotationRef.current.x += deltaY * 0.008;
      rotationRef.current.x = Math.max(-0.4, Math.min(0.6, rotationRef.current.x));
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 8. Animation Loop
    let animId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto gentle spin when not dragging
      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.004;
      }

      burgerRoot.rotation.x = THREE.MathUtils.lerp(burgerRoot.rotation.x, rotationRef.current.x, 0.1);
      burgerRoot.rotation.y = THREE.MathUtils.lerp(burgerRoot.rotation.y, rotationRef.current.y, 0.1);

      // Interpolate vertical positions based on assemblyProgress (0 = exploded, 1 = assembled)
      const factor = currentAssemblyRef.current; // 0..1
      const inv = 1 - factor; // 1 = exploded, 0 = assembled

      // Assembled Y vs Exploded Y
      if (layersRef.current.bottomBun) layersRef.current.bottomBun.position.y = lerp(-0.7, -1.8, inv);
      if (layersRef.current.patty) layersRef.current.patty.position.y = lerp(-0.35, -1.1, inv);
      if (layersRef.current.cheese) layersRef.current.cheese.position.y = lerp(-0.15, -0.4, inv);
      if (layersRef.current.onions) layersRef.current.onions.position.y = lerp(0.02, 0.35, inv);
      if (layersRef.current.tomatoes) layersRef.current.tomatoes.position.y = lerp(0.18, 1.0, inv);
      if (layersRef.current.lettuce) layersRef.current.lettuce.position.y = lerp(0.35, 1.7, inv);
      if (layersRef.current.topBun) layersRef.current.topBun.position.y = lerp(0.52, 2.5, inv);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      renderer.dispose();
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#140E0A] text-white py-20 lg:py-28 overflow-hidden border-b border-[#2A1F18]"
    >
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF4D2D]/12 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: 3D Storytelling & Controls */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1511] border border-[#2A1F18] text-xs font-bold text-[#FF4D2D]">
              <Layers className="w-3.5 h-3.5" />
              <span>THE CRAVE SIGNATURE 3D EXPERIENCE</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase font-sans text-white leading-[1.08]">
                BUILT YOUR WAY. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] via-[#FFA384] to-[#FF6B4E]">
                  BITE BY BITE.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#A3988E] max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Watch every artisanal ingredient assemble dynamically as you scroll. Or take total control: spin in 3D, explode the layers, and stack your dream smash burger.
              </p>
            </div>

            {/* Assembly Slider & Preset Pills */}
            <div className="bg-[#1C1511] p-4 sm:p-5 rounded-2xl border border-[#2A1F18] space-y-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  Assembly Factor:
                </span>
                <span className="font-mono font-bold text-[#FF4D2D]">
                  {Math.round(assemblyProgress * 100)}% {assemblyProgress > 0.8 ? "Assembled" : "Exploded"}
                </span>
              </div>

              {/* Range input */}
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.01"
                value={assemblyProgress}
                onChange={(e) => {
                  setIsManualOverride(true);
                  setAssemblyProgress(parseFloat(e.target.value));
                }}
                className="w-full accent-[#FF4D2D] cursor-pointer"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsManualOverride(true);
                    setAssemblyProgress(0.15);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    assemblyProgress < 0.5
                      ? "bg-[#FF4D2D] text-white border-[#FF4D2D]"
                      : "bg-[#140E0A] text-[#A3988E] border-[#2A1F18] hover:text-white"
                  }`}
                >
                  Exploded View
                </button>
                <button
                  onClick={() => {
                    setIsManualOverride(true);
                    setAssemblyProgress(1.0);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    assemblyProgress >= 0.5
                      ? "bg-[#FF4D2D] text-white border-[#FF4D2D]"
                      : "bg-[#140E0A] text-[#A3988E] border-[#2A1F18] hover:text-white"
                  }`}
                >
                  Assembled View
                </button>
              </div>
            </div>

            {/* CTA to full 3D Dish Studio */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/studio"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-black text-sm tracking-wide shadow-xl shadow-[#FF4D2D]/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Customize in 3D Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <span className="text-xs text-[#766E65] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#FF4D2D]" />
                Interactive WebGL 60 FPS
              </span>
            </div>
          </div>

          {/* Right Column: WebGL Canvas Stage */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl border border-[#2A1F18] bg-radial from-[#1C1511] to-[#120D0A] shadow-2xl p-2 sm:p-4 overflow-hidden relative">
              {/* Floating Instruction Badge */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-[#E5DDD4]">
                <span className="w-2 h-2 rounded-full bg-[#FF4D2D] animate-ping" />
                <span className="font-semibold">Drag to rotate 3D mesh</span>
              </div>

              {/* 3D Container */}
              <div
                ref={mountRef}
                className="w-full h-[400px] sm:h-[480px] rounded-2xl cursor-grab active:cursor-grabbing"
              />

              {/* Fallback if WebGL fails */}
              {!webGlSupported && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#140E0A] p-6 text-center space-y-3">
                  <Layers className="w-12 h-12 text-[#FF4D2D]" />
                  <h4 className="text-base font-bold text-white">Interactive 3D Preview</h4>
                  <p className="text-xs text-[#A3988E]">
                    Your browser does not support WebGL, but you can still customize your dish in the Studio.
                  </p>
                  <Link
                    href="/studio"
                    className="px-5 py-2.5 rounded-xl bg-[#FF4D2D] text-white font-bold text-xs"
                  >
                    Open 3D Studio
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
