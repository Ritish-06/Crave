"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BurgerCustomizationState } from "@/types";

export type CameraPreset = "hero" | "iso" | "top" | "macro";

interface BurgerCanvas3DProps {
  customization: BurgerCustomizationState;
  isExploded: boolean;
  cameraPreset?: CameraPreset;
  onSelectIngredient?: (ingredientName: string) => void;
}

// ---------------------------------------------------------------------------
// Procedural Canvas Texture Generators for Ultra-Realistic PBR Surfaces
// ---------------------------------------------------------------------------

function createToastedBunTexture(toastLevel: number = 2, bunType: string = "brioche"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base cut color
  const isCharcoal = bunType === "charcoal";
  ctx.fillStyle = isCharcoal ? "#2b2b2b" : "#faecd0";
  ctx.fillRect(0, 0, 256, 256);

  // Butter toast ring gradient
  const centerX = 128;
  const centerY = 128;
  const radGrad = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, 120);

  if (isCharcoal) {
    radGrad.addColorStop(0, "rgba(50, 50, 50, 0.4)");
    radGrad.addColorStop(0.7, "rgba(30, 30, 30, 0.8)");
    radGrad.addColorStop(1, "rgba(20, 20, 20, 0.95)");
  } else {
    const toastAlpha = 0.25 + toastLevel * 0.18;
    const toastColor =
      toastLevel === 1
        ? `rgba(200, 130, 50, ${toastAlpha})`
        : toastLevel === 2
        ? `rgba(165, 85, 20, ${toastAlpha})`
        : toastLevel === 3
        ? `rgba(125, 55, 10, ${toastAlpha})`
        : `rgba(75, 25, 5, ${toastAlpha})`;

    radGrad.addColorStop(0, "rgba(255, 245, 220, 0.1)");
    radGrad.addColorStop(0.55, toastColor);
    radGrad.addColorStop(1, "rgba(100, 45, 15, 0.85)");
  }

  ctx.fillStyle = radGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
  ctx.fill();

  // Draw grill char lines if toast level >= 3
  if (toastLevel >= 3 && !isCharcoal) {
    ctx.strokeStyle = toastLevel === 4 ? "rgba(40, 15, 5, 0.8)" : "rgba(80, 35, 10, 0.55)";
    ctx.lineWidth = toastLevel === 4 ? 6 : 4;
    ctx.lineCap = "round";

    for (let i = -120; i <= 240; i += 38) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 140, 256);
      ctx.stroke();
    }
  }

  // Toasted grain speckles
  for (let s = 0; s < 120; s++) {
    const rx = 128 + (Math.random() - 0.5) * 210;
    const ry = 128 + (Math.random() - 0.5) * 210;
    const dist = Math.hypot(rx - 128, ry - 128);
    if (dist < 118) {
      ctx.fillStyle = isCharcoal ? "rgba(255, 255, 255, 0.08)" : `rgba(120, 60, 20, ${Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(rx, ry, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function createPattyBumpTexture(pattyType: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 256, 256);

  if (pattyType === "paneer-steak") {
    // Distinct grill bar marks for paneer
    ctx.strokeStyle = "#202020";
    ctx.lineWidth = 8;
    for (let x = 20; x < 256; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    // Cross marks
    ctx.lineWidth = 5;
    for (let y = 30; y < 256; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
  } else if (pattyType === "crispy-chicken") {
    // High frequency noisy panko crumb bumps
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 3 + 1;
      const val = Math.floor(Math.random() * 120 + 130);
      ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Wagyu / Plant: Organic coarse meat grain & craggy smash ridges
    for (let i = 0; i < 1200; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 4 + 0.8;
      const val = Math.floor(Math.random() * 90 + 80);
      ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Searing crust lines
    ctx.strokeStyle = "#404040";
    ctx.lineWidth = 5;
    for (let i = 0; i < 5; i++) {
      const y = 35 + i * 45;
      ctx.beginPath();
      ctx.moveTo(15, y + (Math.random() - 0.5) * 8);
      ctx.lineTo(240, y + (Math.random() - 0.5) * 8);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function BurgerCanvas3D({
  customization,
  isExploded,
  cameraPreset = "hero",
  onSelectIngredient
}: BurgerCanvas3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.22, y: -0.35 });
  const autoRotateRef = useRef(true);

  // Group references for smooth layer transitions
  const layersGroupRef = useRef<{
    bottomBun?: THREE.Group;
    patty1?: THREE.Group;
    cheese1?: THREE.Group;
    sauceLayer1?: THREE.Group;
    patty2?: THREE.Group;
    cheese2?: THREE.Group;
    sauceLayer2?: THREE.Group;
    patty3?: THREE.Group;
    onions?: THREE.Group;
    tomatoes?: THREE.Group;
    lettuce?: THREE.Group;
    sauceTop?: THREE.Group;
    topBun?: THREE.Group;
    steamParticles?: THREE.Points;
  }>({});

  const cameraTargetRef = useRef(new THREE.Vector3(0, 1.2, 7.8));
  const cameraLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  // Update camera preset coordinates
  useEffect(() => {
    if (cameraPreset === "hero") {
      cameraTargetRef.current.set(0, 1.2, 7.8);
      cameraLookAtRef.current.set(0, 0, 0);
    } else if (cameraPreset === "iso") {
      cameraTargetRef.current.set(4.8, 3.8, 6.2);
      cameraLookAtRef.current.set(0, 0.2, 0);
    } else if (cameraPreset === "top") {
      cameraTargetRef.current.set(0, 8.8, 0.8);
      cameraLookAtRef.current.set(0, 0, 0);
    } else if (cameraPreset === "macro") {
      cameraTargetRef.current.set(0, 0.1, 4.3);
      cameraLookAtRef.current.set(0, 0.1, 0);
    }
  }, [cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
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

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x140e0a);
    scene.fog = new THREE.FogExp2(0x140e0a, 0.038);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.copy(cameraTargetRef.current);
    camera.lookAt(cameraLookAtRef.current);

    // 3. Renderer with antialiasing and shadow maps
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Lights: Key, Fill, Rim, Warm Sizzle Under-glow
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5.5, 8.5, 6.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    scene.add(keyLight);

    const warmFillLight = new THREE.DirectionalLight(0xff9955, 1.7);
    warmFillLight.position.set(-6, 3.2, -4);
    scene.add(warmFillLight);

    const rimLight = new THREE.SpotLight(0xffeedd, 3.8);
    rimLight.position.set(0, 10, -5.5);
    rimLight.angle = Math.PI / 4;
    rimLight.penumbra = 0.8;
    scene.add(rimLight);

    const underGlow = new THREE.PointLight(0xff5522, 0.8, 8);
    underGlow.position.set(0, -1.8, 1);
    scene.add(underGlow);

    // Ground pedestal with soft shadow receiver
    const pedestalGeo = new THREE.CylinderGeometry(3.6, 4.0, 0.3, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1b1410,
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

    // Bun Material with Dynamic Toasting Levels
    const toast = customization.bunToastLevel || 2;
    let bunColor = 0xc97a29; // Level 2 base
    let bunRoughness = 0.35;
    let bunMetalness = 0.05;

    if (customization.bun === "sesame") {
      if (toast === 1) { bunColor = 0xe4a45a; bunRoughness = 0.42; }
      else if (toast === 2) { bunColor = 0xd18738; bunRoughness = 0.38; }
      else if (toast === 3) { bunColor = 0xa35a16; bunRoughness = 0.30; bunMetalness = 0.08; }
      else { bunColor = 0x6e350b; bunRoughness = 0.50; }
    } else if (customization.bun === "charcoal") {
      bunColor = toast >= 3 ? 0x181818 : 0x242424;
      bunRoughness = toast >= 3 ? 0.45 : 0.6;
      bunMetalness = 0.2;
    } else if (customization.bun === "gluten-free") {
      if (toast === 1) bunColor = 0xcfa05a;
      else if (toast === 2) bunColor = 0xb5702d;
      else if (toast === 3) bunColor = 0x8a4613;
      else bunColor = 0x5a2a09;
      bunRoughness = 0.45;
    } else {
      // Artisanal Brioche
      if (toast === 1) { bunColor = 0xdda560; bunRoughness = 0.44; }
      else if (toast === 2) { bunColor = 0xc97a29; bunRoughness = 0.35; }
      else if (toast === 3) { bunColor = 0x9e4e13; bunRoughness = 0.28; bunMetalness = 0.09; }
      else { bunColor = 0x642e0b; bunRoughness = 0.52; }
    }

    const bunMat = new THREE.MeshStandardMaterial({
      color: bunColor,
      roughness: bunRoughness,
      metalness: bunMetalness
    });

    const bunCutTexture = createToastedBunTexture(toast, customization.bun);
    const bunInsideMat = new THREE.MeshStandardMaterial({
      map: bunCutTexture,
      roughness: 0.75,
      metalness: 0.02
    });

    // 1. Bottom Brioche Bun
    const bottomBunGroup = new THREE.Group();
    const bottomBunGeo = new THREE.CylinderGeometry(1.5, 1.4, 0.45, 36);
    const bottomBunMesh = new THREE.Mesh(bottomBunGeo, bunMat);
    bottomBunMesh.castShadow = true;
    bottomBunMesh.receiveShadow = true;
    bottomBunGroup.add(bottomBunMesh);

    // Flat toasted cut on bottom bun
    const bottomCutGeo = new THREE.CircleGeometry(1.5, 36);
    const bottomCutMesh = new THREE.Mesh(bottomCutGeo, bunInsideMat);
    bottomCutMesh.rotation.x = -Math.PI / 2;
    bottomCutMesh.position.y = 0.23;
    bottomBunGroup.add(bottomCutMesh);

    burgerMasterGroup.add(bottomBunGroup);

    // ----------------------------------------------------
    // Patty Materials & Procedural Bump Maps
    // ----------------------------------------------------
    const pattyBumpTexture = createPattyBumpTexture(customization.pattyType);

    // Patty Color & Doneness
    let pattyBaseColor = 0x3b2014; // Default wagyu
    let pattyRoughness = 0.85;
    let pattyMetalness = 0.05;

    const doneness = customization.pattyDoneness || "medium-well";

    if (customization.pattyType === "paneer-steak") {
      pattyBaseColor = 0xf2ebdc;
      pattyRoughness = 0.65;
    } else if (customization.pattyType === "crispy-chicken") {
      pattyBaseColor = 0xca8832;
      pattyRoughness = 0.88;
    } else if (customization.pattyType === "plant-protein") {
      pattyBaseColor = 0x482d1c;
      pattyRoughness = 0.82;
    } else {
      // Wagyu Smash
      if (doneness === "medium-rare") {
        pattyBaseColor = 0x4d2217;
        pattyRoughness = 0.65; // glistening meat juice sheen
        pattyMetalness = 0.12;
      } else if (doneness === "medium-well") {
        pattyBaseColor = 0x381e13;
        pattyRoughness = 0.78;
        pattyMetalness = 0.08;
      } else {
        // Crispy smash crust
        pattyBaseColor = 0x26130b;
        pattyRoughness = 0.92;
        pattyMetalness = 0.04;
      }
    }

    const pattyMat = new THREE.MeshStandardMaterial({
      color: pattyBaseColor,
      bumpMap: pattyBumpTexture,
      bumpScale: 0.06,
      roughness: pattyRoughness,
      metalness: pattyMetalness
    });

    const createPattyMesh = () => {
      const pGroup = new THREE.Group();
      // Irregular smash silhouette with multiple segmented rings
      const pGeo = new THREE.CylinderGeometry(1.68, 1.63, 0.4, 40);
      const pMesh = new THREE.Mesh(pGeo, pattyMat);
      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      pGroup.add(pMesh);

      // Searing caramelization lip (crispy smash ring edge)
      if (customization.pattyType === "wagyu") {
        const lipGeo = new THREE.TorusGeometry(1.62, 0.05, 12, 36);
        const lipMat = new THREE.MeshStandardMaterial({ color: 0x1f0e07, roughness: 0.95 });
        const lip = new THREE.Mesh(lipGeo, lipMat);
        lip.rotation.x = Math.PI / 2;
        lip.position.y = 0.15;
        pGroup.add(lip);
      }

      return pGroup;
    };

    const patty1Group = createPattyMesh();
    burgerMasterGroup.add(patty1Group);

    // ----------------------------------------------------
    // Melted Artisan Cheese
    // ----------------------------------------------------
    const createCheeseMesh = () => {
      const cGroup = new THREE.Group();
      if (customization.cheese !== "none") {
        let cheeseColor = 0xffb81c; // Cheddar
        if (customization.cheese === "swiss-gouda") cheeseColor = 0xfff0b3;
        if (customization.cheese === "smoked-provolone") cheeseColor = 0xffe6a3;

        const cheeseMat = new THREE.MeshStandardMaterial({
          color: cheeseColor,
          roughness: 0.25,
          metalness: 0.04
        });

        // Main draped slice rotated 45 degrees
        const cGeo = new THREE.BoxGeometry(2.35, 0.075, 2.35);
        const cMesh = new THREE.Mesh(cGeo, cheeseMat);
        cMesh.rotation.y = Math.PI / 4;
        cMesh.castShadow = true;
        cGroup.add(cMesh);

        // Melted droops dripping over edges
        for (let corner = 0; corner < 4; corner++) {
          const droopGeo = new THREE.ConeGeometry(0.22, 0.35, 12);
          const droop = new THREE.Mesh(droopGeo, cheeseMat);
          droop.rotation.x = Math.PI;
          const angle = (corner * Math.PI) / 2 + Math.PI / 4;
          droop.position.set(Math.cos(angle) * 1.55, -0.15, Math.sin(angle) * 1.55);
          cGroup.add(droop);
        }
      }
      return cGroup;
    };

    const cheese1Group = createCheeseMesh();
    burgerMasterGroup.add(cheese1Group);

    // ----------------------------------------------------
    // 3D Visual Sauce Drizzle Layer
    // ----------------------------------------------------
    const createSauceDrizzleMesh = () => {
      const sGroup = new THREE.Group();
      const s = customization.sauces;
      const activeSauces: { color: number; name: string }[] = [];

      if (s.truffleMayo) activeSauces.push({ color: 0xfaf4e1, name: "Truffle Mayo" });
      if (s.chipotleBbq) activeSauces.push({ color: 0x581308, name: "Chipotle BBQ" });
      if (s.ghostPepper) activeSauces.push({ color: 0xdf2910, name: "Ghost Pepper" });
      if (s.craveSpecial) activeSauces.push({ color: 0xea6c38, name: "Crave Special" });

      if (activeSauces.length === 0) return sGroup;

      activeSauces.forEach((sauce, idx) => {
        const sauceMat = new THREE.MeshStandardMaterial({
          color: sauce.color,
          roughness: 0.14,
          metalness: 0.08
        });

        // Spiral drizzle ribbons across the patty
        const curvePoints: THREE.Vector3[] = [];
        const radius = 1.35;
        const totalLoops = 3;
        const angleOffset = (idx * Math.PI) / 2;

        for (let i = 0; i <= 40; i++) {
          const t = i / 40;
          const theta = t * Math.PI * 2 * totalLoops + angleOffset;
          const r = radius * (1 - t * 0.7);
          const x = Math.cos(theta) * r;
          const z = Math.sin(theta) * r;
          const y = 0.05 + Math.sin(t * Math.PI * 6) * 0.02;
          curvePoints.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.055, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, sauceMat);
        tubeMesh.castShadow = true;
        sGroup.add(tubeMesh);

        // Dripping sauce beads on the outer perimeter
        for (let d = 0; d < 3; d++) {
          const dripGeo = new THREE.SphereGeometry(0.09, 12, 12);
          const dripMesh = new THREE.Mesh(dripGeo, sauceMat);
          const dripAngle = angleOffset + (d * Math.PI * 2) / 3;
          dripMesh.position.set(Math.cos(dripAngle) * 1.62, -0.06 - d * 0.03, Math.sin(dripAngle) * 1.62);
          sGroup.add(dripMesh);
        }
      });

      return sGroup;
    };

    const sauceLayer1Group = createSauceDrizzleMesh();
    burgerMasterGroup.add(sauceLayer1Group);

    // 4. Patty 2 (if double or triple)
    const patty2Group = createPattyMesh();
    patty2Group.visible = customization.pattyCount >= 2;
    burgerMasterGroup.add(patty2Group);

    // 5. Cheese 2
    const cheese2Group = createCheeseMesh();
    cheese2Group.visible = customization.pattyCount >= 2 && customization.cheese !== "none";
    burgerMasterGroup.add(cheese2Group);

    // Sauce Layer 2 (for double/triple)
    const sauceLayer2Group = createSauceDrizzleMesh();
    sauceLayer2Group.visible = customization.pattyCount >= 2;
    burgerMasterGroup.add(sauceLayer2Group);

    // 6. Patty 3 (if triple)
    const patty3Group = createPattyMesh();
    patty3Group.visible = customization.pattyCount >= 3;
    burgerMasterGroup.add(patty3Group);

    // 7. Onions
    const onionsGroup = new THREE.Group();
    if (customization.veggies.onion) {
      const onionMat = new THREE.MeshStandardMaterial({
        color: 0x9e3152,
        roughness: 0.38,
        transparent: true,
        opacity: 0.92
      });
      for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(0.55 + i * 0.35, 0.08, 16, 32);
        const ring = new THREE.Mesh(ringGeo, onionMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set((i - 1) * 0.4, 0, i % 2 === 0 ? 0.2 : -0.2);
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
        roughness: 0.22,
        metalness: 0.05
      });
      for (let i = 0; i < 2; i++) {
        const tGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.16, 32);
        const tMesh = new THREE.Mesh(tGeo, tomatoMat);
        tMesh.position.set(i === 0 ? -0.55 : 0.55, 0, i === 0 ? 0.2 : -0.2);
        tMesh.rotation.z = i === 0 ? 0.08 : -0.08;
        tMesh.castShadow = true;
        tomatoesGroup.add(tMesh);
      }
    }
    burgerMasterGroup.add(tomatoesGroup);

    // 9. Lettuce (Crisp wavy leaf)
    const lettuceGroup = new THREE.Group();
    if (customization.veggies.lettuce) {
      const lettuceMat = new THREE.MeshStandardMaterial({
        color: 0x469a2a,
        roughness: 0.58,
        side: THREE.DoubleSide
      });
      const lettuceGeo = new THREE.CylinderGeometry(1.88, 1.72, 0.13, 36);
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

    // Flat bottom cut of top bun with realistic toaster grill marks
    const topCutGeo = new THREE.CircleGeometry(1.6, 36);
    const topCutMesh = new THREE.Mesh(topCutGeo, bunInsideMat);
    topCutMesh.rotation.x = Math.PI / 2;
    topBunGroup.add(topCutMesh);

    // Sesame seeds if sesame bun selected
    if (customization.bun === "sesame") {
      const seedMat = new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.3 });
      const seedGeo = new THREE.ConeGeometry(0.04, 0.09, 8);
      for (let s = 0; s < 50; s++) {
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

    // 11. Subtle Sizzle Smoke / Heat Sparkles
    const particleCount = 28;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 2.2;
      particlePositions[p * 3 + 1] = Math.random() * 2.5;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 2.2;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffa066,
      size: 0.06,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const steamParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(steamParticles);

    // Store layer references
    layersGroupRef.current = {
      bottomBun: bottomBunGroup,
      patty1: patty1Group,
      cheese1: cheese1Group,
      sauceLayer1: sauceLayer1Group,
      patty2: patty2Group,
      cheese2: cheese2Group,
      sauceLayer2: sauceLayer2Group,
      patty3: patty3Group,
      onions: onionsGroup,
      tomatoes: tomatoesGroup,
      lettuce: lettuceGroup,
      topBun: topBunGroup,
      steamParticles
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
        rotationRef.current.y += 0.0025;
      }

      burgerMasterGroup.rotation.y = rotationRef.current.y;
      burgerMasterGroup.rotation.x = rotationRef.current.x;

      // Smooth camera interpolation towards active preset
      camera.position.lerp(cameraTargetRef.current, 0.06);
      camera.lookAt(cameraLookAtRef.current);

      // Calculate Target Y positions for each layer based on exploded status
      const exploded = isExploded;
      const pCount = customization.pattyCount;

      const targetBottom = exploded ? -1.8 : -0.7;
      const targetPatty1 = exploded ? -1.1 : -0.3;
      const targetCheese1 = exploded ? -0.7 : -0.05;
      const targetSauce1 = exploded ? -0.5 : 0.05;

      const targetPatty2 = exploded ? -0.1 : (pCount >= 2 ? 0.35 : -0.3);
      const targetCheese2 = exploded ? 0.35 : (pCount >= 2 ? 0.6 : -0.05);
      const targetSauce2 = exploded ? 0.55 : (pCount >= 2 ? 0.7 : -0.05);

      const targetPatty3 = exploded ? 0.9 : (pCount >= 3 ? 0.95 : -0.3);

      const targetOnions = exploded ? 1.45 : (pCount === 1 ? 0.25 : pCount === 2 ? 0.8 : 1.2);
      const targetTomatoes = exploded ? 1.95 : (pCount === 1 ? 0.5 : pCount === 2 ? 1.05 : 1.45);
      const targetLettuce = exploded ? 2.45 : (pCount === 1 ? 0.75 : pCount === 2 ? 1.3 : 1.7);
      const targetTop = exploded ? 3.15 : (pCount === 1 ? 1.1 : pCount === 2 ? 1.65 : 2.05);

      const lerpFactor = 0.085;
      if (bottomBunGroup) bottomBunGroup.position.y += (targetBottom - bottomBunGroup.position.y) * lerpFactor;
      if (patty1Group) patty1Group.position.y += (targetPatty1 - patty1Group.position.y) * lerpFactor;
      if (cheese1Group) cheese1Group.position.y += (targetCheese1 - cheese1Group.position.y) * lerpFactor;
      if (sauceLayer1Group) sauceLayer1Group.position.y += (targetSauce1 - sauceLayer1Group.position.y) * lerpFactor;

      if (patty2Group) patty2Group.position.y += (targetPatty2 - patty2Group.position.y) * lerpFactor;
      if (cheese2Group) cheese2Group.position.y += (targetCheese2 - cheese2Group.position.y) * lerpFactor;
      if (sauceLayer2Group) sauceLayer2Group.position.y += (targetSauce2 - sauceLayer2Group.position.y) * lerpFactor;

      if (patty3Group) patty3Group.position.y += (targetPatty3 - patty3Group.position.y) * lerpFactor;
      if (onionsGroup) onionsGroup.position.y += (targetOnions - onionsGroup.position.y) * lerpFactor;
      if (tomatoesGroup) tomatoesGroup.position.y += (targetTomatoes - tomatoesGroup.position.y) * lerpFactor;
      if (lettuceGroup) lettuceGroup.position.y += (targetLettuce - lettuceGroup.position.y) * lerpFactor;
      if (topBunGroup) topBunGroup.position.y += (targetTop - topBunGroup.position.y) * lerpFactor;

      // Animate gentle steam particle rise
      if (steamParticles) {
        const positions = steamParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += 0.008;
          if (positions[i] > 3.2) {
            positions[i] = -0.5;
          }
        }
        steamParticles.geometry.attributes.position.needsUpdate = true;
      }

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
