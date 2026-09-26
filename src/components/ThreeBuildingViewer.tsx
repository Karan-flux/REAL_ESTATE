import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Compass, 
  RotateCw, 
  Sun, 
  Moon, 
  Sunset, 
  Eye, 
  Layers, 
  Volume2, 
  VolumeX, 
  Grid3X3, 
  Sparkles,
  Camera,
  Play,
  Pause
} from 'lucide-react';
import { Residence } from '../types/property';
import { RESIDENCES } from '../data/residences';

interface ThreeBuildingViewerProps {
  onSelectResidenceForTour: (residence: Residence) => void;
  selectedResidenceId?: string;
  onSelectResidence?: (residence: Residence) => void;
}

type TimeOfDay = 'dusk' | 'day' | 'night';

interface FloorMarker {
  id: string;
  floor: number;
  label: string;
  residence?: Residence;
  yPos: number; // 3D Y coordinate
  tag: string;
}

export const ThreeBuildingViewer: React.FC<ThreeBuildingViewerProps> = ({
  onSelectResidenceForTour,
  selectedResidenceId,
  onSelectResidence
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Scene and camera refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const highlightRingRef = useRef<THREE.Mesh | null>(null);
  const skyPoolWaterRef = useRef<THREE.Mesh | null>(null);

  // Interaction controls state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  
  // Spherical camera coordinates (radius, theta, phi)
  const sphericalRef = useRef({
    radius: 46,
    theta: 0.85,
    phi: 1.15,
    target: new THREE.Vector3(0, 16, 0)
  });

  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('dusk');
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.2); // slow drone
  const [wireframeMode, setWireframeMode] = useState(false);
  const [activeUnit, setActiveUnit] = useState<Residence>(RESIDENCES[0]);
  const [viewPreset, setViewPreset] = useState<'street' | 'skyline' | 'penthouse' | 'overview'>('penthouse');
  const [isMuted, setIsMuted] = useState(true);
  const [markersScreenPositions, setMarkersScreenPositions] = useState<{ [key: string]: { x: number; y: number; visible: boolean } }>({});

  // Audio Context for subtle luxury atmospheric soundscape
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Markers definitions
  const floorMarkers: FloorMarker[] = [
    {
      id: 'res-5201',
      floor: 52,
      label: 'PH 52A',
      residence: RESIDENCES.find(r => r.id === 'res-5201'),
      yPos: 34.5,
      tag: '$18.5M · Crown Penthouse'
    },
    {
      id: 'sky-pool',
      floor: 50,
      label: 'Sky Pool',
      yPos: 32.5,
      tag: 'Infinity Pool & Cabanas'
    },
    {
      id: 'res-4402',
      floor: 44,
      label: 'Res 44B',
      residence: RESIDENCES.find(r => r.id === 'res-4402'),
      yPos: 27.5,
      tag: '$9.25M · Waterfront Suite'
    },
    {
      id: 'res-3801',
      floor: 38,
      label: 'Res 38A',
      residence: RESIDENCES.find(r => r.id === 'res-3801'),
      yPos: 22.8,
      tag: '$6.75M · Sunset Horizon'
    },
    {
      id: 'res-2603',
      floor: 26,
      label: 'Res 26C',
      residence: RESIDENCES.find(r => r.id === 'res-2603'),
      yPos: 16.5,
      tag: '$4.89M · Corner Salon'
    },
    {
      id: 'res-1502',
      floor: 15,
      label: 'Res 15B',
      residence: RESIDENCES.find(r => r.id === 'res-1502'),
      yPos: 10.0,
      tag: '$3.45M · Garden Terrace'
    }
  ];

  // Sync with prop when selectedResidenceId changes
  useEffect(() => {
    if (selectedResidenceId) {
      const found = RESIDENCES.find(r => r.id === selectedResidenceId);
      if (found) {
        setActiveUnit(found);
        focusOnUnitFloor(found.floor);
      }
    }
  }, [selectedResidenceId]);

  // Lighting references
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const pointLightsRef = useRef<THREE.PointLight[]>([]);

  // Function to glide camera to specific floor
  const focusOnUnitFloor = useCallback((floor: number) => {
    const targetY = (floor / 54) * 32 + 3;
    sphericalRef.current.target.y = targetY;
    
    if (highlightRingRef.current) {
      highlightRingRef.current.position.y = targetY;
      highlightRingRef.current.visible = true;
    }

    if (floor > 40) {
      sphericalRef.current.radius = 32;
      sphericalRef.current.phi = 1.0;
    } else if (floor > 20) {
      sphericalRef.current.radius = 38;
      sphericalRef.current.phi = 1.15;
    } else {
      sphericalRef.current.radius = 42;
      sphericalRef.current.phi = 1.3;
    }
  }, []);

  // Set view angle preset
  const applyViewPreset = (preset: 'street' | 'skyline' | 'penthouse' | 'overview') => {
    setViewPreset(preset);
    if (preset === 'street') {
      sphericalRef.current.target.set(0, 8, 0);
      sphericalRef.current.radius = 42;
      sphericalRef.current.phi = 1.45;
    } else if (preset === 'skyline') {
      sphericalRef.current.target.set(0, 18, 0);
      sphericalRef.current.radius = 45;
      sphericalRef.current.phi = 1.15;
    } else if (preset === 'penthouse') {
      sphericalRef.current.target.set(0, 32, 0);
      sphericalRef.current.radius = 29;
      sphericalRef.current.phi = 0.95;
    } else if (preset === 'overview') {
      sphericalRef.current.target.set(0, 16, 0);
      sphericalRef.current.radius = 58;
      sphericalRef.current.phi = 1.1;
    }
  };

  // Soundscape synthesized with Web Audio API (gentle luxury breeze + warm chime resonance)
  const toggleSound = () => {
    if (isMuted) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          // Pink/Brown noise generator for gentle high-altitude ocean breeze
          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99 * b0 + white * 0.05;
            b1 = 0.95 * b1 + white * 0.05;
            b2 = 0.85 * b2 + white * 0.05;
            output[i] = (b0 + b1 + b2) * 0.08;
          }

          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          // Lowpass filter for warm muted penthouse sound
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, ctx.currentTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gainNodeRef.current = gain;

          whiteNoise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          whiteNoise.start();
        } else {
          if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
          }
          if (gainNodeRef.current) {
            gainNodeRef.current.gain.setTargetAtTime(0.04, audioCtxRef.current.currentTime, 0.1);
          }
        }
        setIsMuted(false);
      } catch (e) {
        console.warn('Audio not available', e);
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.0, audioCtxRef.current.currentTime, 0.1);
      }
      setIsMuted(true);
    }
  };

  // Update lighting theme
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !hemiLightRef.current) return;

    if (timeOfDay === 'dusk') {
      sceneRef.current.background = new THREE.Color(0x0a101d);
      sceneRef.current.fog = new THREE.FogExp2(0x0a101d, 0.012);
      dirLightRef.current.color.setHex(0xffaa5e);
      dirLightRef.current.intensity = 2.4;
      hemiLightRef.current.color.setHex(0x3a5075);
      hemiLightRef.current.groundColor.setHex(0x131d2f);
      hemiLightRef.current.intensity = 1.0;
      pointLightsRef.current.forEach(p => { p.intensity = 1.8; p.color.setHex(0xffcb80); });
    } else if (timeOfDay === 'day') {
      sceneRef.current.background = new THREE.Color(0x142035);
      sceneRef.current.fog = new THREE.FogExp2(0x142035, 0.009);
      dirLightRef.current.color.setHex(0xffffff);
      dirLightRef.current.intensity = 3.4;
      hemiLightRef.current.color.setHex(0x9fc3f8);
      hemiLightRef.current.groundColor.setHex(0x283850);
      hemiLightRef.current.intensity = 1.5;
      pointLightsRef.current.forEach(p => { p.intensity = 0.5; p.color.setHex(0xffffff); });
    } else {
      // night
      sceneRef.current.background = new THREE.Color(0x04070e);
      sceneRef.current.fog = new THREE.FogExp2(0x04070e, 0.015);
      dirLightRef.current.color.setHex(0x3a4b6e);
      dirLightRef.current.intensity = 0.9;
      hemiLightRef.current.color.setHex(0x121e33);
      hemiLightRef.current.groundColor.setHex(0x050810);
      hemiLightRef.current.intensity = 0.7;
      pointLightsRef.current.forEach(p => { p.intensity = 2.8; p.color.setHex(0xffb74d); });
    }
  }, [timeOfDay]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a101d);
    scene.fog = new THREE.FogExp2(0x0a101d, 0.012);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 400);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 4. Lights
    const hemiLight = new THREE.HemisphereLight(0x3a5075, 0x131d2f, 1.0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xffaa5e, 2.4);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const fillLight = new THREE.DirectionalLight(0x42669e, 1.3);
    fillLight.position.set(-40, 30, -30);
    scene.add(fillLight);

    // 5. Build Architectural Skyscraper Geometry
    const buildingGroup = new THREE.Group();

    // High quality architectural materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x182436,
      metalness: 0.9,
      roughness: 0.12,
      transmission: 0.45,
      thickness: 1.4,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      ior: 1.54,
      wireframe: wireframeMode
    });

    const bronzeMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xb58e5f,
      metalness: 0.92,
      roughness: 0.28,
      wireframe: wireframeMode
    });

    const concreteDarkMaterial = new THREE.MeshStandardMaterial({
      color: 0x171d28,
      metalness: 0.2,
      roughness: 0.8
    });

    const warmInteriorLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcb80,
      wireframe: wireframeMode
    });

    // Tier 1: Podium & Entrance Plaza (Levels 1-8)
    const tier1Geo = new THREE.BoxGeometry(16.5, 6, 14.5);
    const tier1 = new THREE.Mesh(tier1Geo, glassMaterial);
    tier1.position.y = 3;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    buildingGroup.add(tier1);

    // Podium bronze columns & frames
    const columnGeo = new THREE.BoxGeometry(0.45, 6, 0.45);
    for (let x = -7.5; x <= 7.5; x += 2.5) {
      for (let z of [-7.1, 7.1]) {
        const col = new THREE.Mesh(columnGeo, bronzeMetalMaterial);
        col.position.set(x, 3, z);
        col.castShadow = true;
        buildingGroup.add(col);
      }
    }

    // Tier 2: Mid-Rise Tower Body (Levels 9-28)
    const tier2Geo = new THREE.BoxGeometry(13.2, 14, 11.2);
    const tier2 = new THREE.Mesh(tier2Geo, glassMaterial);
    tier2.position.y = 13;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    buildingGroup.add(tier2);

    // Balconies & Terraces on Tier 2
    for (let y = 7; y <= 19; y += 2.4) {
      const balconySlab = new THREE.Mesh(
        new THREE.BoxGeometry(13.8, 0.22, 11.8),
        bronzeMetalMaterial
      );
      balconySlab.position.y = y;
      buildingGroup.add(balconySlab);

      const floorSlice = new THREE.Mesh(
        new THREE.BoxGeometry(11.8, 0.12, 9.8),
        warmInteriorLightMaterial
      );
      floorSlice.position.y = y + 0.12;
      buildingGroup.add(floorSlice);
    }

    // Level 30 Sky Garden Cutout Atrium
    const skyGardenCutout = new THREE.Mesh(
      new THREE.BoxGeometry(11.2, 2.5, 9.5),
      bronzeMetalMaterial
    );
    skyGardenCutout.position.set(0, 20.2, 0);
    buildingGroup.add(skyGardenCutout);

    // Tier 3: Upper Skyline Tower (Levels 31-48)
    const tier3Geo = new THREE.BoxGeometry(10.6, 11.5, 9.2);
    const tier3 = new THREE.Mesh(tier3Geo, glassMaterial);
    tier3.position.y = 26.5;
    tier3.castShadow = true;
    tier3.receiveShadow = true;
    buildingGroup.add(tier3);

    for (let y = 21.5; y <= 31.5; y += 2.2) {
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(11.2, 0.2, 9.6),
        bronzeMetalMaterial
      );
      slab.position.y = y;
      buildingGroup.add(slab);

      const interiorGlow = new THREE.Mesh(
        new THREE.BoxGeometry(9.4, 0.1, 7.8),
        warmInteriorLightMaterial
      );
      interiorGlow.position.y = y + 0.1;
      buildingGroup.add(interiorGlow);
    }

    // Tier 4: Crown & Penthouse Pavilion (Levels 49-54)
    const tier4Geo = new THREE.BoxGeometry(8.2, 6, 7.2);
    const tier4 = new THREE.Mesh(tier4Geo, glassMaterial);
    tier4.position.y = 35.5;
    tier4.castShadow = true;
    tier4.receiveShadow = true;
    buildingGroup.add(tier4);

    // Cantilevered Grand Penthouse Terrace
    const penthouseTerrace = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.35, 9),
      bronzeMetalMaterial
    );
    penthouseTerrace.position.y = 34.5;
    buildingGroup.add(penthouseTerrace);

    // Level 50 Rooftop Infinity Sky Pool (Glowing Aqua Blue)
    const poolWaterGeo = new THREE.PlaneGeometry(5.5, 2.4);
    const poolWaterMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.88
    });
    const poolWater = new THREE.Mesh(poolWaterGeo, poolWaterMat);
    poolWater.rotation.x = -Math.PI / 2;
    poolWater.position.set(2, 34.7, 3);
    buildingGroup.add(poolWater);
    skyPoolWaterRef.current = poolWater;

    // Penthouse interior glowing lantern
    const penthouseGlow = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 4.8, 6.2),
      new THREE.MeshBasicMaterial({ color: 0xffe2a3, wireframe: wireframeMode })
    );
    penthouseGlow.position.y = 35.5;
    buildingGroup.add(penthouseGlow);

    // Architectural Crown Fins / Skyline Spire Structure
    const finGeo = new THREE.BoxGeometry(0.2, 5, 8);
    for (let x = -3.8; x <= 3.8; x += 1.9) {
      const fin = new THREE.Mesh(finGeo, bronzeMetalMaterial);
      fin.position.set(x, 40.5, 0);
      buildingGroup.add(fin);
    }

    // Beacon
    const beaconGeo = new THREE.CylinderGeometry(0.08, 0.3, 5, 8);
    const beacon = new THREE.Mesh(beaconGeo, bronzeMetalMaterial);
    beacon.position.y = 43;
    buildingGroup.add(beacon);

    // Point lights
    const crownPoint = new THREE.PointLight(0xffb74d, 2.0, 45);
    crownPoint.position.set(0, 37, 0);
    scene.add(crownPoint);
    pointLightsRef.current.push(crownPoint);

    const plazaPoint = new THREE.PointLight(0xffcb80, 1.6, 32);
    plazaPoint.position.set(0, 2, 8);
    scene.add(plazaPoint);
    pointLightsRef.current.push(plazaPoint);

    // Ground Plaza, Reflecting Pool & Promenade
    const groundGeo = new THREE.PlaneGeometry(140, 140);
    const ground = new THREE.Mesh(groundGeo, concreteDarkMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Water mirror reflecting pool
    const poolGeo = new THREE.PlaneGeometry(40, 20);
    const poolMaterial = new THREE.MeshStandardMaterial({
      color: 0x071320,
      metalness: 0.95,
      roughness: 0.06
    });
    const pool = new THREE.Mesh(poolGeo, poolMaterial);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, 0.05, 17);
    pool.receiveShadow = true;
    scene.add(pool);

    // Distant background city silhouette markers
    const cityMat = new THREE.MeshBasicMaterial({ color: 0x09121d });
    for (let i = 0; i < 16; i++) {
      const h = 10 + Math.random() * 25;
      const w = 4 + Math.random() * 6;
      const bGeo = new THREE.BoxGeometry(w, h, w);
      const bMesh = new THREE.Mesh(bGeo, cityMat);
      const angle = (i / 16) * Math.PI * 2;
      const dist = 65 + Math.random() * 20;
      bMesh.position.set(Math.cos(angle) * dist, h / 2, Math.sin(angle) * dist);
      scene.add(bMesh);
    }

    // Active floor highlight glowing ring
    const highlightGeo = new THREE.TorusGeometry(10.5, 0.18, 16, 64);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.9
    });
    const highlightRing = new THREE.Mesh(highlightGeo, highlightMat);
    highlightRing.rotation.x = Math.PI / 2;
    highlightRing.position.y = 35;
    scene.add(highlightRing);
    highlightRingRef.current = highlightRing;

    scene.add(buildingGroup);

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with smooth spherical camera orbit
    let lastTime = performance.now();

    const animate = (time: number) => {
      reqIdRef.current = requestAnimationFrame(animate);

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // Auto rotation when enabled and not dragging
      if (autoRotate && !isDraggingRef.current) {
        sphericalRef.current.theta += delta * rotationSpeed;
      }

      // Convert spherical coordinates to 3D Cartesian position
      const { radius, theta, phi, target } = sphericalRef.current;
      const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
      const y = target.y + radius * Math.cos(phi);
      const z = target.z + radius * Math.sin(phi) * Math.cos(theta);

      // Smooth camera position lerp
      camera.position.x += (x - camera.position.x) * 0.08;
      camera.position.y += (y - camera.position.y) * 0.08;
      camera.position.z += (z - camera.position.z) * 0.08;

      camera.lookAt(target);

      // Animate subtle water pulse
      if (skyPoolWaterRef.current) {
        (skyPoolWaterRef.current.material as THREE.MeshBasicMaterial).opacity = 0.75 + 0.15 * Math.sin(time * 0.003);
      }

      // Animate subtle glow pulse on highlight ring
      if (highlightRingRef.current) {
        const pulse = 1 + 0.04 * Math.sin(time * 0.004);
        highlightRingRef.current.scale.set(pulse, pulse, pulse);
      }

      // Calculate 2D Screen Positions for Floor Marker HUD Overlays
      if (containerRef.current) {
        const cWidth = containerRef.current.clientWidth;
        const cHeight = containerRef.current.clientHeight;
        const newPositions: { [key: string]: { x: number; y: number; visible: boolean } } = {};

        floorMarkers.forEach(marker => {
          // Marker placed on exterior edge of tower (x: 7.2)
          const mPos = new THREE.Vector3(7.2, marker.yPos, 0);
          mPos.project(camera);

          const isFacingCamera = mPos.z < 1;
          const sX = (mPos.x * 0.5 + 0.5) * cWidth;
          const sY = (-(mPos.y * 0.5) + 0.5) * cHeight;

          newPositions[marker.id] = {
            x: sX,
            y: sY,
            visible: isFacingCamera && sX > 20 && sX < cWidth - 20 && sY > 20 && sY < cHeight - 20
          };
        });

        setMarkersScreenPositions(newPositions);
      }

      renderer.render(scene, camera);
    };

    reqIdRef.current = requestAnimationFrame(animate);

    // Initial focus on Penthouse 52
    focusOnUnitFloor(52);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      renderer.dispose();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [wireframeMode, rotationSpeed]);

  // Mouse & Touch Orbit Interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

    sphericalRef.current.theta -= deltaX * 0.008;
    sphericalRef.current.phi = Math.max(
      0.3,
      Math.min(Math.PI / 2 - 0.05, sphericalRef.current.phi + deltaY * 0.008)
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(
      22,
      Math.min(75, sphericalRef.current.radius + e.deltaY * 0.04)
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[580px] md:h-[700px] rounded-3xl overflow-hidden bg-[#070b13] border border-amber-500/20 select-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      />

      {/* Floating 3D Interactive Hotspot Markers directly on building levels */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {floorMarkers.map((marker) => {
          const pos = markersScreenPositions[marker.id];
          if (!pos || !pos.visible) return null;

          const isCurrent = activeUnit.id === marker.id;

          return (
            <div
              key={marker.id}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`,
                position: 'absolute'
              }}
              className="pointer-events-auto"
            >
              <button
                onClick={() => {
                  focusOnUnitFloor(marker.floor);
                  if (marker.residence) {
                    setActiveUnit(marker.residence);
                    if (onSelectResidence) onSelectResidence(marker.residence);
                  }
                }}
                className="group relative flex items-center gap-1.5 focus:outline-none"
              >
                {/* Node pin */}
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'bg-amber-400 ring-4 ring-amber-400/30 scale-125'
                      : 'bg-white/80 group-hover:bg-amber-400 group-hover:scale-125'
                  }`}
                />

                {/* Floating Tag Card */}
                <div className="bg-[#0b121ee6] backdrop-blur-md border border-white/10 hover:border-amber-400/50 px-2.5 py-1 rounded-lg text-left shadow-xl transition-all duration-200 group-hover:scale-105 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-white">
                    <span className="text-amber-400 font-semibold">{marker.label}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-300">{marker.tag}</span>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Top Left HUD: Building Info & Active Residence Quick Spec */}
      <div className="absolute top-5 left-5 z-30 flex flex-col gap-2 max-w-sm pointer-events-none">
        <div className="bg-[#0a101ce6] backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between gap-3 text-xs text-amber-400 font-medium">
            <span className="flex items-center gap-1.5 tracking-widest uppercase text-[11px]">
              <Compass className="w-3.5 h-3.5" /> 3D Tower Inspection
            </span>
            <span className="text-slate-400 font-mono text-[10px]">54 Stories · 692 FT</span>
          </div>

          <h3 className="text-2xl font-display font-medium text-white mt-1.5 leading-snug">
            {activeUnit.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-300 mt-2 font-mono tabular-nums">
            <span className="text-amber-400 font-semibold">{activeUnit.unitCode}</span>
            <span>·</span>
            <span>Floor {activeUnit.floor}</span>
            <span>·</span>
            <span>{activeUnit.sizeSqFt.toLocaleString()} SQ FT</span>
            <span>·</span>
            <span className="text-white font-semibold">{activeUnit.priceFormatted}</span>
          </div>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {activeUnit.tagline}
          </p>

          <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              onClick={() => onSelectResidenceForTour(activeUnit)}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98] cursor-pointer"
            >
              <Eye className="w-4 h-4" /> Launch 360° Virtual Tour
            </button>
            {onSelectResidence && (
              <button
                onClick={() => onSelectResidence(activeUnit)}
                className="bg-white/10 hover:bg-white/15 text-white text-xs font-medium py-2.5 px-3.5 rounded-xl transition-colors border border-white/10 cursor-pointer"
              >
                Dossier
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Right HUD: Controls for Time, Vantage, Wireframe, Sound */}
      <div className="absolute top-5 right-5 z-30 flex flex-col items-end gap-2.5">
        {/* Time of Day Switcher */}
        <div className="bg-[#0a101ce6] backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-xl flex items-center gap-1">
          <button
            onClick={() => setTimeOfDay('day')}
            title="Architectural Daylight"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              timeOfDay === 'day'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Day</span>
          </button>
          <button
            onClick={() => setTimeOfDay('dusk')}
            title="Golden Hour Twilight"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              timeOfDay === 'dusk'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sunset className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dusk</span>
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            title="Metropolitan Midnight"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              timeOfDay === 'night'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Night</span>
          </button>

          {/* Sound Atmospheric Ambient Toggle */}
          <div className="w-[1px] h-5 bg-white/10 mx-1" />
          <button
            onClick={toggleSound}
            title={isMuted ? 'Listen to Penthouse Atmosphere' : 'Mute Atmosphere'}
            className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
              !isMuted ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* View Camera Presets & Architectural Wireframe */}
        <div className="bg-[#0a101ce6] backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-xl flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between px-2 pt-1 pb-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              Vantage
            </span>
            <button
              onClick={() => setWireframeMode(!wireframeMode)}
              title="Toggle Architectural Structural Wireframe"
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                wireframeMode ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-3 h-3" />
              <span>CAD</span>
            </button>
          </div>

          <button
            onClick={() => applyViewPreset('penthouse')}
            className={`px-3 py-1.5 rounded-xl text-left transition-colors flex items-center justify-between gap-3 cursor-pointer ${
              viewPreset === 'penthouse'
                ? 'bg-white/15 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Crown / Penthouse</span>
            <span className="text-[10px] font-mono text-amber-400">FL 52</span>
          </button>
          <button
            onClick={() => applyViewPreset('skyline')}
            className={`px-3 py-1.5 rounded-xl text-left transition-colors flex items-center justify-between gap-3 cursor-pointer ${
              viewPreset === 'skyline'
                ? 'bg-white/15 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Skyline Horizon</span>
            <span className="text-[10px] font-mono text-slate-400">FL 38</span>
          </button>
          <button
            onClick={() => applyViewPreset('street')}
            className={`px-3 py-1.5 rounded-xl text-left transition-colors flex items-center justify-between gap-3 cursor-pointer ${
              viewPreset === 'street'
                ? 'bg-white/15 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Plaza & Marina</span>
            <span className="text-[10px] font-mono text-slate-400">FL 8</span>
          </button>
        </div>
      </div>

      {/* Bottom Center: Floor Stack Selector Bar with Cinematic Orbit Controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-3xl">
        <div className="bg-[#0a101cf2] backdrop-blur-xl border border-white/10 p-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 px-2 text-xs text-slate-400 shrink-0 font-medium">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline font-mono uppercase text-[11px] tracking-wider">Level:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
            {RESIDENCES.map((res) => {
              const isCurrent = activeUnit.id === res.id;
              return (
                <button
                  key={res.id}
                  onClick={() => {
                    setActiveUnit(res);
                    focusOnUnitFloor(res.floor);
                    if (onSelectResidence) onSelectResidence(res);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all font-mono cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                >
                  <span className="text-[10px] opacity-75 font-sans mr-1">FL</span>
                  {res.floor} · {res.unitCode.replace('Residence ', 'Res ').replace('Penthouse ', 'PH ')}
                </button>
              );
            })}
          </div>

          {/* Cinematic Auto-Rotate & Speed Toggle */}
          <div className="flex items-center gap-1 shrink-0 pl-1 border-l border-white/10">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pause 360° Drone Orbit' : 'Resume 360° Drone Orbit'}
              className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                autoRotate
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Left Subtle Instruction Pill */}
      <div className="absolute bottom-5 left-5 hidden lg:flex items-center gap-2 text-[11px] text-slate-400 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 pointer-events-none font-mono">
        <Camera className="w-3.5 h-3.5 text-amber-400" />
        <span>Click & Drag to Orbit 360° · Click floating pins to inspect floors</span>
      </div>
    </div>
  );
};

