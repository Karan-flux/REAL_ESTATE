export interface MaterialHotspot {
  id: string;
  title: string;
  material: string;
  provenance: string;
  pitch: number;
  yaw: number;
  specification: string;
}

export interface TourHotspot {
  id: string;
  label: string;
  targetRoomId: string;
  pitch: number; // -85 to 85 vertical angle
  yaw: number;   // 0 to 360 horizontal angle
  description?: string;
}

export interface TourRoom {
  id: string;
  name: string;
  panoramaImage: string;
  description: string;
  hotspots: TourHotspot[];
  materialHotspots?: MaterialHotspot[];
  floorPlanCoords?: { x: number; y: number }; // percentage on floorplan
  dimensions?: { imperial: string; metric: string };
}

export interface Residence {
  id: string;
  title: string;
  unitCode: string;
  price: number;
  priceFormatted: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqFt: number;
  floor: number;
  exposure: string;
  wing: 'Waterfront North' | 'Skyline South' | 'Upper Crest' | 'Parkside Terrace';
  status: 'Available' | 'Reserved' | 'Showcase';
  tagline: string;
  description: string;
  primaryImage: string;
  features: string[];
  ceilingHeight: string;
  hoaMonthly: string;
  rooms: TourRoom[];
}

export interface FilterState {
  searchQuery: string;
  priceMin: number;
  priceMax: number;
  bedrooms: string; // 'all' | '1' | '2' | '3' | '4+'
  wing: string;     // 'all' | 'Waterfront North' | ...
  minSize: number;
  sortBy: 'price-asc' | 'price-desc' | 'size-desc' | 'floor-desc';
}
