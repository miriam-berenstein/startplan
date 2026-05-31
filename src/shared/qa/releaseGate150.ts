import type { QACheck } from './qaTypes';
const categories = ['layout','performance','buttons','state','engine','risk','tax','reports','export'] as const;
export const releaseGate150: QACheck[] = Array.from({length:150}, (_,i)=>({
  id:`QA-${String(i+1).padStart(3,'0')}`,
  title: [
    'אין overlap בין מסכים','אין cards שעולים אחד על השני','אין טבלאות שנחתכות','אין גלילה אופקית כללית','אין sticky headers שמכסים תוכן'
  ][i] ?? `בדיקת חובה ${i+1}`,
  category: categories[i % categories.length], mode: i%5===0?'visual':i%3===0?'e2e':'unit', required:true,
  relatedScreenIds:['all'], relatedEngineIds:[], passCondition:'Must pass before release.'
}));
