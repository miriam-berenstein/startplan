import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
export function AppShell({children}:{children:ReactNode}){return <div dir='rtl' className='shell'><AppHeader/><div className='shell-grid'><AppSidebar/><main>{children}</main></div></div>}
