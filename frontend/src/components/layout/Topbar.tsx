import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Sun, Moon, Globe, LogOut, Settings, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { useTheme } from '../../hooks/useTheme'
import { api } from '../../lib/api'
import { fadeIn } from '../../lib/animations'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':             'لوحة المتابعة الرئيسية',
  '/revenue/delivery':      'إيرادات التوصيل',
  '/revenue/restaurant':    'إيرادات المطعم',
  '/revenue/subscriptions': 'إيرادات الاشتراكات',
  '/purchases':             'إدخال المشتريات',
  '/expenses':              'إدخال المصروفات',
  '/petty-cash':            'العهدة والصندوق',
  '/suppliers':             'الموردين',
  '/subscribers':           'متابعة الاشتراكات',
  '/production':            'الإنتاج والتالف',
  '/accounts':              'دليل الحسابات',
  '/journal':               'قيود اليومية',
  '/ledger':                'الأستاذ العام',
  '/trial-balance':         'ميزان المراجعة',
  '/income-statement':      'قائمة الدخل',
  '/reports':               'التقارير والتحليلات',
}

export function Topbar() {
  const location              = useLocation()
  const navigate              = useNavigate()
  const { user, logout }      = useAuthStore()
  const { theme, toggle }     = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'مستر صحي'

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch {}
    logout()
    navigate('/login')
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 280,  // right = sidebar width
      height: 56,
      zIndex: 99,
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      gap: 16,
    }}>
      {/* Page title */}
      <AnimatePresence mode="wait">
        <motion.h1
          key={location.pathname}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          style={{ flex: 1, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}
        >
          {pageTitle}
        </motion.h1>
      </AnimatePresence>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Theme toggle */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={toggle}
          aria-label="تبديل الوضع"
          style={{ width: 36, height: 36, padding: 0, justifyContent: 'center' }}
        >
          {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
        </button>

        {/* Notifications */}
        <button
          className="btn btn-ghost btn-sm"
          aria-label="الإشعارات"
          style={{ width: 36, height: 36, padding: 0, justifyContent: 'center', position: 'relative' }}
        >
          <Bell size={16}/>
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--color-danger)',
            border: '1.5px solid var(--bg-page)',
          }}/>
        </button>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setUserMenuOpen(o => !o)}
            style={{ height: 36, padding: '0 10px', gap: 6 }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'var(--gradient-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0D0F1A', fontWeight: 700, fontSize: 12,
            }}>
              {user?.full_name?.[0] ?? 'م'}
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{user?.full_name}</span>
            <ChevronDown size={12} style={{ color: 'var(--text-secondary)' }}/>
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                variants={fadeIn} initial="initial" animate="animate" exit="exit"
                style={{
                  position: 'absolute', top: '110%', left: 0,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: 160, overflow: 'hidden',
                  zIndex: 200,
                }}
              >
                <button
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, height: 40 }}
                  onClick={() => { setUserMenuOpen(false); navigate('/settings') }}
                >
                  <Settings size={14}/> الإعدادات
                </button>
                <div style={{ height: 1, background: 'var(--border-color)' }}/>
                <button
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, height: 40, color: 'var(--color-danger)' }}
                  onClick={handleLogout}
                >
                  <LogOut size={14}/> تسجيل الخروج
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
