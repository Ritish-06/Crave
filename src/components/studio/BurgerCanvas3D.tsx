"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BurgerCustomizationState } from "@/types";

interface BurgerCanvas3DProps {
  customization: BurgerCustomizationState;
  isExploded: boolean;
  onSelectIngredient?: (ingredientName: string) => void;
}

export function BurgerCanvas3D({ customization, isExploded }: BurgerCanvas3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.25, y: -0.4 });
  const autoRotateRef = useRef(true);

  // Group references to animate layers smoothly
  const layersGroupRef = useRef<{
    bottomBun?: THREE.Group;
    patty1?: THREE.Group;
    cheese1?: THREE.Group;
    patty2?: THREE.Group;
    cheese2?: THREE.Group;
    patty3?: THREE.Group;
    onions?: THREE.Group;
    tomatoes?: THREE.Group;
    lettuce?: THREE.Group;
    topBun?: THREE.Group;
  }>({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    // Warm dark chocolate studio atmosphere
    scene.background = new THREE.Color(0x140e0a);
    scene.fog = new THREE.FogExp2(0x140e0a, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.8);
    camera.lookAt(0, 0, 0);

    // 3. Renderer with antialiasing and shadow map
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Lights: Key, Fill, Rim, Warm Under-glow
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    scene.add(keyLight);

    const warmFillLight = new THREE.DirectionalLight(0xffa866, 1.6);
    warmFillLight.position.set(-6, 3, -4);
    scene.add(warmFillLight);

    const rimLight = new THREE.SpotLight(0xffeedd, 3.5);
    rimLight.position.set(0, 10, -5);
    rimLight.angle = Math.PI / 4;
    rimLight.penumbra = 0.8;
    scene.add(rimLight);

    // Ground pedestal with soft shadow receiver
    const pedestalGeo = new THREE.CylinderGeometry(3.6, 4.0, 0.3, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1c1511,
      roughness: 0.85,
      metalness: 0.1
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -2.1;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Main Burger Master Pivot
    const burgerMasterGroup = new THREE.Group();
    scene.add(burgerMasterGroup);

    // ----------------------------------------------------
    // BUILD PBR MESHES PROCEDURALLY
    // ----------------------------------------------------

    // Bun Material based on Bun Type
    let bunColor = 0xc97a29; // Artisanal brioche
    let bunRoughness = 0.35;
    let bunMetalness = 0.05;

    if (customization.bun === "sesame") {
      bunColor = 0xd18738;
      bunRoughness = 0.4;
    } else if (customization.bun === "charcoal") {
      bunColor = 0x222222;
      bunRoughness = 0.6;
      bunMetalness = 0.2;
    } else if (customization.bun === "gluten-free") {
      bunColor = 0xb5702d;
      bunRoughness = 0.45;
    }

    const bunMat = new THREE.MeshStandardMaterial({
      color: bunColor,
      roughness: bunRoughness,
      metalness: bunMetalness
    });

    const bunInsideMat = new THREE.MeshStandardMaterial({
      color: customization.bun === "charcoal" ? 0x333333 : 0xf2d7a2,
      roughness: 0.8
    });

    // 1. Bottom Brioche Bun
    const bottomBunGroup = new THREE.Group();
    const bottomBunGeo = new THREE.CylinderGeometry(1.5, 1.4, 0.45, 36);
    const bottomBunMesh = new THREE.Mesh(bottomBunGeo, bunMat);
    bottomBunMesh.castShadow = true;
    bottomBunMesh.receiveShadow = true;
    bottomBunGroup.add(bottomBunMesh);
    burgerMasterGroup.add(bottomBunGroup);

    // 2. Patty 1 (Wagyu / Smash)
    const pattyMat = new THREE.MeshStandardMaterial({
      color: customization.pattyType === "paneer-steak" ? 0xf0e6d2 : 0x3b2014,
      roughness: 0.9,
      metalness: 0.05
    });

    const createPattyMesh = () => {
      const pGroup = new THREE.Group();
      const pGeo = new THREE.CylinderGeometry(1.65, 1.62, 0.38, 36);
      const pMesh = new THREE.Mesh(pGeo, pattyMat);
      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      pGroup.add(pMesh);
      return pGroup;
    };

    const patty1Group = createPattyMesh();
    burgerMasterGroup.add(patty1Group);

    // 3. Cheese 1
    const createCheeseMesh = () => {
      const cGroup = new THREE.Group();
      if (customization.cheese !== "none") {
        let cheeseColor = 0xffb81c; // Cheddar
        if (customization.cheese === "swiss-gouda") cheeseColor = 0xfff0b3;
        if (customization.cheese === "smoked-provolone") cheeseColor = 0xffe6a3;

        const cheeseMat = new THREE.MeshStandardMaterial({
          color: cheeseColor,
          roughness: 0.3,
          metalness: 0.05
        });

        const cGeo = new THREE.BoxGeometry(2.3, 0.07, 2.3);
        const cMesh = new THREE.Mesh(cGeo, cheeseMat);
        cMesh.rotation.y = Math.PI / 4;
        cMesh.castShadow = true;
        cGroup.add(cMesh);
      }
      return cGroup;
    };

    const cheese1Group = createCheeseMesh();
    burgerMasterGroup.add(cheese1Group);

    // 4. Patty 2 (if double or triple)
    const patty2Group = createPattyMesh();
    patty2Group.visible = customization.pattyCount >= 2;
    burgerMasterGroup.add(patty2Group);

    // 5. Cheese 2
    const cheese2Group = createCheeseMesh();
    cheese2Group.visible = customization.pattyCount >= 2 && customization.cheese !== "none";
    burgerMasterGroup.add(cheese2Group);

    // 6. Patty 3 (if triple)
    const patty3Group = createPattyMesh();
    patty3Group.visible = customization.pattyCount >= 3;
    burgerMasterGroup.add(patty3Group);

    // 7. Onions
    const onionsGroup = new THREE.Group();
    if (customization.veggies.onion) {
      const onionMat = new THREE.MeshStandardMaterial({
        color: 0x9e3152,
        roughness: 0.4,
        transparent: true,
        opacity: 0.92
      });
      for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(0.55 + i * 0.35, 0.08, 16, 32);
        const ring = new THREE.Mesh(ringGeo, onionMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set((i - 1) * 0.4, 0, (i % 2 === 0 ? 0.2 : -0.2));
        ring.castShadow = true;
        onionsGroup.add(ring);
      }
    }
    burgerMasterGroup.add(onionsGroup);

    // 8. Tomatoes
    const tomatoesGroup = new THREE.Group();
    if (customization.veggies.tomato) {
      const tomatoMat = new THREE.MeshStandardMaterial({
        color: 0xcc2914,
        roughness: 0.2,
        metalness: 0.05
      });
      for (let i = 0; i < 2; i++) {
        const tGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.16, 32);
        const tMesh = new THREE.Mesh(tGeo, tomatoMat);
        tMesh.position.set((i === 0 ? -0.55 : 0.55), 0, (i === 0 ? 0.2 : -0.2));
        tMesh.rotation.z = (i === 0 ? 0.08 : -0.08);
        tMesh.castShadow = true;
        tomatoesGroup.add(tMesh);
      }
    }
    burgerMasterGroup.add(tomatoesGroup);

    // 9. Lettuce (Crisp wavy leaf)
    const lettuceGroup = new THREE.Group();
    if (customization.veggies.lettuce) {
      const lettuceMat = new THREE.MeshStandardMaterial({
        color: 0x48992c,
        roughness: 0.6,
        side: THREE.DoubleSide
      });
      const lettuceGeo = new THREE.CylinderGeometry(1.85, 1.7, 0.12, 32);
      const lettuceMesh = new THREE.Mesh(lettuceGeo, lettuceMat);
      lettuceMesh.castShadow = true;
      lettuceGroup.add(lettuceMesh);
    }
    burgerMasterGroup.add(lettuceGroup);

    // 10. Top Brioche Bun (Dome)
    const topBunGroup = new THREE.Group();
    const domeGeo = new THREE.SphereGeometry(1.6, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2);
    const topBunMesh = new THREE.Mesh(domeGeo, bunMat);
    topBunMesh.castShadow = true;
    topBunMesh.receiveShadow = true;
    topBunGroup.add(topBunMesh);

    // Flat bottom cut of top bun
    const topCutGeo = new THREE.CircleGeometry(1.6, 36);
    const topCutMesh = new THREE.Mesh(topCutGeo, bunInsideMat);
    topCutMesh.rotation.x = Math.PI / 2;
    topBunGroup.add(topCutMesh);

    // Sesame seeds if sesame bun selected
    if (customization.bun === "sesame") {
      const seedMat = new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.3 });
      const seedGeo = new THREE.ConeGeometry(0.04, 0.09, 8);
      for (let s = 0; s < 45; s++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0) * 0.45; // top hemisphere
        const r = 1.6;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.cos(phi);
        const z = r * Math.sin(phi) * Math.sin(theta);
        const seed = new THREE.Mesh(seedGeo, seedMat);
        seed.position.set(x, y, z);
        seed.lookAt(x * 2, y * 2, z * 2);
        topBunGroup.add(seed);
      }
    }

    burgerMasterGroup.add(topBunGroup);

    // Store layer references
    layersGroupRef.current = {
      bottomBun: bottomBunGroup,
      patty1: patty1Group,
      cheese1: cheese1Group,
      patty2: patty2Group,
      cheese2: cheese2Group,
      patty3: patty3Group,
      onions: onionsGroup,
      tomatoes: tomatoesGroup,
      lettuce: lettuceGroup,
      topBun: topBunGroup
    };

    // ----------------------------------------------------
    // USER POINTER INTERACTION (Orbit Rotation)
    // ----------------------------------------------------
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;

      rotationRef.current.y += deltaX * 0.008;
      rotationRef.current.x = Math.max(
        -0.4,
        Math.min(0.7, rotationRef.current.x + deltaY * 0.008)
      );

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // ----------------------------------------------------
    // ANIMATION RENDER LOOP (Explode/Assemble smooth lerp)
    // ----------------------------------------------------
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto rotation when idle
      if (autoRotateRef.current) {
        rotationRef.current.y += 0.003;
      }

      burgerMasterGroup.rotation.y = rotationRef.current.y;
      burgerMasterGroup.rotation.x = rotationRef.current.x;

      // Calculate Target Y positions for each layer based on exploded status
      const exploded = isExploded;
      const pCount = customization.pattyCount;

      const targetBottom = exploded ? -1.8 : -0.7;
      const targetPatty1 = exploded ? -1.1 : -0.3;
      const targetCheese1 = exploded ? -0.7 : -0.05;
      const targetPatty2 = exploded ? -0.2 : (pCount >= 2 ? 0.3 : -0.3);
      const targetCheese2 = exploded ? 0.3 : (pCount >= 2 ? 0.55 : -0.05);
      const targetPatty3 = exploded ? 0.8 : (pCount >= 3 ? 0.9 : -0.3);
      const targetOnions = exploded ? 1.3 : (pCount === 1 ? 0.2 : pCount === 2 ? 0.75 : 1.15);
      const targetTomatoes = exploded ? 1.8 : (pCount === 1 ? 0.45 : pCount === 2 ? 1.0 : 1.4);
      const targetLettuce = exploded ? 2.3 : (pCount === 1 ? 0.7 : pCount === 2 ? 1.25 : 1.65);
      const targetTop = exploded ? 3.0 : (pCount === 1 ? 1.05 : pCount === 2 ? 1.6 : 2.0);

      const lerpFactor = 0.08;
      if (bottomBunGroup) bottomBunGroup.position.y += (targetBottom - bottomBunGroup.position.y) * lerpFactor;
      if (patty1Group) patty1Group.position.y += (targetPatty1 - patty1Group.position.y) * lerpFactor;
      if (cheese1Group) cheese1Group.position.y += (targetCheese1 - cheese1Group.position.y) * lerpFactor;
      if (patty2Group) patty2Group.position.y += (targetPatty2 - patty2Group.position.y) * lerpFactor;
      if (cheese2Group) cheese2Group.position.y += (targetCheese2 - cheese2Group.position.y) * lerpFactor;
      if (patty3Group) patty3Group.position.y += (targetPatty3 - patty3Group.position.y) * lerpFactor;
      if (onionsGroup) onionsGroup.position.y += (targetOnions - onionsGroup.position.y) * lerpFactor;
      if (tomatoesGroup) tomatoesGroup.position.y += (targetTomatoes - tomatoesGroup.position.y) * lerpFactor;
      if (lettuceGroup) lettuceGroup.position.y += (targetLettuce - lettuceGroup.position.y) * lerpFactor;
      if (topBunGroup) topBunGroup.position.y += (targetTop - topBunGroup.position.y) * lerpFactor;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container && domElement.parentNode === container) {
        container.removeChild(domElement);
      }
    };
  }, [customization, isExploded]);

  if (!webGlSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#140e0a] text-white p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-[#1c1511] flex items-center justify-center text-[#FF4D2D] mb-4">
          🍔
        </div>
        <h3 className="text-xl font-bold">Interactive 3D Mode Available</h3>
        <p className="text-xs text-[#9E948C] max-w-sm mt-2">
          Your browser does not currently support WebGL acceleration. You can still customize your burger using the ingredient controls below!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden select-none"
      aria-label="Interactive 3D Burger Canvas. Click and drag to rotate."
    />
  );
}
