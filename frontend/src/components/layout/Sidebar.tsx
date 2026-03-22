import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, FileText,
  Truck, UtensilsCrossed, Package,
  ShoppingCart, Briefcase, Wallet,
  Users, UserCheck, Factory,
  BookOpen, BookMarked, Scale, DollarSign,
  ChevronLeft, ChevronRight, ChevronDown,
  BarChart2, Leaf, Target, Receipt, Shield, UserCog,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'

/* ── Types ─────────────────────────────────────────────────────────────── */
interface NavItem {
  to:     string
  icon:   React.ReactNode
  label:  string
  roles?: string[]
}

interface NavSection {
  id:     string
  title:  string           // i18n key — empty string means no header (top group)
  items:  NavItem[]
}

/* ── Nav config ──────────────────────────────────────────────────────────── */
const NAV_SECTIONS: NavSection[] = [
  {
    id: 'main', title: '',
    items: [
      { to: '/dashboard',   icon: <LayoutDashboard size={18}/>, label: 'pages.dashboard' },
      { to: '/performance', icon: <TrendingUp size={18}/>,      label: 'pages.performance' },
      { to: '/reports',     icon: <FileText size={18}/>,        label: 'pages.reports' },
    ],
  },
  {
    id: 'revenue', title: 'sidebar.revenue',
    items: [
      { to: '/revenue/delivery',      icon: <Truck size={18}/>,           label: 'pages.delivery' },
      { to: '/revenue/restaurant',    icon: <UtensilsCrossed size={18}/>, label: 'pages.restaurant' },
      { to: '/revenue/subscriptions', icon: <Package size={18}/>,         label: 'pages.subscriptions' },
    ],
  },
  {
    id: 'expenses', title: 'sidebar.expenses',
    items: [
      { to: '/purchases',  icon: <ShoppingCart size={18}/>, label: 'pages.purchases' },
      { to: '/expenses',   icon: <Briefcase size={18}/>,    label: 'pages.expenses' },
      { to: '/petty-cash', icon: <Wallet size={18}/>,       label: 'pages.pettyCash' },
    ],
  },
  {
    id: 'management', title: 'sidebar.management',
    items: [
      { to: '/suppliers',   icon: <Users size={18}/>,    label: 'pages.suppliers' },
      { to: '/subscribers', icon: <UserCheck size={18}/>,label: 'pages.subscribers' },
      { to: '/production',  icon: <Factory size={18}/>,  label: 'pages.production' },
    ],
  },
  {
    id: 'accounting', title: 'sidebar.accounting',
    items: [
      { to: '/accounts',         icon: <BookOpen size={18}/>,   label: 'pages.accounts',        roles: ['admin','accountant'] },
      { to: '/journal',          icon: <BookMarked size={18}/>, label: 'pages.journal',         roles: ['admin','accountant'] },
      { to: '/ledger',           icon: <Scale size={18}/>,      label: 'pages.ledger',          roles: ['admin','accountant'] },
      { to: '/trial-balance',    icon: <Scale size={18}/>,      label: 'pages.trialBalance',    roles: ['admin','accountant'] },
      { to: '/income-statement', icon: <DollarSign size={18}/>, label: 'pages.incomeStatement', roles: ['admin','accountant'] },
    ],
  },
  {
    id: 'analysis', title: 'sidebar.analysis',
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
    id: 'admin', title: 'sidebar.administration',
    items: [
      { to: '/users',     icon: <UserCog size={18}/>, label: 'pages.users',    roles: ['admin'] },
      { to: '/audit-log', icon: <Shield size={18}/>,  label: 'pages.auditLog', roles: ['admin'] },
    ],
  },
]

const EXPANDED_W  = 280
const COLLAPSED_W = 80

/* ── Component ───────────────────────────────────────────────────────────── */
export function Sidebar() {
  const [expanded, setExpanded]       = useState(true)
  // sections open by default: main always open, rest open if has active item
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    main: true, revenue: true, expenses: true,
    management: true, accounting: true, analysis: true, admin: true,
  })

  const { user }      = useAuthStore()
  const location      = useLocation()
  const { t, i18n }   = useTranslation()
  const isRtl         = i18n.dir() === 'rtl'

  /* Sync CSS variable so Topbar + AppShell follow sidebar width */
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--current-sidebar-w',
      `${expanded ? EXPANDED_W : COLLAPSED_W}px`
    )
  }, [expanded])

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <motion.aside
      animate={{ width: expanded ? EXPANDED_W : COLLAPSED_W }}
      transition={{ type: 'spring', stiffness: 220, damping: 30 }}
      style={{
        position:      'fixed',
        top: 0, bottom: 0,
        ...(isRtl ? { right: 0 } : { left: 0 }),
        zIndex:        100,
        background:    '#132E11',
        display:       'flex',
        flexDirection: 'column',
        overflow:      'hidden',
        borderInlineEnd: '1px solid rgba(255,255,255,0.06)',
      }}
    >

      {/* ── Logo bar ──────────────────────────────────────────────────── */}
      <div style={{
        height: 64, padding: '0 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0, gap: 8,
      }}>
        {/* Logo + name (hidden when collapsed) */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="logo-text"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', minWidth: 0 }}
            >
              <img src="/logo_icon_only.png" alt="logo"
                style={{ width: 38, height: 38, objectFit: 'contain', flexShrink: 0 }} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ color: '#FFF', fontWeight: 700, fontSize: 15, lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t('layout.title')}
                </div>
                <div style={{ color: '#C8DEC6', fontSize: 10, opacity: 0.6, whiteSpace: 'nowrap' }}>
                  {t('sidebar.systemName')}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* When collapsed — center the logo icon */}
        {!expanded && (
          <img src="/logo_icon_only.png" alt="logo"
            style={{ width: 38, height: 38, objectFit: 'contain', margin: '0 auto' }} />
        )}

        {/* Collapse/Expand toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            flexShrink: 0,
            width: 26, height: 26,
            borderRadius: 6, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(200,222,198,0.7)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          {/* In RTL: right arrow means "expand towards right", swap icons */}
          {isRtl
            ? (expanded ? <ChevronRight size={13}/> : <ChevronLeft size={13}/>)
            : (expanded ? <ChevronLeft  size={13}/> : <ChevronRight size={13}/>)
          }
        </button>
      </div>

      {/* ── Scrollable nav ────────────────────────────────────────────── */}
      <nav
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 8, paddingBottom: 8 }}
      >
        {NAV_SECTIONS.map(section => {
          const visibleItems = section.items.filter(
            item => !item.roles || item.roles.includes(user?.role ?? '')
          )
          if (!visibleItems.length) return null

          /* Is any item in this section currently active? */
          const sectionHasActive = visibleItems.some(item =>
            location.pathname.startsWith(item.to)
          )
          const isSectionOpen = openSections[section.id] ?? true

          return (
            <div key={section.id}>
              {/* Section header (accordion trigger) — only shown when sidebar expanded */}
              {expanded && section.title && (
                <button
                  onClick={() => toggleSection(section.id)}
                  style={{
                    width: '100%', border: 'none', background: 'none',
                    padding: '10px 20px 6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    color: sectionHasActive ? '#C47A3C' : '#C8DEC6',
                    opacity: sectionHasActive ? 1 : 0.5,
                    transition: 'color 0.2s, opacity 0.2s',
                  }}>
                    {t(section.title)}
                  </span>
                  <motion.span
                    animate={{ rotate: isSectionOpen ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', color: 'rgba(200,222,198,0.4)' }}
                  >
                    <ChevronDown size={12}/>
                  </motion.span>
                </button>
              )}

              {/* Collapsed sidebar: show a thin divider between sections */}
              {!expanded && section.title && (
                <div style={{
                  height: 1,
                  margin: '6px 12px',
                  background: 'rgba(255,255,255,0.07)',
                }}/>
              )}

              {/* Animated item list */}
              <AnimatePresence initial={false}>
                {(isSectionOpen || !expanded) && (
                  <motion.div
                    key={section.id + '-items'}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    {visibleItems.map(item => {
                      const active = location.pathname.startsWith(item.to)
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          title={!expanded ? String(t(item.label)) : undefined}
                          style={{
                            display:        'flex',
                            alignItems:     'center',
                            gap:            expanded ? 11 : 0,
                            justifyContent: expanded ? 'flex-start' : 'center',
                            padding:        expanded ? '9px 20px' : '10px 0',
                            margin:         '1px 0',
                            textDecoration: 'none',
                            background:     active ? 'rgba(43,146,37,0.90)' : 'transparent',
                            color:          active ? '#FFFFFF' : '#C8DEC6',
                            fontSize:       13,
                            fontWeight:     active ? 600 : 400,
                            borderInlineStart: (active && expanded)
                              ? '3px solid #C47A3C'
                              : '3px solid transparent',
                            transition:     'background 0.15s, color 0.15s',
                            position:       'relative',
                          }}
                          onMouseEnter={e => {
                            if (!active) {
                              e.currentTarget.style.background = '#1F4A1C'
                              e.currentTarget.style.color = '#FFFFFF'
                            }
                          }}
                          onMouseLeave={e => {
                            if (!active) {
                              e.currentTarget.style.background = 'transparent'
                              e.currentTarget.style.color = '#C8DEC6'
                            }
                          }}
                        >
                          {/* Active indicator dot when collapsed */}
                          {!expanded && active && (
                            <span style={{
                              position: 'absolute',
                              insetInlineStart: 0, top: '50%', transform: 'translateY(-50%)',
                              width: 3, height: 20, borderRadius: 2,
                              background: '#C47A3C',
                            }}/>
                          )}

                          <span style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }}>
                            {item.icon}
                          </span>

                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.span
                                key="label"
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* ── User footer ───────────────────────────────────────────────── */}
      {user && (
        <div style={{
          padding:       expanded ? '14px 20px' : '14px 0',
          borderTop:     '1px solid rgba(255,255,255,0.08)',
          display:       'flex',
          alignItems:    'center',
          justifyContent: expanded ? 'flex-start' : 'center',
          gap:           10,
          flexShrink:    0,
        }}>
          {/* Avatar */}
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#2B9225',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFF', fontWeight: 700, fontSize: 13,
            flexShrink: 0,
          }}>
            {user.full_name?.[0] ?? 'U'}
          </div>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="user-info"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                style={{ overflow: 'hidden', minWidth: 0 }}
              >
                <div style={{
                  color: '#FFF', fontSize: 13, fontWeight: 600,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user.full_name}
                </div>
                <div style={{ color: '#C8DEC6', fontSize: 11, opacity: 0.6, whiteSpace: 'nowrap' }}>
                  {t(`sidebar.roles.${user.role}`)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.aside>
  )
}
