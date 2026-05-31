export function formatMoney(value:number){ return `${Math.round(value).toLocaleString('he-IL')} ₪`; }
export function formatPercent(value:number){ return `${(value*100).toFixed(2)}%`; }
