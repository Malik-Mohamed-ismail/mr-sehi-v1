import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, RefreshCw, Wallet, Scale, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { DateRangePicker } from '../../components/ui/DateRangePicker'
import { AnimatedNumber } from '../../components/ui/AnimatedNumber'
import { staggerContainer, staggerItem } from '../../lib/animations'

const toDay = new Date().toISOString().split('T')[0]
const fromDay = `${new Date().getFullYear()}-01-01`

function BalanceGroup({ group, color }: { group: any; color: string }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ background: 'var(--bg-page)', borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 16, overflow: 'hidden', transition: 'all 0.2s', boxShadow: open ? '0 4px 12px rgba(0,0,0,0.02)' : 'none' }}>
      <button 
        onClick={() => setOpen(!open)} 
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}40` }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{group.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="number" style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>
            {Number(group.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          {open ? <ChevronUp size={16} color="var(--text-secondary)" /> : <ChevronDown size={16} color="var(--text-secondary)" />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
             <div style={{ padding: '0 20px 16px 20px' }}>
                {group.items?.map((item: any, i: number) => (
                   <div key={item.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: i === 0 ? 'none' : '1px dashed var(--border-color)', fontSize: 13 }}>
                     <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                       <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-color)' }} />
                       {item.name}
                     </span>
                     <span className="number" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                       {Number(item.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                     </span>
                   </div>
                ))}
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BalanceSheetPage() {
  const { t } = useTranslation()
  const [from, setFrom] = useState(fromDay)
  const [to, setTo]     = useState(toDay)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['balance-sheet', from, to],
    queryFn: async () => {
      const res = await api.get('/reports/balance-sheet', { params: { from, to } })
      return res.data.data
    },
  })

  const handleExport = async () => {
    const res = await api.get('/reports/balance-sheet', { params: { from, to, format: 'pdf' }, responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const a = document.createElement('a'); a.href = url; a.download = `balance-sheet-${to}.pdf`; a.click()
  }

  const tat = Number(data?.totalAssets ?? 0)
  const tle = Number(data?.totalLiabilitiesAndEquity ?? 0)
  const isBalanced = Math.abs(tat - tle) < 0.01

  return (
    <PageTransition>
      <div style={{ padding: 24, paddingBottom: 64 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Scale size={24} color="var(--color-primary)" />
              {t('pages.balanceSheet')}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{t('reports.balanceSheetDesc')}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <DateRangePicker from={from} to={to} onChange={(f, tr) => { setFrom(f); setTo(tr) }} />
            <button className="btn btn-ghost" style={{ height: 38, width: 38, padding: 0, justifyContent: 'center' }} onClick={() => refetch()} title={t('common.refresh')}>
              <RefreshCw size={16} />
            </button>
            <button className="btn btn-secondary" onClick={handleExport} style={{ gap: 8, height: 38, paddingInline: 16 }} disabled={!data}>
              <Download size={16} /> {t('common.exportPdf')}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
             <div className="skeleton" style={{ height: 120, borderRadius: 16, gridColumn: '1 / -1' }} />
            {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 500, borderRadius: 16 }} />)}
          </div>
        ) : data ? (
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            
            {/* KPI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 32 }}>
              <motion.div variants={staggerItem} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 24, border: '1px solid var(--border-color)', borderBottom: '4px solid var(--color-primary)' }}>
                <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  <Wallet size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, letterSpacing: '0.5px' }}>{t('reports.totalAssets')}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                     <AnimatedNumber value={tat} suffix="" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={staggerItem} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 24, border: '1px solid var(--border-color)', borderBottom: '4px solid #C47A3C' }}>
                <div style={{ width: 56, height: 56, borderRadius: '16px', background: '#FDF0E4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C47A3C' }}>
                  <Scale size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, letterSpacing: '0.5px' }}>{t('reports.totalLiabEquity')}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                     <AnimatedNumber value={tle} suffix="" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={staggerItem} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 24, background: isBalanced ? 'var(--color-primary)' : 'var(--color-danger)', color: '#FFFFFF', borderBottom: '4px solid rgba(0,0,0,0.2)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, marginBottom: 8 }}>حالة الميزانية</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {isBalanced ? <CheckCircle2 size={24} /> : <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid white' }}/>}
                    <div style={{ fontSize: 24, fontWeight: 800 }}>{isBalanced ? 'متوازنة' : 'غير متوازنة'}</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
              {/* Assets Column */}
              <motion.div variants={staggerItem} className="card" style={{ padding: 24, background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, marginBottom: 20, borderBottom: '2px solid var(--border-color)' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{t('reports.assets')}</h2>
                  <div style={{ padding: '6px 12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '20px', fontSize: 13, fontWeight: 700 }}>
                    {Number(data.totalAssets ?? 0).toLocaleString('en-US')}
                  </div>
                </div>
                
                {data.assets?.length > 0 ? data.assets.map((group: any) => (
                  <BalanceGroup key={group.name} group={group} color="var(--color-primary)" />
                )) : <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>لا توجد بيانات للأصول</div>}
              </motion.div>

              {/* Liabilities + Equity Column */}
              <motion.div variants={staggerItem} className="card" style={{ padding: 24, background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, marginBottom: 20, borderBottom: '2px solid var(--border-color)' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{t('reports.liabilitiesAndEquity')}</h2>
                  <div style={{ padding: '6px 12px', background: '#FDF0E4', color: '#C47A3C', borderRadius: '20px', fontSize: 13, fontWeight: 700 }}>
                    {Number(data.totalLiabilitiesAndEquity ?? 0).toLocaleString('en-US')}
                  </div>
                </div>

                {data.liabilities?.length > 0 ? data.liabilities.map((group: any) => (
                  <BalanceGroup key={group.name} group={group} color="#C47A3C" />
                )) : <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>لا توجد بيانات للالتزامات وحقوق الملكية</div>}
              </motion.div>
            </div>

          </motion.div>
        ) : (
          <div style={{ textAlign: 'center', padding: 100, color: 'var(--text-secondary)', background: 'var(--bg-surface)', borderRadius: 24, border: '1px dashed var(--border-color)' }}>
             <Scale size={48} color="var(--border-color)" style={{ margin: '0 auto 16px' }} />
             <p>{t('common.noData')}</p>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
