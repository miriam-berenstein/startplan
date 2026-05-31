export function DataTable<T extends Record<string, unknown>>({rows, columns}:{rows:T[]; columns:Array<{key:keyof T; label:string}>}){
 return <div className="table-wrap"><table><thead><tr>{columns.map(c=><th key={String(c.key)}>{c.label}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{columns.map(c=><td key={String(c.key)}>{String(r[c.key] ?? '')}</td>)}</tr>)}</tbody></table></div>
}
