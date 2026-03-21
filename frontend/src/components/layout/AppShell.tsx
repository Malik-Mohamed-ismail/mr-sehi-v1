import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { BottomNav } from './BottomNav'
import { useTranslation } from 'react-i18next'

export function AppShell() {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Sidebar/>
      <Topbar/>
      <main style={{
        ...(isRTL ? { marginRight: 280 } : { marginLeft: 280 }), // sidebar width
        marginTop:   56,     // topbar height
        padding:     '24px',
        minHeight:   'calc(100vh - 56px)',
        transition:  'margin 0.3s ease',
      }}>
        <Outlet/>
      </main>
      <BottomNav/>
    </div>
  )
}

