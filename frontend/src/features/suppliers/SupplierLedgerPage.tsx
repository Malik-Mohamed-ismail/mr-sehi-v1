import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FileText, Download, ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { DateRangePicker } from '../../components/ui/DateRangePicker'
import { AnimatedNumber } from '../../components/ui/AnimatedNumber'
import { staggerContainer, staggerItem } from '../../lib/animations'

export default function SupplierLedgerPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  
  const [from, setFrom] = useState(`${new Date().getFullYear()}-01-01`)
  const [to, setTo]     = useState(new Date().toISOString().split('T')[0])

  const { data: supplier } = useQuery({
    queryKey: ['supplier', id],
    queryFn: async () => {
      const res = await api.get(`/suppliers/${id}`)
      return res.data.data
    },
  })

  const { data: ledger, isLoading } = useQuery({
    queryKey: ['supplier-ledger', id, from, to],
    queryFn: async () => {
      const res = await api.get(`/suppliers/${id}/ledger`, { params: { from, to } })
      return res.data.data
    },
  })

  return (
    <PageTransition>
      <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Header & Back Button */}
        <div style={{ marginBottom: 24 }}>
          <Link to="/suppliers" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 16, fontSize: 13, fontWeight: 500 }}>
            {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />} {t('common.back')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
                كشف حساب مورد: <span style={{ color: 'var(--color-primary)' }}>{supplier?.name_ar || '...'}</span>
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>تتبع الفواتير والمدفوعات والرصيد المستحق</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <DateRangePicker from={from} to={to} onChange={(f, tr) => { setFrom(f); setTo(tr) }} />
              <button className="btn btn-secondary" style={{ gap: 6 }}><Download size={14} /> {t('common.exportExcel')}</button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gap: 20 }}>
            <div className="skeleton" style={{ height: 100, borderRadius: 16 }} />
            <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
          </div>
        ) : ledger ? (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ display: 'grid', gap: 20 }}>
            
            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <motion.div variants={staggerItem} className="card kpi-card">
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>إجمالي الفواتير</div>
                <AnimatedNumber value={Number(ledger.totals?.total_amount ?? 0)} suffix=" ر.س" />
              </motion.div>
              <motion.div variants={staggerItem} className="card kpi-card">
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>إجمالي الضريبة (مشتريات)</div>
                <AnimatedNumber value={Number(ledger.totals?.vat_amount ?? 0)} suffix=" ر.س" />
              </motion.div>
              <motion.div variants={staggerItem} className="card kpi-card" style={{ borderTop: '2px solid var(--color-danger)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div className="kpi-icon-circle kpi-icon-circle--danger"><FileText size={16} /></div>
                  <span className="kpi-label">الرصيد المستحق (آجل)</span>
                </div>
                <AnimatedNumber value={Number(ledger.outstanding_balance ?? 0)} suffix=" ر.س" />
              </motion.div>
            </div>

            {/* Invoices Table */}
            <motion.div variants={staggerItem} className="card">
              <h3 style={{ fontWeight: 600, marginBottom: 16 }}>سجل الفواتير</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>رقم الفاتورة</th>
                    <th>التاريخ</th>
                    <th>البيان</th>
                    <th>طريقة الدفع</th>
                    <th>الإجمالي قبل الضريبة</th>
                    <th>الضريبة</th>
                    <th>الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.invoices?.map((inv: any) => (
                    <tr key={inv.id}>
                      <td style={{ fontFamily: 'var(--font-latin)' }}>{inv.invoice_number}</td>
                      <td style={{ fontFamily: 'var(--font-latin)', fontSize: 13 }}>{inv.invoice_date}</td>
                      <td>{inv.item_name}</td>
                      <td>
                        <span className={`badge ${inv.payment_method === 'آجل' ? 'badge-danger' : 'badge-success'}`}>
                          {inv.payment_method}
                        </span>
                      </td>
                      <td className="number">{Number(inv.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="number">{Number(inv.vat_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="number" style={{ fontWeight: 600 }}>{Number(inv.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  {!ledger.invoices?.length && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>{t('common.noData')}</td></tr>
                  )}
                </tbody>
              </table>
            </motion.div>

          </motion.div>
        ) : null}
      </div>
    </PageTransition>
  )
}
