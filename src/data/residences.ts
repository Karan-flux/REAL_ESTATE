import { Residence } from '../types/property';

import imgBuildingDusk from '../assets/images/building_exterior_dusk_1790455449065.jpg';
import imgPenthouseGrand from '../assets/images/interior_penthouse_grand_1790455461607.jpg';
import imgMasterSuite from '../assets/images/interior_master_suite_1790455473519.jpg';
import imgChefKitchen from '../assets/images/interior_chef_kitchen_1790455485806.jpg';
import imgBuildingPlaza from '../assets/images/building_plaza_facade_1790455497075.jpg';
import imgSkyPool from '../assets/images/sky_infinity_pool_1790455975779.jpg';
import imgMasterBath from '../assets/images/luxury_master_bath_1790455991453.jpg';
import imgWineVault from '../assets/images/sommelier_wine_vault_1790456006937.jpg';

export { 
  imgBuildingDusk, 
  imgPenthouseGrand, 
  imgMasterSuite, 
  imgChefKitchen, 
  imgBuildingPlaza,
  imgSkyPool,
  imgMasterBath,
  imgWineVault
};

export const RESIDENCES: Residence[] = [
  {
    id: 'res-5201',
    title: 'The Apex Grand Penthouse',
    unitCode: 'Penthouse 52A',
    price: 18500000,
    priceFormatted: '$18,500,000',
    bedrooms: 5,
    bathrooms: 6.5,
    sizeSqFt: 6850,
    floor: 52,
    exposure: '360° Panoramic Skyline & Harbor',
    wing: 'Upper Crest',
    status: 'Available',
    tagline: 'Crown jewel of AURA with 14-foot ceilings, private heated sky pool, and wrap-around cantilevered terrace.',
    description: 'Commanding the uppermost full floor of the tower, The Apex Grand Penthouse represents the ultimate expression of vertical architecture. Featuring bespoke Italian travertine surfaces, bronze thermal acoustic glass envelopes, custom Bulthaup kitchen, private sommelier cellar, and unobstructed sunrise-to-sunset city panoramas.',
    primaryImage: imgPenthouseGrand,
    ceilingHeight: '14 ft / 4.27 m',
    hoaMonthly: '$4,120 / mo',
    features: [
      'Private High-Speed Keyed Elevator Foyer',
      '1,200 sq ft Cantilevered Heated Sky Terrace & Plunge Pool',
      'Dual Primary En-Suite Spas with Bookmatched Calacatta Marble',
      'Sub-Zero & Gaggenau 400 Series Chef Suite & Back Kitchen',
      'Custom Backlit Onyx Wine Tasting Salon (450 Bottles)',
      'Travertine & Patinated Bronze Double-Sided Hearth',
      'Automated Somfy Architectural Blackout & Solar Shading',
      'Dedicated Deeded Chauffeur Garage with High-Speed EV Superchargers'
    ],
    rooms: [
      {
        id: 'grand-living',
        name: 'Grand Reception Great Room',
        panoramaImage: imgPenthouseGrand,
        description: 'Double-height volume with floor-to-ceiling acoustic glass walls overlooking the glowing metropolis.',
        floorPlanCoords: { x: 50, y: 55 },
        hotspots: [
          {
            id: 'h1',
            label: 'Enter Gourmet Chef Suite',
            targetRoomId: 'chef-kitchen',
            pitch: -2,
            yaw: 110,
            description: 'Fluted dark oak cabinetry & Calacatta Oro marble island'
          },
          {
            id: 'h2',
            label: 'Walk to Master Oasis Suite',
            targetRoomId: 'master-suite',
            pitch: 3,
            yaw: 260,
            description: 'Private western wing with panoramic sunset outlook'
          },
          {
            id: 'h3',
            label: 'Step onto Cantilevered Sky Terrace',
            targetRoomId: 'sky-terrace',
            pitch: -6,
            yaw: 15,
            description: 'Heated open-air pavilion floating 600 ft above harbor'
          },
          {
            id: 'h-wine',
            label: 'Sommelier Wine Vault',
            targetRoomId: 'wine-vault',
            pitch: -1,
            yaw: 165,
            description: 'Backlit gold onyx tasting salon'
          }
        ]
      },
      {
        id: 'chef-kitchen',
        name: 'Gourmet Chef Kitchen & Scullery',
        panoramaImage: imgChefKitchen,
        description: 'Bespoke Calacatta Oro marble waterfall island with custom integrated Gaggenau 400 appliances and hidden prep scullery.',
        floorPlanCoords: { x: 75, y: 40 },
        hotspots: [
          {
            id: 'h4',
            label: 'Return to Grand Reception Room',
            targetRoomId: 'grand-living',
            pitch: 0,
            yaw: 195,
            description: 'Open sightlines back into the soaring reception salon'
          },
          {
            id: 'h5',
            label: 'Proceed to Master Bedroom',
            targetRoomId: 'master-suite',
            pitch: 2,
            yaw: 310,
            description: 'Private gallery hallway leading to sleeping quarters'
          },
          {
            id: 'h-kwine',
            label: 'Sommelier Wine Room',
            targetRoomId: 'wine-vault',
            pitch: 0,
            yaw: 80,
            description: 'Private tasting counter'
          }
        ]
      },
      {
        id: 'master-suite',
        name: 'Master Sanctuary Suite',
        panoramaImage: imgMasterSuite,
        description: 'Expansive private retreat featuring ambient cove lighting, custom Poliform closets, and skyline horizon.',
        floorPlanCoords: { x: 25, y: 40 },
        hotspots: [
          {
            id: 'h6',
            label: 'Return to Reception Salon',
            targetRoomId: 'grand-living',
            pitch: -1,
            yaw: 85,
            description: 'Connecting to main living quarters'
          },
          {
            id: 'h-bath',
            label: 'Ensuite Marble Spa Bath',
            targetRoomId: 'master-bath',
            pitch: 1,
            yaw: 330,
            description: 'Sculpted soaking tub overlooking harbor'
          },
          {
            id: 'h7',
            label: 'Inspect Chef Dining Suite',
            targetRoomId: 'chef-kitchen',
            pitch: 0,
            yaw: 140,
            description: 'Direct passage to dining salon'
          }
        ]
      },
      {
        id: 'master-bath',
        name: 'Ensuite Marble Spa Bath',
        panoramaImage: imgMasterBath,
        description: 'Sculptural freestanding soaking tub positioned at the corner glass curtain wall with Dornbracht brushed platinum hardware and radiant-heated travertine floors.',
        floorPlanCoords: { x: 15, y: 30 },
        hotspots: [
          {
            id: 'h-b1',
            label: 'Back to Master Bed Suite',
            targetRoomId: 'master-suite',
            pitch: 0,
            yaw: 160,
            description: 'Private master chamber'
          },
          {
            id: 'h-b2',
            label: 'Reception Great Room',
            targetRoomId: 'grand-living',
            pitch: 0,
            yaw: 90,
            description: 'Return to main salon'
          }
        ]
      },
      {
        id: 'sky-terrace',
        name: 'Cantilevered Sky Terrace & Pool',
        panoramaImage: imgSkyPool,
        description: 'Level 52 private cantilevered heated infinity pool suspended over harbor waters with uninterrupted skyline views.',
        floorPlanCoords: { x: 50, y: 15 },
        hotspots: [
          {
            id: 'h8',
            label: 'Step inside Grand Living Room',
            targetRoomId: 'grand-living',
            pitch: -5,
            yaw: 180,
            description: 'Motorized acoustic sliding glass portal'
          },
          {
            id: 'h-sp1',
            label: 'Master Suite Terrace Access',
            targetRoomId: 'master-suite',
            pitch: 0,
            yaw: 270,
            description: 'Direct bedroom door'
          }
        ]
      },
      {
        id: 'wine-vault',
        name: 'Sommelier Wine Tasting Vault',
        panoramaImage: imgWineVault,
        description: 'Climate-controlled private sommelier lounge finished in fluted American walnut, backlit golden onyx tasting bar, and UV-filtering glass enclosures.',
        floorPlanCoords: { x: 80, y: 65 },
        hotspots: [
          {
            id: 'h-w1',
            label: 'Return to Great Room',
            targetRoomId: 'grand-living',
            pitch: 0,
            yaw: 280,
            description: 'Enter main reception area'
          },
          {
            id: 'h-w2',
            label: 'Chef Kitchen',
            targetRoomId: 'chef-kitchen',
            pitch: 0,
            yaw: 40,
            description: 'Culinary preparation suite'
          }
        ]
      }
    ]
  },
  {
    id: 'res-4402',
    title: 'The Azure Waterfront Suite',
    unitCode: 'Residence 44B',
    price: 9250000,
    priceFormatted: '$9,250,000',
    bedrooms: 3,
    bathrooms: 3.5,
    sizeSqFt: 3420,
    floor: 44,
    exposure: 'North-East Marine Harbor',
    wing: 'Waterfront North',
    status: 'Available',
    tagline: 'Direct panoramic harbor views with dramatic 12-foot floor-to-ceiling glass and corner balcony.',
    description: 'Positioned in the prime northeast corner on level 44, this sprawling residence offers breathtaking maritime views from dawn till dusk. Open-concept dining merges with a sleek sculptured marble island, while all bedrooms enjoy en-suite luxury bathrooms and private climate zones.',
    primaryImage: imgChefKitchen,
    ceilingHeight: '12 ft / 3.65 m',
    hoaMonthly: '$2,380 / mo',
    features: [
      'Unobstructed Deep Harbor & Marina Panoramas',
      'Calacatta Honed Marble Waterfall Island',
      'Dornbracht Platinum Matte Fixtures Throughout',
      'Dual Zoned Wine Storage (140 bottle capacity)',
      'Acoustic Multi-Layer Triple-Glazed Facade'
    ],
    rooms: [
      {
        id: 'chef-kitchen',
        name: 'Kitchen & Dining Gallery',
        panoramaImage: imgChefKitchen,
        description: 'Sleek architectural lines, fluted millwork, and expansive harbor horizons.',
        floorPlanCoords: { x: 60, y: 50 },
        hotspots: [
          {
            id: 'h9',
            label: 'Explore Master Bed Suite',
            targetRoomId: 'master-suite',
            pitch: 1,
            yaw: 240,
            description: 'Harbor view master quarters'
          },
          {
            id: 'h10',
            label: 'View Reception Lounge',
            targetRoomId: 'grand-living',
            pitch: 0,
            yaw: 45,
            description: 'Spacious salon for entertaining'
          }
        ]
      },
      {
        id: 'master-suite',
        name: 'Waterfront Master Sanctuary',
        panoramaImage: imgMasterSuite,
        description: 'Quiet sanctuary with morning sunlight cascading across custom architectural surfaces.',
        floorPlanCoords: { x: 30, y: 35 },
        hotspots: [
          {
            id: 'h11',
            label: 'Return to Dining & Kitchen',
            targetRoomId: 'chef-kitchen',
            pitch: 0,
            yaw: 70,
            description: 'Direct entry to kitchen gallery'
          },
          {
            id: 'h-b3',
            label: 'Ensuite Spa Bathroom',
            targetRoomId: 'master-bath',
            pitch: 0,
            yaw: 310,
            description: 'Marble soaking tub'
          }
        ]
      },
      {
        id: 'master-bath',
        name: 'Ensuite Marble Spa Bath',
        panoramaImage: imgMasterBath,
        description: 'Freestanding soaking tub overlooking the marine yachts and morning harbor mist.',
        floorPlanCoords: { x: 20, y: 25 },
        hotspots: [
          {
            id: 'h-b4',
            label: 'Master Bedroom',
            targetRoomId: 'master-suite',
            pitch: 0,
            yaw: 140,
            description: 'Back to bedroom'
          }
        ]
      },
      {
        id: 'grand-living',
        name: 'Corner Reception Lounge',
        panoramaImage: imgPenthouseGrand,
        description: 'Dramatic corner windows framing both harbor waterways and vibrant city lights.',
        floorPlanCoords: { x: 70, y: 65 },
        hotspots: [
          {
            id: 'h12',
            label: 'Enter Kitchen Area',
            targetRoomId: 'chef-kitchen',
            pitch: 0,
            yaw: 280,
            description: 'Open transition to culinary center'
          }
        ]
      }
    ]
  },
  {
    id: 'res-3801',
    title: 'The Meridian Skyline Residence',
    unitCode: 'Residence 38A',
    price: 6750000,
    priceFormatted: '$6,750,000',
    bedrooms: 3,
    bathrooms: 3,
    sizeSqFt: 2840,
    floor: 38,
    exposure: 'South-West Sunset & Downtown',
    wing: 'Skyline South',
    status: 'Available',
    tagline: 'Spectacular sunset vantage point with custom millwork, library wall, and expansive primary suite.',
    description: 'Designed for effortless urban living, Residence 38A is bathed in warm golden afternoon light. It features custom Italian cabinetry, European white oak plank flooring in a custom smoked finish, motorized shades, and a deep architectural terrace overlooking the city skyline.',
    primaryImage: imgMasterSuite,
    ceilingHeight: '11.5 ft / 3.50 m',
    hoaMonthly: '$1,890 / mo',
    features: [
      'Sunset Downtown City View Corridor',
      'Wide-Plank European Smoked White Oak Flooring',
      'Integrated Sonos In-Ceiling Architectural Sound',
      'Lutron HomeWorks Homeworks QS Intelligent Lighting',
      'Full-Height Marble Vanity with Radiant Heated Floors'
    ],
    rooms: [
      {
        id: 'master-suite',
        name: 'Sunset Master Retreat',
        panoramaImage: imgMasterSuite,
        description: 'Warm neutral tones paired with panoramic metropolitan twilight views.',
        floorPlanCoords: { x: 40, y: 40 },
        hotspots: [
          {
            id: 'h13',
            label: 'View Living & Dining Space',
            targetRoomId: 'grand-living',
            pitch: 0,
            yaw: 130,
            description: 'Flow into central reception room'
          },
          {
            id: 'h14',
            label: 'Inspect Kitchen Lounge',
            targetRoomId: 'chef-kitchen',
            pitch: 2,
            yaw: 210,
            description: 'Modern open kitchen'
          }
        ]
      },
      {
        id: 'grand-living',
        name: 'Skyline Living Room',
        panoramaImage: imgPenthouseGrand,
        description: 'Vibrant city outlook with seamless connection to private covered loggia.',
        floorPlanCoords: { x: 65, y: 60 },
        hotspots: [
          {
            id: 'h15',
            label: 'Back to Master Suite',
            targetRoomId: 'master-suite',
            pitch: 0,
            yaw: 310,
            description: 'Private suite entry'
          }
        ]
      },
      {
        id: 'chef-kitchen',
        name: 'Entertaining Kitchen',
        panoramaImage: imgChefKitchen,
        description: 'Functional elegance equipped with Miele speed oven and marble island.',
        floorPlanCoords: { x: 55, y: 25 },
        hotspots: [
          {
            id: 'h16',
            label: 'Walk to Living Lounge',
            targetRoomId: 'grand-living',
            pitch: 0,
            yaw: 175,
            description: 'Direct living access'
          }
        ]
      }
    ]
  },
  {
    id: 'res-2603',
    title: 'The Solarium Corner Residence',
    unitCode: 'Residence 26C',
    price: 4890000,
    priceFormatted: '$4,890,000',
    bedrooms: 2,
    bathrooms: 2.5,
    sizeSqFt: 2180,
    floor: 26,
    exposure: 'North-West Mountain & Bay',
    wing: 'Waterfront North',
    status: 'Available',
    tagline: 'Double-aspect corner orientation capturing both natural bay waters and dramatic sunsets.',
    description: 'A masterpiece of spatial efficiency, Residence 26C offers an expansive great room wrapped in continuous curtain-wall glass. The primary bedroom features dual walk-in closets and a five-fixture ensuite bathroom wrapped in honed travertine.',
    primaryImage: imgBuildingPlaza,
    ceilingHeight: '11 ft / 3.35 m',
    hoaMonthly: '$1,520 / mo',
    features: [
      'Dual-Aspect Corner Living Room with Bay Outlook',
      'Private 180 sq ft Recessed Balcony',
      'En-Suite Bathrooms for Every Bedroom',
      'Custom Millwork Coat Vestibule & Laundry Room',
      'Floor-to-Ceiling Thermal Acoustic Double Glazing'
    ],
    rooms: [
      {
        id: 'grand-living',
        name: 'Bay View Corner Salon',
        panoramaImage: imgPenthouseGrand,
        description: 'Panoramic glass framing shimmering waters and urban architecture.',
        floorPlanCoords: { x: 55, y: 55 },
        hotspots: [
          {
            id: 'h17',
            label: 'View Open Kitchen',
            targetRoomId: 'chef-kitchen',
            pitch: 0,
            yaw: 120,
            description: 'Contemporary culinary bar'
          },
          {
            id: 'h18',
            label: 'Master Bedroom Suite',
            targetRoomId: 'master-suite',
            pitch: 0,
            yaw: 280,
            description: 'Private sleeping quarters'
          }
        ]
      },
      {
        id: 'chef-kitchen',
        name: 'Open Island Kitchen',
        panoramaImage: imgChefKitchen,
        description: 'Sculptured island and minimalist storage seamless with the living space.',
        floorPlanCoords: { x: 70, y: 35 },
        hotspots: [
          {
            id: 'h19',
            label: 'Living Room',
            targetRoomId: 'grand-living',
            pitch: 0,
            yaw: 240,
            description: 'Back to corner salon'
          }
        ]
      },
      {
        id: 'master-suite',
        name: 'Corner Master Suite',
        panoramaImage: imgMasterSuite,
        description: 'Serene sanctuary overlooking the western skyline.',
        floorPlanCoords: { x: 30, y: 40 },
        hotspots: [
          {
            id: 'h20',
            label: 'Living Room',
            targetRoomId: 'grand-living',
            pitch: 0,
            yaw: 90,
            description: 'Back to living room'
          }
        ]
      }
    ]
  },
  {
    id: 'res-1502',
    title: 'The Parkside Garden Terrace',
    unitCode: 'Residence 15B',
    price: 3450000,
    priceFormatted: '$3,450,000',
    bedrooms: 2,
    bathrooms: 2,
    sizeSqFt: 1820,
    floor: 15,
    exposure: 'South Park Plaza & Fountain',
    wing: 'Parkside Terrace',
    status: 'Reserved',
    tagline: 'Direct views of the botanical entry motor court and tranquil waterfront park tree canopies.',
    description: 'Positioned close to the lush landscaping of the podium, Residence 15B provides an intimate connection to the botanical garden grounds while maintaining total privacy and acoustic isolation behind high-performance facade glazing.',
    primaryImage: imgBuildingPlaza,
    ceilingHeight: '11 ft / 3.35 m',
    hoaMonthly: '$1,290 / mo',
    features: [
      'Landscaped Podium Level Terrace Access',
      'Overlooking Botanical Fountain & Water Mirror',
      'Custom Oak Woodwork and Integrated Bar',
      'Sub-Zero Refrigeration & Built-in Wine Column',
      'Direct Private Access to Tower Spa and Wellness Club'
    ],
    rooms: [
      {
        id: 'grand-living',
        name: 'Parkside Garden Salon',
        panoramaImage: imgPenthouseGrand,
        description: 'Intimate light-filled residence directly over the botanical courtyard.',
        floorPlanCoords: { x: 50, y: 50 },
        hotspots: [
          {
            id: 'h21',
            label: 'Kitchen & Bar',
            targetRoomId: 'chef-kitchen',
            pitch: 0,
            yaw: 135,
            description: 'Sleek culinary area'
          },
          {
            id: 'h22',
            label: 'Bedroom Chamber',
            targetRoomId: 'master-suite',
            pitch: 0,
            yaw: 290,
            description: 'Park view bedroom'
          }
        ]
      },
      {
        id: 'chef-kitchen',
        name: 'Culinary Bar',
        panoramaImage: imgChefKitchen,
        description: 'Integrated millwork and dining counter.',
        floorPlanCoords: { x: 65, y: 35 },
        hotspots: [
          {
            id: 'h23',
            label: 'Salon',
            targetRoomId: 'grand-living',
            pitch: 0,
            yaw: 220,
            description: 'Return to living space'
          }
        ]
      },
      {
        id: 'master-suite',
        name: 'Park View Suite',
        panoramaImage: imgMasterSuite,
        description: 'Lush tree canopy views through sound-dampened glass.',
        floorPlanCoords: { x: 30, y: 45 },
        hotspots: [
          {
            id: 'h24',
            label: 'Living Salon',
            targetRoomId: 'grand-living',
            pitch: 0,
            yaw: 80,
            description: 'Back to living room'
          }
        ]
      }
    ]
  },
  {
    id: 'res-0804',
    title: 'The Atelier Urban Loft',
    unitCode: 'Residence 08D',
    price: 2190000,
    priceFormatted: '$2,190,000',
    bedrooms: 1,
    bathrooms: 1.5,
    sizeSqFt: 1260,
    floor: 8,
    exposure: 'East Plaza & Morning Sun',
    wing: 'Parkside Terrace',
    status: 'Available',
    tagline: 'Sophisticated open-concept architectural pied-à-terre with double-height volume and private loggia.',
    description: 'An impeccably detailed one-bedroom retreat suited for the international traveler or design purist. Features customized Poliform system closets, high ceilings, automated solar drapery, and direct concierge elevator access.',
    primaryImage: imgChefKitchen,
    ceilingHeight: '11 ft / 3.35 m',
    hoaMonthly: '$980 / mo',
    features: [
      'Ideal Pied-à-Terre with 24/7 White-Glove Concierge',
      'Private 120 sq ft Recessed Loggia',
      'Marble Vanity & Oversized Rain Shower',
      'Integrated High-Speed Fiber & Smart Lighting',
      'Dedicated Valet Space and Private Storage Vault'
    ],
    rooms: [
      {
        id: 'chef-kitchen',
        name: 'Loft Kitchen & Dining',
        panoramaImage: imgChefKitchen,
        description: 'Open plan loft dining and entertaining lounge.',
        floorPlanCoords: { x: 50, y: 40 },
        hotspots: [
          {
            id: 'h25',
            label: 'Bedroom Chamber',
            targetRoomId: 'master-suite',
            pitch: 0,
            yaw: 270,
            description: 'Quiet sleeping alcove'
          }
        ]
      },
      {
        id: 'master-suite',
        name: 'Master Bed Alcove',
        panoramaImage: imgMasterSuite,
        description: 'Minimalist suite with motorized acoustic isolation curtains.',
        floorPlanCoords: { x: 35, y: 55 },
        hotspots: [
          {
            id: 'h26',
            label: 'Kitchen & Loft',
            targetRoomId: 'chef-kitchen',
            pitch: 0,
            yaw: 90,
            description: 'Return to loft kitchen'
          }
        ]
      }
    ]
  }
];

export const BUILDING_SPECS = {
  name: 'AURA Sky Residences',
  architect: 'Zaha & Foster Collaborative',
  interiorDesigner: 'Studio Liaigre & Piero Lissoni',
  landscapeArchitect: 'Enzo Enea Botanical Atelier',
  stories: 54,
  heightFt: 692,
  completionYear: 2026,
  address: '888 Harbor Crest Boulevard, Central Waterfront',
  totalResidences: 124,
  availableResidences: 28,
  amenities: [
    '50-Meter Infinity Sky Pool & Sunset Horizon Cabanas (Level 50)',
    'Thermal Roman Hammam, Cedar Sauna & Cryo Plunges (Level 49)',
    'Curated Sommelier Wine Reserve & Private Tasting Room (Level 51)',
    'Dolby Atmos Private Screening Cinema & Screening Salon (Podium)',
    'Rolls-Royce Spectre House Chauffeur Fleet & Private Yacht Slip Access',
    'Biometric Keyless Entry & 24/7 White-Glove Concierge by Quintessentially',
    'Private Helipad & Executive Boardroom Suites with Dedicated Attendant'
  ],
  advisors: [
    {
      name: 'Victoria Vance-Sinclair',
      role: 'Senior Managing Director, Private Estates',
      phone: '+1 (212) 890-4100',
      email: 'vvance@auraskyresidences.com',
      experience: '18 Years Prime Real Estate'
    },
    {
      name: 'Julian Montgomery',
      role: 'Principal Architectural Advisor',
      phone: '+1 (212) 890-4108',
      email: 'jmontgomery@auraskyresidences.com',
      experience: 'Architectural Digest Top 100 Partner'
    }
  ]
};

