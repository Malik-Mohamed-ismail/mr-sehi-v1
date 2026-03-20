import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Plus, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { staggerContainer, staggerItem } from '../../lib/animations'
import { formatSAR, formatDate } from '../../lib/utils'

export default function PettyCashPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const { data: records, isLoading } = useQuery({
    queryKey: ['petty-cash'],
    queryFn: () => api.get('/petty-cash').then(r => r.data.data),
  })

  const { data: reconciliation } = useQuery({
    queryKey: ['petty-cash-reconciliation'],
    queryFn: () => api.get(`/petty-cash/reconciliation?date=${today}`).then(r => r.data.data),
  })

  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { transaction_date: today, opening_balance: 0, cashier_replenishment: 0, cash_purchases: 0, card_purchases: 0, closing_balance: 0, notes: '' },
  })

  const opening = watch('opening_balance') ?? 0
  const replenish = watch('cashier_replenishment') ?? 0
  const cashP = watch('cash_purchases') ?? 0
  const cardP = watch('card_purchases') ?? 0
  const expected = Number(opening) + Number(replenish) - Number(cashP) - Number(cardP)

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/petty-cash', data),
    onSuccess: () => {
      toast.success('تم حفظ العهدة')
      qc.invalidateQueries({ queryKey: ['petty-cash'] })
      qc.invalidateQueries({ queryKey: ['petty-cash-reconciliation'] })
      reset(); setShowForm(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ'),
  })

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>العهدة والصندوق</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>متابعة النقدية اليومية والمطابقة</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}><Plus size={16}/> تسجيل يومي</button>
      </div>

      {/* Today reconciliation */}
      {reconciliation && reconciliation.opening_balance !== undefined && (
        <div className={`card ${reconciliation.is_balanced ? '' : ''}`} style={{
          marginBottom: 20, padding: '16px 20px',
          borderColor: reconciliation.is_balanced ? 'var(--color-success)' : 'var(--color-danger)',
          borderWidth: 1, borderStyle: 'solid',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            {reconciliation.is_balanced
              ? <CheckCircle size={18} color="var(--color-success)"/>
              : <XCircle size={18} color="var(--color-danger)"/>}
            <span style={{ fontWeight: 700 }}>مطابقة اليوم — {formatDate(today)}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'رصيد أول المدة', value: reconciliation.opening_balance },
              { label: 'عهدة الكاشير', value: reconciliation.cashier_replenishment },
              { label: 'رصيد متوقع', value: reconciliation.expected },
              { label: 'فارق', value: reconciliation.variance, highlight: true },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>{item.label}</div>
                <div className="number" style={{ fontWeight: 700, color: item.highlight ? (Math.abs(reconciliation.variance) < 0.01 ? 'var(--color-success)' : 'var(--color-danger)') : 'var(--text-primary)' }}>
                  {formatSAR(item.value ?? 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir="rtl">
            <div className="form-section-header">
              <div className="form-section-number">١</div>
              <div className="form-section-title">بيانات الصندوق اليومي</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-field has-value"><label>التاريخ</label><input {...register('transaction_date')} type="date" className="form-input"/></div>
              <div className="form-field has-value"><label>رصيد أول المدة</label><input {...register('opening_balance')} type="number" step="0.01" className="form-input"/></div>
              <div className="form-field has-value"><label>عهدة الكاشير</label><input {...register('cashier_replenishment')} type="number" step="0.01" className="form-input"/></div>
              <div className="form-field has-value"><label>مشتريات كاش</label><input {...register('cash_purchases')} type="number" step="0.01" className="form-input"/></div>
              <div className="form-field has-value"><label>مشتريات بطاقة</label><input {...register('card_purchases')} type="number" step="0.01" className="form-input"/></div>
              <div className="form-field has-value">
                <label style={{ color: 'var(--color-success)' }}>الرصيد المتوقع</label>
                <input readOnly value={expected.toFixed(2)} className="form-input amount-field"/>
              </div>
              <div className="form-field has-value"><label>رصيد آخر المدة الفعلي</label><input {...register('closing_balance')} type="number" step="0.01" className="form-input"/></div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); setShowForm(false) }}>إلغاء</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'جارٍ الحفظ...' : '💾 حفظ'}</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead><tr><th>التاريخ</th><th>رصيد الافتتاح</th><th>العهدة</th><th>المشتريات</th><th>الرصيد الختامي</th><th>الفارق</th><th>المطابقة</th></tr></thead>
          <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
            {(records ?? []).map((r: any) => (
              <motion.tr key={r.id} variants={staggerItem}>
                <td className="amount">{formatDate(r.transaction_date)}</td>
                <td className="amount">{formatSAR(r.opening_balance)}</td>
                <td className="amount">{formatSAR(r.cashier_replenishment)}</td>
                <td className="amount">{formatSAR(Number(r.cash_purchases) + Number(r.card_purchases))}</td>
                <td className="amount" style={{ fontWeight: 700 }}>{formatSAR(r.closing_balance)}</td>
                <td className="amount" style={{ color: Math.abs(Number(r.variance)) < 0.01 ? 'var(--color-success)' : 'var(--color-danger)' }}>{formatSAR(r.variance)}</td>
                <td>{r.is_balanced ? <CheckCircle size={15} color="var(--color-success)"/> : <XCircle size={15} color="var(--color-danger)"/>}</td>
              </motion.tr>
            ))}
            {!records?.length && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>لا توجد بيانات</td></tr>}
          </motion.tbody>
        </table>
      </div>
    </PageTransition>
  )
}
