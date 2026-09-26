import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Info, 
  Compass, 
  Navigation, 
  Calendar,
  Sparkles,
  ChevronRight,
  Eye,
  Ruler,
  Volume2,
  VolumeX,
  Glasses,
  Gem
} from 'lucide-react';
import { Residence, TourRoom, TourHotspot, MaterialHotspot } from '../types/property';

interface VirtualTour360ModalProps {
  residence: Residence;
  initialRoomId?: string;
  onClose: () => void;
  onBookTour: (residence: Residence) => void;
}

export const VirtualTour360Modal: React.FC<VirtualTour360ModalProps> = ({
  residence,
  initialRoomId,
  onClose,
  onBookTour
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeRoom, setActiveRoom] = useState<TourRoom>(() => {
    if (initialRoomId) {
      const match = residence.rooms.find(r => r.id === initialRoomId);
      if (match) return match;
    }
    return residence.rooms[0];
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showFloorplan, setShowFloorplan] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [vrSplitMode, setVrSplitMode] = useState(false);
  const [audioNarration, setAudioNarration] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState<MaterialHotspot | null>(null);
  const [zoomFov, setZoomFov] = useState(70);
  const [currentHeadingDeg, setCurrentHeadingDeg] = useState(0);

  // Default material hotspots for rooms if not explicitly defined
  const roomMaterials: { [key: string]: MaterialHotspot[] } = {
    'grand-living': [
      {
        id: 'mat-travertine',
        title: 'Italian Travertine Slab',
        material: 'Navona Classico Honed Travertine',
        provenance: 'Tivoli Quarries, Italy',
        pitch: -18,
        yaw: 40,
        specification: 'Large-format 120x240cm bookmatched radiant-heated slabs with acoustic underlayment dampening sound to NC-25 grade.'
      },
      {
        id: 'mat-glass',
        title: 'Thermal Acoustic Curtain Wall',
        material: 'Triple-Glazed Low-Iron Acoustic Glass',
        provenance: 'Schüco Custom Architectural, Germany',
        pitch: 5,
        yaw: 160,
        specification: 'Structural silicone glazed with UV-reflecting argon cavities offering 99.4% acoustic isolation and solar shielding.'
      }
    ],
    'chef-kitchen': [
      {
        id: 'mat-marble',
        title: 'Calacatta Oro Waterfall Island',
        material: 'Hand-Selected Calacatta Oro Marble',
        provenance: 'Carrara, Tuscany, Italy',
        pitch: -15,
        yaw: 130,
        specification: 'Monolithic 3.8-meter island with mitered waterfall edging and anti-stain nanotechnology sealing.'
      },
      {
        id: 'mat-appliances',
        title: 'Gaggenau 400 Series Suite',
        material: 'Solid Stainless Steel & Black Vitreous Glass',
        provenance: 'Lipsheim, France',
        pitch: 2,
        yaw: 220,
        specification: 'Induction cooktop with downdraft ventilation, dual combi-steam ovens, and 140-bottle sommelier wine reserve.'
      }
    ],
    'master-bath': [
      {
        id: 'mat-tub',
        title: 'Sculptural Marble Soaking Tub',
        material: 'Single-Block Carved Travertine',
        provenance: 'Pietrasanta Atelier, Italy',
        pitch: -12,
        yaw: 180,
        specification: 'Carved from an unbroken 4-ton block of natural travertine stone with floor-mounted Dornbracht platinum filler.'
      },
      {
        id: 'mat-fixtures',
        title: 'Dornbracht MEM Series',
        material: 'Brushed Platinum Solid Brass',
        provenance: 'Iserlohn, Germany',
        pitch: -2,
        yaw: 80,
        specification: 'Custom flow-regulated architectural fixtures with ceramic disc precision valving.'
      }
    ]
  };

  const currentRoomMaterials = roomMaterials[activeRoom.id] || [];

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader>(new THREE.TextureLoader());

  // Mouse & Touch Pan State
  const isUserInteractingRef = useRef(false);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const phiRef = useRef(0);
  const thetaRef = useRef(0);

  // Transition state
  const isTransitioningRef = useRef(false);
  const [isCrossFading, setIsCrossFading] = useState(false);

  // Audio Synthesis for walkthrough narration
  useEffect(() => {
    if (audioNarration && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${residence.title}, ${activeRoom.name}. ${activeRoom.description}. Ceiling height is ${residence.ceilingHeight}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 0.98;
      window.speechSynthesis.speak(utterance);
    } else if (!audioNarration && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [audioNarration, activeRoom.id, residence.title, residence.ceilingHeight]);

  // Change room with smooth fade
  const switchRoom = useCallback((targetRoom: TourRoom) => {
    if (targetRoom.id === activeRoom.id || isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setIsCrossFading(true);
    setActiveMaterial(null);

    textureLoaderRef.current.load(
      targetRoom.panoramaImage,
      (newTexture) => {
        newTexture.mapping = THREE.EquirectangularReflectionMapping;
        newTexture.colorSpace = THREE.SRGBColorSpace;
        
        setTimeout(() => {
          if (sphereMeshRef.current) {
            const material = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
            material.map?.dispose();
            material.map = newTexture;
            material.needsUpdate = true;
          }
          setActiveRoom(targetRoom);
          setIsCrossFading(false);
          isTransitioningRef.current = false;
        }, 300);
      },
      undefined,
      (err) => {
        console.error('Error loading panorama texture:', err);
        setIsCrossFading(false);
        isTransitioningRef.current = false;
      }
    );
  }, [activeRoom.id]);

  const handleHotspotClick = (hotspot: TourHotspot) => {
    const targetRoom = residence.rooms.find(r => r.id === hotspot.targetRoomId);
    if (targetRoom) {
      switchRoom(targetRoom);
    }
  };

  // Setup Three.js 360 panoramic sphere
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(zoomFov, width / height, 1, 1100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const texture = textureLoaderRef.current.load(activeRoom.panoramaImage);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide
    });

    const sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    const animate = (time: number) => {
      reqIdRef.current = requestAnimationFrame(animate);

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      if (autoRotate && !isUserInteractingRef.current) {
        lonRef.current += delta * 4.5;
      }

      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      phiRef.current = THREE.MathUtils.degToRad(90 - latRef.current);
      thetaRef.current = THREE.MathUtils.degToRad(lonRef.current);

      const x = 500 * Math.sin(phiRef.current) * Math.cos(thetaRef.current);
      const y = 500 * Math.cos(phiRef.current);
      const z = 500 * Math.sin(phiRef.current) * Math.sin(thetaRef.current);

      camera.lookAt(x, y, z);
      renderer.render(scene, camera);

      const normHeading = ((lonRef.current % 360) + 360) % 360;
      setCurrentHeadingDeg(normHeading);
    };

    reqIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);

  // Update FOV when zoom changes
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.fov = zoomFov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [zoomFov]);

  // Pointer drag controls
  const handlePointerDown = (e: React.PointerEvent) => {
    isUserInteractingRef.current = true;
    onPointerDownPointerXRef.current = e.clientX;
    onPointerDownPointerYRef.current = e.clientY;
    onPointerDownLonRef.current = lonRef.current;
    onPointerDownLatRef.current = latRef.current;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isUserInteractingRef.current) return;
    lonRef.current = (onPointerDownPointerXRef.current - e.clientX) * 0.15 + onPointerDownLonRef.current;
    latRef.current = (e.clientY - onPointerDownPointerYRef.current) * 0.15 + onPointerDownLatRef.current;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isUserInteractingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoomFov(prev => Math.max(35, Math.min(95, prev + e.deltaY * 0.05)));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        lonRef.current -= 5;
      } else if (e.key === 'ArrowRight') {
        lonRef.current += 5;
      } else if (e.key === 'ArrowUp') {
        latRef.current += 4;
      } else if (e.key === 'ArrowDown') {
        latRef.current -= 4;
      } else if (e.key === ' ') {
        e.preventDefault();
        setAutoRotate(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Calculate 2D screen positions for 3D hotspots
  const calculateHotspotScreenPosition = (pitch: number, yaw: number) => {
    if (!cameraRef.current || !containerRef.current) return null;

    const hPhi = THREE.MathUtils.degToRad(90 - pitch);
    const hTheta = THREE.MathUtils.degToRad(yaw);

    const pos = new THREE.Vector3(
      500 * Math.sin(hPhi) * Math.cos(hTheta),
      500 * Math.cos(hPhi),
      500 * Math.sin(hPhi) * Math.sin(hTheta)
    );

    pos.project(cameraRef.current);

    if (pos.z > 1) return null;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const x = (pos.x * 0.5 + 0.5) * width;
    const y = (-(pos.y * 0.5) + 0.5) * height;

    return { x, y };
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-0 md:p-6 animate-in fade-in duration-300">
      <div
        ref={containerRef}
        className="relative w-full h-full md:max-w-7xl md:h-[90vh] bg-[#070b13] md:rounded-3xl overflow-hidden border border-amber-500/20 shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col select-none"
      >
        {/* 360 WebGL Panoramic Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        />

        {/* Smooth Cross-Fade Overlay */}
        <div
          className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-300 z-20 ${
            isCrossFading ? 'opacity-90' : 'opacity-0'
          }`}
        />

        {/* Laser Architectural Measurement Lines (When Enabled) */}
        {showMeasurements && !cinemaMode && (
          <div className="absolute inset-0 pointer-events-none z-15 flex items-center justify-center">
            {/* Horizontal Width Guide */}
            <div className="w-[70%] border-t-2 border-dashed border-amber-400/70 relative flex items-center justify-center">
              <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono text-amber-300 border border-amber-500/30 shadow-lg">
                Room Clear Span: 38' 6" / 11.75m
              </span>
            </div>
            {/* Vertical Ceiling Guide */}
            <div className="absolute h-[65%] border-l-2 border-dashed border-cyan-400/70 flex items-center justify-center">
              <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono text-cyan-300 border border-cyan-500/30 shadow-lg translate-x-20">
                Acoustic Ceiling Height: {residence.ceilingHeight}
              </span>
            </div>
          </div>
        )}

        {/* Interactive Floating Hotspots in 360 Space (Hidden in cinemaMode) */}
        {!cinemaMode && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {/* 1. Room Transition Hotspots */}
            {activeRoom.hotspots.map((hotspot) => {
              const screenPos = calculateHotspotScreenPosition(hotspot.pitch, hotspot.yaw);
              if (!screenPos) return null;

              return (
                <div
                  key={hotspot.id}
                  style={{
                    transform: `translate(${screenPos.x}px, ${screenPos.y}px) translate(-50%, -50%)`,
                    position: 'absolute'
                  }}
                  className="pointer-events-auto"
                >
                  <button
                    onClick={() => handleHotspotClick(hotspot)}
                    className="group relative flex items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500/30 hotspot-pulse absolute" />
                    <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/50 transition-transform group-hover:scale-120">
                      <Navigation className="w-4 h-4 fill-slate-950 rotate-45" />
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2 bottom-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-black/95 backdrop-blur-md border border-amber-500/40 px-3.5 py-2 rounded-xl text-left shadow-2xl">
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                        <span>{hotspot.label}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      {hotspot.description && (
                        <p className="text-[11px] text-slate-300 mt-0.5 max-w-[200px] whitespace-normal">
                          {hotspot.description}
                        </p>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}

            {/* 2. Bespoke Material Craftsmanship Hotspots */}
            {currentRoomMaterials.map((mat) => {
              const screenPos = calculateHotspotScreenPosition(mat.pitch, mat.yaw);
              if (!screenPos) return null;

              return (
                <div
                  key={mat.id}
                  style={{
                    transform: `translate(${screenPos.x}px, ${screenPos.y}px) translate(-50%, -50%)`,
                    position: 'absolute'
                  }}
                  className="pointer-events-auto"
                >
                  <button
                    onClick={() => setActiveMaterial(mat)}
                    className="group relative flex items-center justify-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-400/20 absolute animate-ping" />
                    <div className="w-8 h-8 rounded-full bg-[#121c2d] border border-amber-400 text-amber-400 flex items-center justify-center shadow-lg transition-transform group-hover:scale-120 group-hover:bg-amber-400 group-hover:text-slate-950">
                      <Gem className="w-3.5 h-3.5" />
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2 bottom-11 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-[#0a101ce6] backdrop-blur-md border border-amber-400/40 px-3 py-1.5 rounded-lg text-left shadow-xl">
                      <span className="text-[10px] text-amber-400 font-mono uppercase block">{mat.title}</span>
                      <span className="text-xs text-white font-medium">{mat.material}</span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Material Specification Popup Card */}
        {activeMaterial && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 w-96 bg-[#0a101cf2] backdrop-blur-xl border border-amber-400/40 rounded-2xl p-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1">
                  <Gem className="w-3 h-3" /> Bespoke Material Dossier
                </span>
                <h4 className="text-lg font-display text-white font-medium mt-1">
                  {activeMaterial.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveMaterial(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 text-xs border-t border-white/10 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Material Grade:</span>
                <span className="text-white font-medium">{activeMaterial.material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provenance / Quarry:</span>
                <span className="text-amber-400 font-medium">{activeMaterial.provenance}</span>
              </div>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed pt-1">
                {activeMaterial.specification}
              </p>
            </div>
          </div>
        )}

        {/* Top Header Bar: Residence & Room Identity */}
        <div className={`absolute top-4 left-4 right-4 z-30 flex items-start justify-between gap-4 pointer-events-none transition-opacity duration-300 ${cinemaMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
          <div className="bg-[#0a101ce6] backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl pointer-events-auto max-w-md">
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-medium">
              <span className="font-semibold uppercase tracking-wider">360° Virtual Tour</span>
              <span>·</span>
              <span className="font-mono text-slate-300">{residence.unitCode}</span>
              <span>·</span>
              <span className="text-slate-400">FL {residence.floor}</span>
            </div>

            <h2 className="text-2xl font-display font-medium text-white mt-1">
              {activeRoom.name}
            </h2>

            <p className="text-xs text-slate-300 mt-1 line-clamp-1 leading-relaxed">
              {activeRoom.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => onBookTour(residence)}
              className="hidden sm:flex bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold px-4 py-2.5 rounded-xl items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Showing</span>
            </button>

            <button
              onClick={() => setCinemaMode(!cinemaMode)}
              title={cinemaMode ? 'Show HUD' : 'Cinema Clean View'}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                cinemaMode
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                  : 'bg-black/60 hover:bg-black/80 text-white border-white/10'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowMeasurements(!showMeasurements)}
              title="Laser Architectural Dimensions"
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                showMeasurements
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-black/60 hover:bg-black/80 text-white border-white/10'
              }`}
            >
              <Ruler className="w-4 h-4" />
            </button>

            <button
              onClick={() => setAudioNarration(!audioNarration)}
              title={audioNarration ? 'Mute Audio Walkthrough' : 'Listen to Audio Walkthrough'}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                audioNarration
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-black/60 hover:bg-black/80 text-white border-white/10'
              }`}
            >
              {audioNarration ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowRoomDetails(!showRoomDetails)}
              title="Room Specs"
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                showRoomDetails
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-black/60 hover:bg-black/80 text-white border-white/10'
              }`}
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              title="Exit Tour"
              className="p-2.5 rounded-xl bg-black/80 hover:bg-red-500/80 text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Floating Quick Controls: Zoom, Auto-Drift, Compass */}
        {!cinemaMode && (
          <div className="absolute right-4 top-24 z-30 flex flex-col items-center gap-2 pointer-events-auto">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2.5 rounded-xl flex flex-col items-center shadow-lg">
              <Compass
                className="w-5 h-5 text-amber-400 transition-transform duration-100"
                style={{ transform: `rotate(${-currentHeadingDeg}deg)` }}
              />
              <span className="text-[9px] font-mono text-slate-400 mt-1 tabular-nums">
                {Math.round(currentHeadingDeg)}°
              </span>
            </div>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pause 360° Drift' : 'Auto 360° Drift'}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                autoRotate
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-black/60 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            </button>

            <button
              onClick={() => setZoomFov(prev => Math.max(35, prev - 8))}
              title="Zoom In"
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => setZoomFov(prev => Math.min(95, prev + 8))}
              title="Zoom Out"
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Floorplan Minimap with Sight Cone in Bottom Right */}
        {showFloorplan && !cinemaMode && (
          <div className="absolute bottom-24 right-4 z-30 hidden sm:block pointer-events-auto">
            <div className="bg-[#0a101cf2] backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-xl w-52">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 font-mono uppercase tracking-wider">
                <span>Floorplan Radar</span>
                <span className="text-amber-400">Level {residence.floor}</span>
              </div>

              <div className="relative w-full h-32 bg-slate-900/90 rounded-xl border border-white/10 overflow-hidden p-2">
                <div className="absolute inset-2 border border-slate-700/60 rounded flex flex-col justify-between p-1">
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>NORTH BALCONY</span>
                    <span>CORNER SUITE</span>
                  </div>
                  <div className="flex justify-center text-[8px] text-slate-600 font-mono">
                    <span>KEYED FOYER</span>
                  </div>
                </div>

                {residence.rooms.map(room => {
                  const isActive = room.id === activeRoom.id;
                  const coords = room.floorPlanCoords || { x: 50, y: 50 };
                  return (
                    <button
                      key={room.id}
                      onClick={() => switchRoom(room)}
                      style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      title={room.name}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full transition-transform ${
                          isActive
                            ? 'bg-amber-400 ring-4 ring-amber-400/30 scale-125'
                            : 'bg-slate-500 hover:bg-white'
                        }`}
                      />

                      {isActive && (
                        <div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ transform: `rotate(${-currentHeadingDeg + 90}deg)` }}
                        >
                          <div
                            className="w-16 h-16 -ml-8 -mt-8 opacity-40"
                            style={{
                              background: 'conic-gradient(from 70deg, rgba(245,158,11,0.6) 0deg, rgba(245,158,11,0.6) 40deg, transparent 40deg)'
                            }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 text-[10px] text-slate-300 text-center flex items-center justify-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                <span>Current: {activeRoom.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Room Specifications Drawer */}
        {showRoomDetails && (
          <div className="absolute top-20 left-4 z-30 w-80 bg-[#0a101cf2] backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-semibold text-white">
              <span>Architectural Specifications</span>
              <button
                onClick={() => setShowRoomDetails(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Total Residence:</span>
                <span className="font-mono text-white font-medium">{residence.sizeSqFt.toLocaleString()} sq ft</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Ceiling Height:</span>
                <span className="font-mono text-white font-medium">{residence.ceilingHeight}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Glazing:</span>
                <span className="text-white">Triple-Pane Acoustic Glass</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Exposure:</span>
                <span className="text-amber-400">{residence.exposure}</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                  Room Finishes
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Italian Travertine flooring, custom Poliform millwork, integrated dimmable architectural LED cove channels, and motorized acoustic blackout shading.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Room Selector Carousel */}
        {!cinemaMode && (
          <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-center pointer-events-none">
            <div className="bg-[#0a101cf2] backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex items-center gap-2 overflow-x-auto max-w-full pointer-events-auto scrollbar-none">
              <span className="text-[11px] text-slate-400 px-2 font-mono uppercase tracking-wider shrink-0 hidden sm:inline">
                Spaces ({residence.rooms.length}):
              </span>

              {residence.rooms.map((room) => {
                const isCurrent = room.id === activeRoom.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => switchRoom(room)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/25 scale-[1.02]'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                    }`}
                  >
                    <img
                      src={room.panoramaImage}
                      alt={room.name}
                      className="w-7 h-7 rounded-lg object-cover border border-white/15"
                    />
                    <span>{room.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

