export function ExplanationPanel({title='הסבר', children}:{title?:string; children?:React.ReactNode}){return <aside className='explain'><strong>{title}</strong><div>{children}</div></aside>}
