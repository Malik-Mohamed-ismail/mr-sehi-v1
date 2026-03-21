import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, FileText,
  Truck, UtensilsCrossed, Package,
  ShoppingCart, Briefcase, Wallet,
  Users, UserCheck, Factory,
  BookOpen, BookMarked, Scale, DollarSign,
  ChevronLeft, ChevronRight, Sparkles,
  BarChart2, PieChart, Leaf, Target, Receipt, Shield, UserCog
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'

interface NavItem {
  to:    string
  icon:  React.ReactNode
  label: string
  roles?: string[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: '',
    items: [
      { to: '/dashboard',    icon: <LayoutDashboard size={18}/>, label: 'pages.dashboard' },
      { to: '/performance',  icon: <TrendingUp size={18}/>,      label: 'pages.performance' },
      { to: '/reports',      icon: <FileText size={18}/>,        label: 'pages.reports' },
    ],
  },
  {
    title: 'sidebar.revenue',
    items: [
      { to: '/revenue/delivery',      icon: <Truck size={18}/>,             label: 'pages.delivery' },
      { to: '/revenue/restaurant',    icon: <UtensilsCrossed size={18}/>,   label: 'pages.restaurant' },
      { to: '/revenue/subscriptions', icon: <Package size={18}/>,           label: 'pages.subscriptions' },
    ],
  },
  {
    title: 'sidebar.expenses',
    items: [
      { to: '/purchases',  icon: <ShoppingCart size={18}/>, label: 'pages.purchases' },
      { to: '/expenses',   icon: <Briefcase size={18}/>,    label: 'pages.expenses' },
      { to: '/petty-cash', icon: <Wallet size={18}/>,       label: 'pages.pettyCash' },
    ],
  },
  {
    title: 'sidebar.management',
    items: [
      { to: '/suppliers',    icon: <Users size={18}/>,    label: 'pages.suppliers' },
      { to: '/subscribers',  icon: <UserCheck size={18}/>,label: 'pages.subscribers' },
      { to: '/production',   icon: <Factory size={18}/>,  label: 'pages.production' },
    ],
  },
  {
    title: 'sidebar.accounting',
    items: [
      { to: '/accounts',       icon: <BookOpen size={18}/>,   label: 'pages.accounts',      roles: ['admin','accountant'] },
      { to: '/journal',        icon: <BookMarked size={18}/>, label: 'pages.journal',       roles: ['admin','accountant'] },
      { to: '/ledger',         icon: <Scale size={18}/>,      label: 'pages.ledger',        roles: ['admin','accountant'] },
      { to: '/trial-balance',  icon: <Scale size={18}/>,      label: 'pages.trialBalance',  roles: ['admin','accountant'] },
      { to: '/income-statement',icon: <DollarSign size={18}/>,label: 'pages.incomeStatement',roles: ['admin','accountant'] },
    ],
  },
  {
    title: 'sidebar.analysis',
    items: [
      { to: '/balance-sheet',    icon: <FileText size={18}/>,   label: 'pages.balanceSheet',    roles: ['admin','accountant'] },
      { to: '/cash-flow',        icon: <TrendingUp size={18}/>, label: 'pages.cashFlow',        roles: ['admin','accountant'] },
      { to: '/channel-analysis', icon: <BarChart2 size={18}/>,  label: 'pages.channelAnalysis', roles: ['admin','accountant'] },
      { to: '/waste-analysis',   icon: <Leaf size={18}/>,       label: 'pages.wasteAnalysis',   roles: ['admin','accountant'] },
      { to: '/breakeven',        icon: <Target size={18}/>,     label: 'pages.breakeven',       roles: ['admin','accountant'] },
      { to: '/vat-summary',      icon: <Receipt size={18}/>,    label: 'pages.vatSummary',      roles: ['admin','accountant'] },
    ],
  },
  {
    title: 'sidebar.administration',
    items: [
      { to: '/users',     icon: <UserCog size={18}/>, label: 'pages.users',    roles: ['admin'] },
      { to: '/audit-log', icon: <Shield size={18}/>,  label: 'pages.auditLog', roles: ['admin'] },
    ],
  },
]

export function Sidebar() {
  const [expanded, setExpanded]   = useState(true)
  const { user }                  = useAuthStore()
  const location                  = useLocation()
  const { t, i18n }               = useTranslation()

  return (
    <motion.aside
      animate={{ width: expanded ? 280 : 80 }}
      transition={{ type: 'spring', stiffness: 200, damping: 28 }}
      style={{
        position:   'fixed',
        top:        0,
        bottom:     0,
        ...(i18n.dir() === 'rtl' ? { right: 0, borderLeft: '1px solid rgba(255,255,255,0.05)' } : { left: 0, borderRight: '1px solid rgba(255,255,255,0.05)' }),
        zIndex:     100,
        background: 'var(--bg-sidebar)',
        display:    'flex',
        flexDirection: 'column',
        overflow:   'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        height: 64, padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'var(--gradient-gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={16} color="#0D0F1A"/>
              </div>
              <div>
                <div style={{ color: '#EDE9E0', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{t('layout.title')}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{t('sidebar.systemName')}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!expanded && (
          <div style={{
            width: 32, height: 32, borderRadius: 8, margin: '0 auto',
            background: 'var(--gradient-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} color="#0D0F1A"/>
          </div>
        )}
        <button
          onClick={() => setExpanded(e => !e)}
          aria-label={t(expanded ? 'sidebar.collapse' : 'sidebar.expand')}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: 'none', borderRadius: 6, cursor: 'pointer',
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.5)',
            transition: 'background 0.2s',
            flexShrink: 0,
            transform: i18n.language === 'en' ? 'scaleX(-1)' : 'none',
          }}
        >
          {expanded ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {navSections.map((section) => {
          const visibleItems = section.items.filter(item =>
            !item.roles || item.roles.includes(user?.role ?? '')
          )
          if (!visibleItems.length) return null
          return (
            <div key={section.title} style={{ marginBottom: 4 }}>
              {expanded && section.title && (
                <div style={{
                  padding: '8px 20px 4px',
                  fontSize: 10, fontWeight: 600,
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                }}>
                  {t(section.title)}
                </div>
              )}
              {visibleItems.map((item) => {
                const active = location.pathname.startsWith(item.to)
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    style={{
                      display: 'flex', alignItems: 'center',
                      gap: expanded ? 12 : 0,
                      justifyContent: expanded ? 'flex-start' : 'center',
                      padding: expanded ? '9px 20px' : '9px 0',
                      margin: '1px 8px',
                      borderRadius: 8,
                      textDecoration: 'none',
                      background: active
                        ? 'linear-gradient(135deg, rgba(212,168,83,0.20) 0%, rgba(212,168,83,0.08) 100%)'
                        : 'transparent',
                      color: active ? '#D4A853' : 'rgba(255,255,255,0.55)',
                      fontSize: 13, fontWeight: active ? 600 : 400,
                      transition: 'all 0.15s ease',
                      borderLeft: active && expanded ? '2px solid #D4A853' : '2px solid transparent',
                    }}
                    title={!expanded ? item.label : undefined}
                  >
                    <span style={{ flexShrink: 0 }}>{item.icon}</span>
                    <AnimatePresence>
                      {expanded && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                        >
                          {t(item.label)}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* User info */}
      {expanded && user && (
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--gradient-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0D0F1A', fontWeight: 700, fontSize: 13, flexShrink: 0,
          }}>
            {user.full_name[0]}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#EDE9E0', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.full_name}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>
              {t(`sidebar.roles.${user.role}`)}
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  )
}
