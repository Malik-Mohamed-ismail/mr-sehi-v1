import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Sidebar/>
      <Topbar/>
      <main style={{
        marginRight: 280,    // sidebar width (collapsed: 80px handled by Sidebar motion)
        marginTop:   56,     // topbar height
        padding:     '24px',
        minHeight:   'calc(100vh - 56px)',
        transition:  'margin-right 0.3s ease',
      }}>
        <Outlet/>
      </main>
    </div>
  )
}
