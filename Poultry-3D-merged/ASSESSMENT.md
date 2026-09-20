# Assessment: AI Studio version vs. the earlier prototype

## Decision

Use this reviewed AI Studio version as the new working base. Its structure and visitor experience are stronger than the earlier single-file prototype, while the corrected content layer is safer and better aligned with the source documents.

## Where it is better

- Clear station list: visitors can select the Poultry House and every other component without guessing where to click in 3D.
- Rich station panel: name, status, illustrative real-world image, explanation, walkthrough, circular flows and grant alignment appear together.
- Guided Story Mode: the Start Tour control creates a coherent learning journey.
- Two complementary views: an explorable 3D scene and a Circular Loop diagram.
- Better maintainability: React components and a central project-data file make future corrections much easier.
- Better factual signalling: confirmed requirements and proposed concepts are visibly distinguished.

## Where the original AI Studio output was unsafe

The supplied draft included unsupported exact specifications, fixed site allocations and claimed outcomes. Examples included a ten-farm/five-school split, exact equipment capacities and yields, Black Soldier Fly and cassava as confirmed technologies, certification or SOPs as completed, and performance results presented as achieved. Those statements were removed or relabelled as proposals requiring validation.

## Facts retained as confirmed

- Grant reference: 700001756-01-04
- Budget: EUR 144,450
- Duration: 12 months
- Three cooperatives
- Fifteen installations across farms, schools and institutions; the exact split is not fixed
- 120 direct participants, including 48 women and 24 youth
- 70% adoption target
- Smallholder context of about 120 birds per farm and 12-15% mortality
- Three target cooperative-to-buyer supply agreements
- Solar, biogas, compost/organic fertiliser, training, biosecurity, processing, packaging and market-linkage activities

## Items retained only as proposals

- Black Soldier Fly production
- Cassava as the selected feed crop
- Exact rainwater-system configuration
- Any exact building dimension, equipment capacity, yield or engineering specification

These can remain in the visual model as clearly marked concepts, but require project and technical approval before being represented as commitments.


## Contract re-check (September 2026)

The statements above about Black Soldier Fly, cassava and the farm/school split were re-checked against the text of the signed contract (Annex I, Description of the Action). The contract text says:

- **Installations:** "Ten (10) installations will be established at farms operated by members of the participating cooperatives" and "Five (5) installations will be established at selected secondary schools with existing poultry programmes" (Activity A1, p. 26; repeated on pp. 28 and 31). The 10 + 5 split is therefore stated, although the individual schools and farms are not named.
- **Black Soldier Fly:** "Black Soldier Fly (BSF) production units for sustainable poultry feed" are listed among the demonstration systems (p. 26) and BSF production is a training topic (pp. 30–31). Not every site receives identical equipment (p. 28).
- **Cassava:** "Cassava-based feed demonstration systems (where appropriate)" are listed (p. 26) and taught as an alternative feed system (p. 31). Cassava is not stated as the only crop or as required at every site.
- **Study tour:** one international study visit to Cooperativa de Servicios Múltiples Juan XXIII, R.L., Santiago de Veraguas, Panama (pp. 32–33), within 66 planned learning events (10 trainings, 1 study visit, 10 coaching visits, 45 demonstration sessions; indicator 1.3.2, p. 20). The text gives the delegation as six participants and also lists eight — to be clarified.
- **Regional partners:** Saint Lucia and Saint Kitts and Nevis take part through knowledge exchange only (p. 27).

Consequently this version marks BSF, cassava feed demonstrations and the 10 + 5 installation split as **confirmed (contract pp. 26–31)**, while keeping every dimension, capacity, location, yield and equipment detail as illustrative. Rainwater harvesting remains *proposed* (it appears only as a resilience practice). Please verify these page references against the signed PDF; if GCLL's project team reads the contract differently, revert the affected entries in `src/data/poultryData.ts` and `src/data/networkData.ts`.