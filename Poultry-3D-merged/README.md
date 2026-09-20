# Poultry-3D

Online 3D design for circular poultry development — an interactive model of *Scaling Circular Poultry Cooperatives in Grenada* (EUCaN grant contract 700001756-01-04, implemented by the Grenada Co-operative League Ltd.).

## What is in this repo

| Path | What it is |
| --- | --- |
| `src/` | The React + Three.js app (the main version). Click any station in the list or the 3D scene to open the detail drawer. |
| `standalone/grenada-poultry-loop.html` | A single-file, no-build version of the same model (Story Mode, interior cutaways for the poultry house and market hub, voice narration). Open it in a browser with internet access. |
| `ASSESSMENT.md` | Why this base was chosen, the evidence rules, and the contract re-check. |

## Run the app

1. `pnpm install`
2. `pnpm run dev` and open the address shown (port 3000)
3. `pnpm run lint` (type-check) and `pnpm run build` (production build)

## Features

- **3D stage** — orbit and zoom; click a building or use the station list. The detail drawer has Photos & Info (tap an image to enlarge), Walkthrough, Circular Flows and Impact & Grant tabs, voice narration and previous/next station.
- **Guided tour** — *Start Tour* steps through every station with camera moves.
- **Circular Loop** — a flat diagram of the same stations and flows.
- **Grenada Network** — a schematic map of Grenada, Carriacou and Petite Martinique: three cooperatives, 10 farm and 5 school installations, the processing hub, buyers, institutions and smallholder farms nearby. Layers: Value chain, Training & learning, Partnerships. Click any node for its role, connections and contract source.
- **Training & Learning Hub** — Activity A2: 10 trainings, 45 demonstration sessions, 10 coaching visits and 1 study visit to Cooperativa Juan XXIII (Santiago de Veraguas, Panama), shown as a 3D station and as a learning pathway on the network map.
- **Detailed scene** — plastered, corrugated-roof poultry house with ridge vent, fans, silo and yard; biogas digester with membrane dome, tanks, gas line and stove; school with classrooms, solar and a school poultry run; training pavilion; fields, palms and hills. All geometry is procedural and illustrative (`src/components/sceneKit.ts`).

## Evidence rule

Every station is marked *confirmed* or *proposed*. Counts, activities and roles come from the signed contract (Annex I) and are referenced by page in `src/data/`. Physical dimensions, equipment schedules, site locations and any performance figures are **illustrative** and must not be presented as confirmed. Photos in the React app are open-licence reference images (Wikimedia Commons) labelled as not the actual project sites; the standalone file uses generic stock placeholders.

## Open items for GCLL to confirm

- Names and locations of the three cooperatives, the 15 sites and the buyers (all map positions are placeholders).
- Study-tour delegation size — the contract says six participants in one place and lists eight in another.
- Whether rainwater harvesting is an itemised installation (the contract cites it only as a resilience practice).
- A photo for the Training & Learning Hub, and site photos to replace the reference images.

## Checks completed

- TypeScript check: passed
- Production build: passed
- Browser check: 3D stage, station drawer, Grenada Network layers and node details
