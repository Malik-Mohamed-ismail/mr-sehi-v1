import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Sun, Moon, LogOut, Settings, ChevronDown } from 'lucide-react'
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
    '/balance-sheet':         t('pages.balanceSheet'),
    '/cash-flow':             t('pages.cashFlow'),
    '/channel-analysis':      t('pages.channelAnalysis'),
    '/waste-analysis':        t('pages.wasteAnalysis'),
    '/breakeven':             t('pages.breakeven'),
    '/vat-summary':           t('pages.vatSummary'),
    '/audit-log':             t('pages.auditLog'),
    '/users':                 t('pages.users'),
    '/reports':               t('pages.reports'),
    '/settings':              t('layout.settings'),
  }

  const pageTitle = PAGE_TITLES[location.pathname] ?? t('layout.title')

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch {}
    logout()
    navigate('/login')
  }

  const iconBtnStyle: React.CSSProperties = {
    width: 36, height: 36, padding: 0,
    justifyContent: 'center',
    background: 'transparent',
    border: '1px solid #DDE8DC',
    borderRadius: 8,
    cursor: 'pointer',
    color: '#5A6B58',
    display: 'flex', alignItems: 'center',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  }

  const iconBtnHover = {
    background: '#E8F5E7',
    borderColor: '#2B9225',
    color: '#2B9225',
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      ...(i18n.dir() === 'rtl'
          ? { left: 0,   right: 'var(--current-sidebar-w, 280px)' }
          : { left: 'var(--current-sidebar-w, 280px)', right: 0 }),
      height: 56,
      zIndex: 99,
      background: '#FFFFFF',
      borderBottom: '1px solid #DDE8DC',
      boxShadow: '0 1px 4px rgba(43,146,37,0.08)',
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
          style={{ flex: 1, fontSize: 16, fontWeight: 700, color: '#1A2B18' }}
        >
          {pageTitle}
        </motion.h1>
      </AnimatePresence>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <LanguageToggle />

        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label={t(theme === 'dark' ? 'layout.themeLight' : 'layout.themeDark')}
          style={iconBtnStyle}
          onMouseEnter={e => Object.assign(e.currentTarget.style, iconBtnHover)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'transparent', borderColor: '#DDE8DC', color: '#5A6B58' })}
        >
          {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
        </button>

        {/* Notifications */}
        <button
          aria-label={t('layout.notifications')}
          style={{ ...iconBtnStyle, position: 'relative' }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, iconBtnHover)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'transparent', borderColor: '#DDE8DC', color: '#5A6B58' })}
        >
          <Bell size={16}/>
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 7, height: 7, borderRadius: '50%',
            background: '#E8384D',
            border: '1.5px solid #FFFFFF',
          }}/>
        </button>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(o => !o)}
            style={{ ...iconBtnStyle, width: 'auto', padding: '0 10px', gap: 6, height: 36 }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { background: '#E8F5E7', borderColor: '#2B9225' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'transparent', borderColor: '#DDE8DC' })}
          >
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: '#2B9225',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', fontWeight: 700, fontSize: 12,
            }}>
              {user?.full_name?.[0] ?? 'U'}
            </div>
            <span style={{ fontSize: 13, color: '#1A2B18' }}>{user?.full_name}</span>
            <ChevronDown size={12} style={{ color: '#5A6B58' }}/>
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                variants={fadeIn} initial="initial" animate="animate" exit="exit"
                style={{
                  position: 'absolute', top: '110%',
                  ...(i18n.dir() === 'rtl' ? { left: 0 } : { right: 0 }),
                  background: '#FFFFFF',
                  border: '1px solid #DDE8DC',
                  borderRadius: 10,
                  boxShadow: '0 8px 32px rgba(43,146,37,0.15)',
                  minWidth: 160, overflow: 'hidden',
                  zIndex: 200,
                }}
              >
                <button
                  style={{
                    width: '100%', height: 40,
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '0 16px',
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: 13, color: '#1A2B18',
                    fontFamily: 'inherit', justifyContent: 'flex-start',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F4F6F3')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => { setUserMenuOpen(false); navigate('/settings') }}
                >
                  <Settings size={14}/> {t('layout.settings')}
                </button>
                <div style={{ height: 1, background: '#DDE8DC' }}/>
                <button
                  style={{
                    width: '100%', height: 40,
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '0 16px',
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: 13, color: '#E8384D',
                    fontFamily: 'inherit', justifyContent: 'flex-start',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FDECED')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
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
