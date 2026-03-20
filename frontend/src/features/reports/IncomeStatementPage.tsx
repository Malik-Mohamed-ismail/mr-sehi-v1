import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FileText, Download } from 'lucide-react'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { formatSAR, formatDate } from '../../lib/utils'
import { exportToExcel } from '../../lib/export'

function now() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}
function today() { return new Date().toISOString().split('T')[0] }

export default function IncomeStatementPage() {
  const [from, setFrom] = useState(now())
  const [to, setTo]     = useState(today())

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['income-statement', from, to],
    queryFn:  () => api.get(`/reports/income-statement?from=${from}&to=${to}`).then(r => r.data.data),
    enabled:  !!from && !!to,
  })

  const handleExport = () => {
    if (!data) return
    const exportData = [
      { 'البند': 'إيرادات التوصيل', 'المبلغ (ريال)': data.revenue.delivery },
      { 'البند': 'إيرادات المطعم', 'المبلغ (ريال)': data.revenue.restaurant },
      { 'البند': 'إيرادات الاشتراكات', 'المبلغ (ريال)': data.revenue.subscriptions },
      { 'البند': 'إجمالي الإيرادات', 'المبلغ (ريال)': data.revenue.total },
      { 'البند': '', 'المبلغ (ريال)': '' },
      { 'البند': 'تكلفة البضاعة المباعة (المشتريات)', 'المبلغ (ريال)': data.cogs },
      { 'البند': 'مجمل الربح', 'المبلغ (ريال)': data.gross_profit },
      { 'البند': '', 'المبلغ (ريال)': '' },
      { 'البند': 'المصروفات التشغيلية', 'المبلغ (ريال)': data.total_expenses },
      { 'البند': '', 'المبلغ (ريال)': '' },
      { 'البند': 'صافي الربح', 'المبلغ (ريال)': data.net_profit }
    ]
    exportToExcel(exportData, `قائمة_الدخل_${from}_${to}`)
  }

  const renderRow = (label: string, value: number, style?: React.CSSProperties, indent = false) => (
    <tr>
      <td style={{ paddingRight: indent ? 32 : 16, ...style }}>{label}</td>
      <td className="amount" style={{ fontWeight: 600, ...style }}>{formatSAR(value)}</td>
      <td className="amount" style={{ color: 'var(--text-secondary)', ...style }}>
        {data?.revenue?.total > 0 ? `${((value / data.revenue.total) * 100).toFixed(1)}%` : '—'}
      </td>
    </tr>
  )

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>قائمة الدخل</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>Income Statement</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleExport} disabled={!data}>
          <Download size={14}/> تصدير Excel
        </button>
      </div>

      {/* Date range filter */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
        <div className="form-field has-value" style={{ marginBottom: 0 }}>
          <label>من</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="form-input" style={{ width: 160 }}/>
        </div>
        <div className="form-field has-value" style={{ marginBottom: 0 }}>
          <label>إلى</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="form-input" style={{ width: 160 }}/>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => refetch()}>تحديث</button>
      </div>

      {isLoading ? (
        <div className="card">
          {[...Array(10)].map((_, i) => <div key={i} className="skeleton" style={{ height: 36, marginBottom: 8 }}/>)}
        </div>
      ) : data ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            background: 'var(--gradient-hero)', padding: '20px 24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <h3 style={{ color: '#EDE9E0', fontWeight: 700, fontSize: 18 }}>قائمة الدخل</h3>
              <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 12, marginTop: 4 }}>
                {formatDate(from)} — {formatDate(to)}
              </p>
            </div>
            <FileText size={24} color="rgba(212,168,83,0.60)"/>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>البند</th>
                <th style={{ textAlign: 'left' }}>المبلغ (ريال)</th>
                <th style={{ textAlign: 'left' }}>%</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                <td colSpan={3} style={{ fontWeight: 700, padding: '10px 16px', fontSize: 13 }}>الإيرادات</td>
              </tr>
              {renderRow('إيرادات التوصيل',      data.revenue.delivery,      {}, true)}
              {renderRow('إيرادات المطعم',       data.revenue.restaurant,     {}, true)}
              {renderRow('إيرادات الاشتراكات',  data.revenue.subscriptions,  {}, true)}
              {renderRow('إجمالي الإيرادات',     data.revenue.total, { fontWeight: 700, borderTop: '2px solid var(--border-color)' })}

              <tr><td colSpan={3} style={{ height: 8 }}/></tr>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                <td colSpan={3} style={{ fontWeight: 700, padding: '10px 16px', fontSize: 13 }}>تكلفة البضاعة المباعة</td>
              </tr>
              {renderRow('المشتريات', data.cogs, {}, true)}
              {renderRow('مجمل الربح', data.gross_profit, {
                fontWeight: 700,
                color: data.gross_profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                borderTop: '2px solid var(--border-color)',
              })}

              <tr><td colSpan={3} style={{ height: 8 }}/></tr>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                <td colSpan={3} style={{ fontWeight: 700, padding: '10px 16px', fontSize: 13 }}>المصروفات التشغيلية</td>
              </tr>
              {renderRow('إجمالي المصروفات', data.total_expenses, {}, true)}

              <tr><td colSpan={3} style={{ height: 8 }}/></tr>
              {renderRow('صافي الربح', data.net_profit, {
                fontWeight: 800,
                fontSize: 15,
                color: data.net_profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                borderTop: '3px solid var(--border-color)',
                background: data.net_profit >= 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
              })}
            </tbody>
          </table>
        </motion.div>
      ) : null}
    </PageTransition>
  )
}
