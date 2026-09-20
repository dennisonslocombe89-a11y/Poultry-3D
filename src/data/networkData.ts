/**
 * Schematic network of the EUCaN action across Grenada, Carriacou and Petite Martinique.
 * Island outlines use Natural Earth 1:10m coastline geometry. The sea gap to Carriacou is
 * shortened to keep the complete network legible in one panel, so the display is not to scale.
 * Every site position is ILLUSTRATIVE until GCLL confirms locations; counts and roles come from
 * grant contract 700001756-01-04, Annex I (page references are to the signed contract PDF).
 */

export type NetLayer = 'value' | 'learning' | 'partners';
export type NetNodeType = 'hq' | 'coop' | 'farm' | 'school' | 'outreach' | 'hub' | 'buyer' | 'inst' | 'partner';

export interface NetNode {
  id: string;
  type: NetNodeType;
  ll?: [number, number];
  pos?: { x: number; y: number };
  color: string;
  layers: NetLayer[];
  title: string;
  tag: string;
  activity: string;
  illustrative: boolean;
  label?: string;
  side?: 'left' | 'right';
  desc: string;
  role: string;
  connects: string;
  source: string;
  parent?: string;
  stationId?: string;
}

export interface NetLink {
  a: string;
  b: string;
  layers: NetLayer[];
  kind: 'value' | 'learning' | 'partner' | 'study';
  curv: number;
  label?: string;
}

export const NET_VIEWBOX = { w: 860, h: 720 };
const NET = { lon0: -61.86, lat0: 12.42, kx: 1280, ky: 1300, ox: 110, oy: 95, gap: 0.13 };

export const netProj = (ll: [number, number]) => {
  const lat = ll[1] > 12.3 ? ll[1] - NET.gap : ll[1];
  return { x: NET.ox + (ll[0] - NET.lon0) * NET.kx, y: NET.oy + (NET.lat0 - lat) * NET.ky };
};

export const NET_ISLANDS: { name: string; label: [number, number]; anchor: 'middle' | 'end'; big?: boolean; pts: [number, number][] }[] = [
  { name: 'GRENADA', label: [-61.680, 12.135], anchor: 'middle', big: true, pts: [[-61.612945,12.214423],[-61.606679,12.220282],[-61.606028,12.223375],[-61.627675,12.236721],[-61.650502,12.239732],[-61.671457,12.236070],[-61.729644,12.166653],[-61.730295,12.149319],[-61.751047,12.110093],[-61.756418,12.087836],[-61.753774,12.074164],[-61.748850,12.062649],[-61.745961,12.050930],[-61.749501,12.036322],[-61.755849,12.030260],[-61.790517,12.008368],[-61.775543,12.004340],[-61.756947,12.003404],[-61.739980,12.006903],[-61.729644,12.015815],[-61.721750,12.011054],[-61.713246,12.007270],[-61.704254,12.004543],[-61.694936,12.002834],[-61.693430,12.012274],[-61.689361,12.019761],[-61.682973,12.025377],[-61.674428,12.029486],[-61.674428,12.022040],[-61.631581,12.044094],[-61.626047,12.053046],[-61.625722,12.061225],[-61.624501,12.069037],[-61.621571,12.074937],[-61.616363,12.077297],[-61.613840,12.080390],[-61.619456,12.096747],[-61.619781,12.104560],[-61.613108,12.119859],[-61.608713,12.126776],[-61.606313,12.133775],[-61.602773,12.182929],[-61.604563,12.197455],[-61.612945,12.214423]] },
  { name: 'CARRIACOU', label: [-61.460, 12.430], anchor: 'middle', pts: [[-61.428049,12.454657],[-61.427398,12.475409],[-61.423329,12.495185],[-61.421620,12.513373],[-61.428049,12.529731],[-61.443471,12.516547],[-61.454335,12.492825],[-61.467275,12.475572],[-61.488881,12.482001],[-61.494781,12.472317],[-61.496246,12.468329],[-61.485748,12.468817],[-61.482655,12.468329],[-61.486073,12.462226],[-61.492787,12.446479],[-61.496246,12.440375],[-61.479237,12.446723],[-61.462554,12.455146],[-61.445668,12.459784],[-61.428049,12.454657]] },
  { name: 'PETITE MARTINIQUE', label: [-61.352, 12.565], anchor: 'end', pts: [[-61.397043,12.512763],[-61.398590,12.517808],[-61.383860,12.520209],[-61.388010,12.508368],[-61.392690,12.509589],[-61.397043,12.512763]] },
];

export const NET_PARISHES: [string, [number, number]][] = [
  ['ST PATRICK', [-61.668, 12.212]], ['ST MARK', [-61.727, 12.192]], ['ST JOHN', [-61.722, 12.152]],
  ['ST ANDREW', [-61.632, 12.135]], ['ST GEORGE', [-61.712, 12.062]], ['ST DAVID', [-61.658, 12.012]],
];

const ILLUS = ' Map position is illustrative until GCLL confirms locations.';
const LEAF = '#8bbf6f', TEAL = '#4fa697', AMBER = '#d98a3d', CREAM = '#f1ecda', GOLD = '#e3a93a', VIOLET = '#8f7fd1', SKY = '#7fb2d6';

export const NET_NODES: NetNode[] = [];

NET_NODES.push({
  id: 'gcll', type: 'hq', ll: [-61.742, 12.070], color: GOLD, layers: ['learning', 'partners'], stationId: 'training',
  title: 'GCLL — national knowledge hub', tag: 'Implementer', activity: 'all activities', illustrative: true, label: 'GCLL (Belmont)', side: 'left',
  desc: 'Grenada Co-operative League Ltd., Belmont, St George, runs the action. It organises the trainings, coaching visits and the study visit, and keeps the knowledge afterwards as the cooperative sector’s national hub.' + ILLUS,
  role: 'Grant implementer and national knowledge hub',
  connects: '3 cooperatives, 15 installation sites, institutional partners, the Panama host cooperative, regional partners',
  source: 'Contract page 1 and Annex I, Activity A2 (study visit)',
});

[
  { id: 'coop1', ll: [-61.660, 12.160] as [number, number], n: 1 },
  { id: 'coop2', ll: [-61.690, 12.030] as [number, number], n: 2 },
  { id: 'coop3', ll: [-61.455, 12.480] as [number, number], n: 3 },
].forEach((c) => NET_NODES.push({
  id: c.id, type: 'coop', ll: c.ll, color: LEAF, layers: ['value', 'learning', 'partners'], stationId: 'poultry',
  title: `Participating cooperative ${c.n}`, tag: 'Cooperative', activity: 'A1', illustrative: true, label: `Cooperative ${c.n}`, side: 'right',
  desc: 'One of three existing registered cooperatives strengthened by the action — no new cooperatives are created. They are chosen through an open expression of interest against transparent criteria, including geographic representation across Grenada, Carriacou and Petite Martinique. Name and location are placeholders.' + ILLUS,
  role: 'Primary implementation partner; hosts member-farm installations',
  connects: 'Its member farms, the processing hub, nearby schools, neighbouring smallholders, GCLL',
  source: 'Contract Annex I, Activity A1 Steps 1–2 (pp. 26–27)',
}));

const farmDefs: { ll: [number, number]; c: string }[] = [
  { ll: [-61.665, 12.195], c: 'coop1' }, { ll: [-61.630, 12.140], c: 'coop1' }, { ll: [-61.715, 12.150], c: 'coop1' },
  { ll: [-61.650, 12.088], c: 'coop2' }, { ll: [-61.665, 12.010], c: 'coop2' }, { ll: [-61.740, 12.010], c: 'coop2' },
  { ll: [-61.470, 12.505], c: 'coop3' }, { ll: [-61.435, 12.470], c: 'coop3' }, { ll: [-61.450, 12.440], c: 'coop3' },
  { ll: [-61.380, 12.520], c: 'coop3' },
];
farmDefs.forEach((f, i) => NET_NODES.push({
  id: `farm${i + 1}`, type: 'farm', ll: f.ll, color: TEAL, layers: ['value', 'learning'], parent: f.c, stationId: 'poultry',
  title: `Demonstration farm ${i + 1} of 10`, tag: 'Farm installation', activity: 'A1', illustrative: true,
  desc: 'One of 10 installations at farms run by members of the participating cooperatives. Each gets a site-specific package — for example biogas, Black Soldier Fly unit, composting, organic fertiliser, cassava feed demonstration, solar where feasible. Not every site gets the same equipment. The distribution across islands is not fixed.' + ILLUS,
  role: 'Demonstration and peer-learning site',
  connects: 'Its parent cooperative, the processing hub, neighbouring smallholders',
  source: 'Contract Annex I, Activity A1 Steps 2–3 (pp. 26, 28)',
}));

const schoolDefs: { ll: [number, number]; c: string }[] = [
  { ll: [-61.700, 12.185], c: 'coop1' }, { ll: [-61.615, 12.110], c: 'coop1' }, { ll: [-61.655, 12.040], c: 'coop2' },
  { ll: [-61.625, 12.020], c: 'coop2' }, { ll: [-61.487, 12.470], c: 'coop3' },
];
schoolDefs.forEach((s, i) => NET_NODES.push({
  id: `school${i + 1}`, type: 'school', ll: s.ll, color: AMBER, layers: ['learning'], parent: s.c, stationId: 'school',
  title: `School installation ${i + 1} of 5`, tag: 'School installation', activity: 'A1 · A2', illustrative: true,
  desc: 'One of five installations planned at selected secondary schools that already run poultry programmes. They add hands-on learning for students and act as community training and knowledge-sharing centres. Schools are not yet named.' + ILLUS,
  role: 'Student learning and community knowledge-sharing centre',
  connects: 'Nearby cooperative, GCLL trainers, neighbouring farmers',
  source: 'Contract Annex I, Activity A1 (p. 26) and A2 (p. 31)',
}));

[
  { id: 'out1', ll: [-61.618, 12.190] as [number, number], c: 'coop1', n: 1 },
  { id: 'out2', ll: [-61.632, 12.068] as [number, number], c: 'coop2', n: 2 },
  { id: 'out3', ll: [-61.464, 12.436] as [number, number], c: 'coop3', n: 3 },
].forEach((o) => NET_NODES.push({
  id: o.id, type: 'outreach', ll: o.ll, color: CREAM, layers: ['value', 'learning'], parent: o.c,
  title: `Neighbouring smallholder farms (area ${o.n})`, tag: 'Replication', activity: 'A2', illustrative: true, label: 'Smallholders', side: 'right',
  desc: 'The wider group of smallholder poultry farmers — about 120 people in the target, including 48 women and 24 young people (18–35) — who learn from the demonstration sites through trainings, demonstration sessions and coaching visits. The action aims for 70% adoption of at least one promoted circular practice. Groupings shown are illustrative.' + ILLUS,
  role: 'Farmers reached by training and peer learning',
  connects: 'The nearest cooperative and demonstration farms',
  source: 'Contract Annex I, target group and indicators (pp. 10, 19–20)',
}));

NET_NODES.push(
  {
    id: 'hub', type: 'hub', ll: [-61.685, 12.078], color: CREAM, layers: ['value'], stationId: 'market',
    title: 'Processing & market hub', tag: 'Value chain', activity: 'A3', illustrative: true, label: 'Processing & market', side: 'right',
    desc: 'Cooperative-run processing, packaging and quality assurance turn farm output into market-ready products (Activity A3). Whether this is one shared hub or several upgraded facilities is not fixed — shown here as a single node for illustration.' + ILLUS,
    role: 'Aggregation, processing, packaging, quality assurance',
    connects: 'The three cooperatives and their farms; buyers under 3 supply agreements',
    source: 'Contract Annex I, Activity A3 and indicator 1.2.1 (pp. 20, 34–36)',
  },
  {
    id: 'buyers', type: 'buyer', ll: [-61.776, 12.022], color: GOLD, layers: ['value', 'partners'], stationId: 'market',
    title: 'Buyers — 3 supply agreements', tag: 'Market access', activity: 'A3', illustrative: true, label: 'Buyers', side: 'left',
    desc: 'The action targets 3 supply agreements between cooperatives and buyers such as hotels, supermarkets and institutions. Buyers are not yet named.' + ILLUS,
    role: 'Formal offtake for cooperative products', connects: 'The processing hub and cooperatives',
    source: 'Contract indicator 1.2.1 (p. 20) and Activity A3',
  },
  {
    id: 'inst', type: 'inst', ll: [-61.752, 12.040], color: SKY, layers: ['partners'],
    title: 'Institutional partners — 3 MoUs', tag: 'Partnerships', activity: 'A1 · A3', illustrative: true, label: 'Institutions', side: 'left',
    desc: 'Delivery is coordinated with the Ministry of Agriculture, Lands and Forestry, the Cooperative Division and the Ministry of Education. The action targets 3 MoUs between cooperatives and institutional partners; the signatories are not yet named.' + ILLUS,
    role: 'Site selection, technical support, policy backing', connects: 'GCLL and the three cooperatives',
    source: 'Contract Annex I, Activity A1 (p. 27) and indicator 1.2.1 (p. 20)',
  },
  {
    id: 'panama', type: 'partner', pos: { x: 70, y: 688 }, color: VIOLET, layers: ['learning'], stationId: 'training',
    title: 'Study visit — Cooperativa Juan XXIII, Panama', tag: 'Study tour', activity: 'A2 Step 4', illustrative: false, label: 'Panama study visit', side: 'right',
    desc: 'One international study visit takes a small delegation from Grenada’s cooperative sector to Cooperativa de Servicios Múltiples Juan XXIII, R.L. in Santiago de Veraguas — described as one of the most advanced poultry cooperative systems in Latin America. Focus: biosecurity, animal health, housing, feed, hatchery and breeder flocks, processing and HACCP, governance and traceability. The contract states six participants in one place and lists eight in another — GCLL to confirm the final delegation.',
    role: 'Host cooperative for the international study visit',
    connects: 'GCLL, cooperative leaders and project staff; lessons return through GCLL to all cooperatives',
    source: 'Contract Annex I, Activity A2 Step 4 (pp. 32–33) and indicator 1.3.2 (p. 20)',
  },
  {
    id: 'stlucia', type: 'partner', pos: { x: 150, y: 44 }, color: VIOLET, layers: ['learning', 'partners'],
    title: 'Saint Lucia — regional exchange', tag: 'Regional partner', activity: 'A1 · A4', illustrative: false, label: 'Saint Lucia', side: 'right',
    desc: 'Regional partners in Saint Lucia take part through knowledge exchange, dissemination of results and access to the manuals, guidelines and lessons learned. Pilot installations are only in Grenada, Carriacou and Petite Martinique.',
    role: 'Knowledge-exchange partner', connects: 'GCLL and the cooperative networks',
    source: 'Contract Annex I, Activity A1 (p. 27) and p. 34',
  },
  {
    id: 'stkitts', type: 'partner', pos: { x: 330, y: 44 }, color: VIOLET, layers: ['learning', 'partners'],
    title: 'Saint Kitts & Nevis — regional exchange', tag: 'Regional partner', activity: 'A1 · A4', illustrative: false, label: 'Saint Kitts & Nevis', side: 'right',
    desc: 'Regional partners in Saint Kitts and Nevis take part through knowledge exchange, dissemination of results and access to the manuals, guidelines and lessons learned. Pilot installations are only in Grenada, Carriacou and Petite Martinique.',
    role: 'Knowledge-exchange partner', connects: 'GCLL and the cooperative networks',
    source: 'Contract Annex I, Activity A1 (p. 27) and p. 34',
  },
);

export const NET_LINKS: NetLink[] = [];
const link = (a: string, b: string, layers: NetLayer[], kind: NetLink['kind'], curv = 0.14, label = '') => NET_LINKS.push({ a, b, layers, kind, curv, label });
NET_NODES.filter((n) => n.type === 'farm').forEach((n) => link(n.id, n.parent!, ['value'], 'value', 0.1));
['coop1', 'coop2', 'coop3'].forEach((c, i) => {
  link(c, 'hub', ['value'], 'value', i === 2 ? 0.16 : 0.12);
  link('gcll', c, ['learning'], 'learning', 0.16);
  link(c, 'inst', ['partners'], 'partner', 0.12);
  link(`out${i + 1}`, c, ['learning'], 'learning', 0.1);
});
NET_NODES.filter((n) => n.type === 'school').forEach((n) => link(n.parent!, n.id, ['learning'], 'learning', 0.1));
link('hub', 'buyers', ['value', 'partners'], 'value', 0.14);
link('gcll', 'inst', ['partners'], 'partner', 0.1);
link('gcll', 'panama', ['learning'], 'study', 0.32, 'Study visit');
link('gcll', 'stlucia', ['learning', 'partners'], 'learning', -0.2, 'Exchange');
link('gcll', 'stkitts', ['learning', 'partners'], 'learning', -0.13);

export const NET_LAYERS: { id: 'all' | NetLayer; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'value', label: 'Value chain' }, { id: 'learning', label: 'Training & learning' }, { id: 'partners', label: 'Partnerships' },
];

export const LEARNING_STEPS: { title: string; text: string }[] = [
  { title: 'Pre-tour briefing', text: 'participants agree learning objectives with the project team.' },
  { title: 'Study visit', text: 'to Cooperativa Juan XXIII, R.L., Santiago de Veraguas, Panama — biosecurity, animal health, processing, HACCP, governance.' },
  { title: 'Post-visit sharing', text: 'participants brief the wider cooperative sector; GCLL keeps the knowledge as national hub.' },
  { title: 'Into the training materials', text: 'lessons feed the manuals used at the 15 sites and across the 3 cooperatives.' },
  { title: 'Regional exchange', text: 'with Saint Lucia and Saint Kitts & Nevis through cooperative networks.' },
];
