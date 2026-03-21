import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Download, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { DateRangePicker } from '../../components/ui/DateRangePicker'
import { AnimatedNumber } from '../../components/ui/AnimatedNumber'
import { staggerContainer, staggerItem } from '../../lib/animations'

const toDay = new Date().toISOString().split('T')[0]
const fromDay = `${new Date().getFullYear()}-01-01`

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
    const res = await api.get('/reports/balance-sheet', {
      params: { from, to, format: 'pdf' },
      responseType: 'blob',
    })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const a = document.createElement('a'); a.href = url; a.download = `balance-sheet-${to}.pdf`; a.click()
  }

  return (
    <PageTransition>
      <div style={{ padding: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{t('pages.balanceSheet')}</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('reports.balanceSheetDesc')}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <DateRangePicker from={from} to={to} onChange={(f, tr) => { setFrom(f); setTo(tr) }} />
            <button className="btn btn-ghost btn-sm" onClick={() => refetch()} title={t('common.refresh')}>
              <RefreshCw size={14} />
            </button>
            <button className="btn btn-secondary" onClick={handleExport} style={{ gap: 6 }}>
              <Download size={14} /> {t('common.exportPdf')}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 400, borderRadius: 16 }} />)}
          </div>
        ) : data ? (
          <motion.div variants={staggerContainer} initial="initial" animate="animate"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Assets */}
            <motion.div variants={staggerItem} className="card">
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--color-info)', borderBottom: '2px solid var(--color-info)', paddingBottom: 10 }}>
                {t('reports.assets')}
              </h2>
              {data.assets?.map((group: any) => (
                <div key={group.name} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{group.name}</div>
                  {group.items?.map((item: any) => (
                    <div key={item.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: 13 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                      <span className="number" style={{ fontWeight: 600 }}>{Number(item.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, color: 'var(--color-info)' }}>
                    <span>{t('reports.subtotal')}</span>
                    <span className="number">{Number(group.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 700, borderTop: '2px solid var(--border-color)', fontSize: 15 }}>
                <span>{t('reports.totalAssets')}</span>
                <AnimatedNumber value={Number(data.totalAssets ?? 0)} suffix=" ر.س" />
              </div>
            </motion.div>

            {/* Liabilities + Equity */}
            <motion.div variants={staggerItem} className="card">
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--color-danger)', borderBottom: '2px solid var(--color-danger)', paddingBottom: 10 }}>
                {t('reports.liabilitiesAndEquity')}
              </h2>
              {data.liabilities?.map((group: any) => (
                <div key={group.name} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{group.name}</div>
                  {group.items?.map((item: any) => (
                    <div key={item.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: 13 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                      <span className="number" style={{ fontWeight: 600 }}>{Number(item.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, color: 'var(--color-danger)' }}>
                    <span>{t('reports.subtotal')}</span>
                    <span className="number">{Number(group.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 700, borderTop: '2px solid var(--border-color)', fontSize: 15 }}>
                <span>{t('reports.totalLiabEquity')}</span>
                <AnimatedNumber value={Number(data.totalLiabilitiesAndEquity ?? 0)} suffix=" ر.س" />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>{t('common.noData')}</div>
        )}
      </div>
    </PageTransition>
  )
}
