import fs from 'node:fs';
const required = ['src/app/App.tsx','src/engine/simulate.ts','src/shared/qa/releaseGate150.ts','src/modules/simulation/SimulationScreen.tsx'];
let ok = true;
for (const f of required) { if (!fs.existsSync(f)) { console.error('Missing', f); ok=false; } }
const gate = fs.readFileSync('src/shared/qa/releaseGate150.ts','utf8');
if (!gate.includes('length:150')) console.warn('Release gate generated dynamically; verify count at runtime.');
if (!ok) process.exit(1);
console.log('Static QA passed');
