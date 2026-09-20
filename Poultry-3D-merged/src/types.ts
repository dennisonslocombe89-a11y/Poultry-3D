export type ElementCategory = 
  | 'production'
  | 'waste-energy'
  | 'waste-fertiliser'
  | 'waste-feed'
  | 'farm-feed'
  | 'renewable-energy'
  | 'water'
  | 'flock-health'
  | 'value-chain'
  | 'knowledge';

export interface StationImage {
  url: string;
  thumbnailUrl?: string;
  caption: string;
  credit?: string;
  aspect?: string;
}

export interface CircularFlow {
  label: string;
  targetId: string;
  material: string;
  type: 'inflow' | 'outflow';
}

export interface WalkthroughStep {
  step: number;
  title: string;
  description: string;
}

export interface HotspotData {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  category: ElementCategory;
  colorHex: string;
  colorNum: number;
  position3D: { x: number; y: number; z: number };
  cameraFocus: { x: number; y: number; z: number; camX: number; camY: number; camZ: number };
  shortDesc: string;
  fullDesc: string;
  whyItMatters: string;
  inputs: string[];
  outputs: string[];
  keySpecs: { label: string; value: string }[];
  impactMetrics: { label: string; value: string; change?: string }[];
  grantAlignment: string; // e.g., "Activity A1: Demonstration Sites"
  walkthroughSteps: WalkthroughStep[];
  images: StationImage[];
}

export interface FlowConnection {
  fromId: string;
  toId: string;
  colorNum: number;
  colorHex: string;
  label: string;
  flowDescription: string;
  height: number;
  sway?: number;
}

export interface ProjectMetric {
  value: string;
  label: string;
  subtext?: string;
}
