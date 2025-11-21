import { LevelData, LevelProgress } from '../types';

/**
 * Creates initial empty progress for a level
 */
const createEmptyProgress = (): LevelProgress => ({
  normalMode: {
    wumpa40: false,
    wumpa60: false,
    wumpa80: false,
    allCrates: false,
    deaths3OrLess: false,
    hiddenGem: false,
  },
  nVertedMode: {
    wumpa40: false,
    wumpa60: false,
    wumpa80: false,
    allCrates: false,
    deaths3OrLess: false,
    hiddenGem: false,
  },
  platinumTimeTrial: {
    completed: false,
    attempts: 0,
  },
  nsanelyPerfectRelic: {
    completed: false,
    attempts: 0,
  },
});

/**
 * All 38 levels in Crash Bandicoot 4, organized by dimension
 */
export const INITIAL_LEVELS: LevelData[] = [
  // N. Sanity Island
  {
    id: 'rude-awakening',
    name: 'Rude Awakening',
    dimension: 'N. Sanity Island',
    progress: createEmptyProgress(),
  },
  {
    id: 'nsanity-peak',
    name: 'N.Sanity Peak',
    dimension: 'N. Sanity Island',
    progress: createEmptyProgress(),
  },

  // The Hazardous Wastes
  {
    id: 'a-real-grind',
    name: 'A Real Grind',
    dimension: 'The Hazardous Wastes',
    progress: createEmptyProgress(),
  },
  {
    id: 'crash-compactor',
    name: 'Crash Compactor',
    dimension: 'The Hazardous Wastes',
    progress: createEmptyProgress(),
  },
  {
    id: 'hit-the-road',
    name: 'Hit The Road',
    dimension: 'The Hazardous Wastes',
    progress: createEmptyProgress(),
  },
  {
    id: 'truck-stopped',
    name: 'Truck Stopped',
    dimension: 'The Hazardous Wastes',
    progress: createEmptyProgress(),
  },

  // Salty Wharf
  {
    id: 'booty-calls',
    name: 'Booty Calls',
    dimension: 'Salty Wharf',
    progress: createEmptyProgress(),
  },
  {
    id: 'thar-he-blows',
    name: 'Thar He Blows!',
    dimension: 'Salty Wharf',
    progress: createEmptyProgress(),
  },
  {
    id: 'hook-line-and-sinker',
    name: 'Hook Line And Sinker',
    dimension: 'Salty Wharf',
    progress: createEmptyProgress(),
  },
  {
    id: 'jetboard-jetty',
    name: 'Jetboard Jetty',
    dimension: 'Salty Wharf',
    progress: createEmptyProgress(),
  },

  // Tranquility Falls
  {
    id: 'give-it-a-spin',
    name: 'Give It a Spin',
    dimension: 'Tranquility Falls',
    progress: createEmptyProgress(),
  },
  {
    id: 'potion-commotion',
    name: 'Potion Commotion',
    dimension: 'Tranquility Falls',
    progress: createEmptyProgress(),
  },
  {
    id: 'draggin-on',
    name: "Draggin' On",
    dimension: 'Tranquility Falls',
    progress: createEmptyProgress(),
  },
  {
    id: 'off-balance',
    name: 'Off-Balance',
    dimension: 'Tranquility Falls',
    progress: createEmptyProgress(),
  },

  // Mosquito Marsh
  {
    id: 'off-beat',
    name: 'Off Beat',
    dimension: 'Mosquito Marsh',
    progress: createEmptyProgress(),
  },
  {
    id: 'home-cookin',
    name: "Home Cookin'",
    dimension: 'Mosquito Marsh',
    progress: createEmptyProgress(),
  },
  {
    id: 'run-it-bayou',
    name: 'Run It Bayou',
    dimension: 'Mosquito Marsh',
    progress: createEmptyProgress(),
  },
  {
    id: 'no-dillo-dallying',
    name: 'No Dillo Dallying',
    dimension: 'Mosquito Marsh',
    progress: createEmptyProgress(),
  },

  // The 11th Dimension
  {
    id: 'snow-way-out',
    name: 'Snow Way Out',
    dimension: 'The 11th Dimension',
    progress: createEmptyProgress(),
  },
  {
    id: 'ship-happens',
    name: 'Ship Happens',
    dimension: 'The 11th Dimension',
    progress: createEmptyProgress(),
  },
  {
    id: 'stay-frosty',
    name: 'Stay Frosty',
    dimension: 'The 11th Dimension',
    progress: createEmptyProgress(),
  },
  {
    id: 'bears-repeating',
    name: 'Bears Repeating',
    dimension: 'The 11th Dimension',
    progress: createEmptyProgress(),
  },
  {
    id: 'building-bridges',
    name: 'Building Bridges',
    dimension: 'The 11th Dimension',
    progress: createEmptyProgress(),
  },

  // Eggipus Dimension
  {
    id: 'blast-to-the-past',
    name: 'Blast To The Past',
    dimension: 'Eggipus Dimension',
    progress: createEmptyProgress(),
  },
  {
    id: 'fossil-fueled',
    name: 'Fossil Fueled',
    dimension: 'Eggipus Dimension',
    progress: createEmptyProgress(),
  },
  {
    id: 'dino-dash',
    name: 'Dino Dash',
    dimension: 'Eggipus Dimension',
    progress: createEmptyProgress(),
  },
  {
    id: 'rock-blocked',
    name: 'Rock Blocked',
    dimension: 'Eggipus Dimension',
    progress: createEmptyProgress(),
  },

  // Bermugula's Orbit
  {
    id: 'out-for-launch',
    name: 'Out For Launch',
    dimension: "Bermugula's Orbit",
    progress: createEmptyProgress(),
  },
  {
    id: 'shipping-error',
    name: 'Shipping Error',
    dimension: "Bermugula's Orbit",
    progress: createEmptyProgress(),
  },
  {
    id: 'stowing-away',
    name: 'Stowing Away',
    dimension: "Bermugula's Orbit",
    progress: createEmptyProgress(),
  },
  {
    id: 'crash-landed',
    name: 'Crash Landed',
    dimension: "Bermugula's Orbit",
    progress: createEmptyProgress(),
  },

  // The Sn@xx Dimension
  {
    id: 'food-run',
    name: 'Food Run',
    dimension: 'The Sn@xx Dimension',
    progress: createEmptyProgress(),
  },
  {
    id: 'rush-hour',
    name: 'Rush Hour',
    dimension: 'The Sn@xx Dimension',
    progress: createEmptyProgress(),
  },
  {
    id: 'the-crate-escape',
    name: 'The Crate Escape',
    dimension: 'The Sn@xx Dimension',
    progress: createEmptyProgress(),
  },

  // Cortex Island
  {
    id: 'nitro-processing',
    name: 'Nitro Processing',
    dimension: 'Cortex Island',
    progress: createEmptyProgress(),
  },
  {
    id: 'toxic-tunnels',
    name: 'Toxic Tunnels',
    dimension: 'Cortex Island',
    progress: createEmptyProgress(),
  },
  {
    id: 'cortex-castle',
    name: 'Cortex Castle',
    dimension: 'Cortex Island',
    progress: createEmptyProgress(),
  },
  {
    id: 'seeing-double',
    name: 'Seeing Double',
    dimension: 'Cortex Island',
    progress: createEmptyProgress(),
  },
];

/**
 * Get unique dimensions in order
 */
export const DIMENSIONS = [
  'N. Sanity Island',
  'The Hazardous Wastes',
  'Salty Wharf',
  'Tranquility Falls',
  'Mosquito Marsh',
  'The 11th Dimension',
  'Eggipus Dimension',
  "Bermugula's Orbit",
  'The Sn@xx Dimension',
  'Cortex Island',
];

/**
 * Get levels for a specific dimension
 */
export const getLevelsByDimension = (
  levels: LevelData[],
  dimension: string,
): LevelData[] => {
  return levels.filter(level => level.dimension === dimension);
};
