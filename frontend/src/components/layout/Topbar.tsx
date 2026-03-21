import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Sun, Moon, Globe, LogOut, Settings, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import { useTheme } from '../../hooks/useTheme'
import { api } from '../../lib/api'
import { fadeIn } from '../../lib/animations'
import { LanguageToggle } from './LanguageToggle'

export function Topbar() {
  const location              = useLocation()
  const navigate              = useNavigate()
  const { user, logout }      = useAuthStore()
  const { theme, toggle }     = useTheme()
  const { t, i18n }           = useTranslation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const PAGE_TITLES: Record<string, string> = {
    '/dashboard':             t('pages.dashboard'),
    '/revenue/delivery':      t('pages.delivery'),
    '/revenue/restaurant':    t('pages.restaurant'),
    '/revenue/subscriptions': t('pages.subscriptions'),
    '/purchases':             t('pages.purchases'),
    '/expenses':              t('pages.expenses'),
    '/petty-cash':            t('pages.pettyCash'),
    '/suppliers':             t('pages.suppliers'),
    '/subscribers':           t('pages.subscribers'),
    '/production':            t('pages.production'),
    '/accounts':              t('pages.accounts'),
    '/journal':               t('pages.journal'),
    '/ledger':                t('pages.ledger'),
    '/trial-balance':         t('pages.trialBalance'),
    '/income-statement':      t('pages.incomeStatement'),
    '/performance':           t('pages.performance'),
    '/reports':               t('pages.reports'),
    '/settings':              t('layout.settings'),
  }

  const pageTitle = PAGE_TITLES[location.pathname] ?? t('layout.title')

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch {}
    logout()
    navigate('/login')
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0, 
      ...(i18n.dir() === 'rtl' ? { left: 0, right: 280 } : { left: 280, right: 0 }),
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
        <LanguageToggle />

        {/* Theme toggle */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={toggle}
          aria-label={t(theme === 'dark' ? 'layout.themeLight' : 'layout.themeDark')}
          style={{ width: 36, height: 36, padding: 0, justifyContent: 'center' }}
        >
          {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
        </button>

        {/* Notifications */}
        <button
          className="btn btn-ghost btn-sm"
          aria-label={t('layout.notifications')}
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
              {user?.full_name?.[0] ?? 'U'}
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
                  <Settings size={14}/> {t('layout.settings')}
                </button>
                <div style={{ height: 1, background: 'var(--border-color)' }}/>
                <button
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, height: 40, color: 'var(--color-danger)' }}
                  onClick={handleLogout}
                >
                  <LogOut size={14}/> {t('layout.logout')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
