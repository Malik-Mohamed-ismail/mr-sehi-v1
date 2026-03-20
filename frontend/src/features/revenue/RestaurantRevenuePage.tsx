import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { staggerContainer, staggerItem } from '../../lib/animations'
import { formatSAR, formatDate } from '../../lib/utils'

export default function RestaurantRevenuePage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: revenues, isLoading } = useQuery({
    queryKey: ['revenue-restaurant'],
    queryFn: () => api.get('/revenue/restaurant').then(r => r.data.data),
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { revenue_date: '', amount: '', payment_method: 'كاش', covers: '', notes: '' },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/revenue/restaurant', data),
    onSuccess: () => {
      toast.success('تم حفظ إيراد المطعم')
      qc.invalidateQueries({ queryKey: ['revenue-restaurant'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      reset(); setShowForm(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ'),
  })

  const total = (revenues ?? []).reduce((s: number, r: any) => s + Number(r.amount), 0)

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>إيرادات المطعم</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>المبيعات اليومية داخل المطعم</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}><Plus size={16}/> إضافة إيراد</button>
      </div>

      <div className="card" style={{ padding: '16px 20px', marginBottom: 24 }}>
        <div className="kpi-label">إجمالي إيرادات المطعم</div>
        <div className="kpi-value" style={{ color: 'var(--color-primary)', fontSize: 28 }}>{formatSAR(total)}</div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
          <form onSubmit={handleSubmit((d) => {
            createMutation.mutate({
              ...d,
              amount: d.amount === '' ? 0 : Number(d.amount),
              covers: d.covers === '' ? null : Number(d.covers)
            })
          })} dir="rtl">
            <div className="form-section-header">
              <div className="form-section-number">١</div>
              <div className="form-section-title">بيانات الإيراد</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div className="form-field has-value"><label>التاريخ</label><input {...register('revenue_date')} type="date" className="form-input"/></div>
              <div className="form-field has-value"><label>المبلغ (ريال)</label><input {...register('amount')} type="number" step="0.01" className="form-input"/></div>
              <div className="form-field has-value"><label>عدد الأغطية</label><input {...register('covers')} type="number" className="form-input"/></div>
              <div className="form-field has-value">
                <label>طريقة الدفع</label>
                <select {...register('payment_method')} className="form-select">
                  <option value="كاش">كاش</option><option value="بنك">بنك</option><option value="آجل">آجل</option>
                </select>
              </div>
              <div className="form-field has-value" style={{ gridColumn: '2 / -1' }}><label>ملاحظات</label><input {...register('notes')} className="form-input"/></div>
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
          <thead><tr><th>التاريخ</th><th>المبلغ</th><th>الأغطية</th><th>طريقة الدفع</th></tr></thead>
          <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
            {(revenues ?? []).map((r: any) => (
              <motion.tr key={r.id} variants={staggerItem}>
                <td className="amount">{formatDate(r.revenue_date)}</td>
                <td className="amount" style={{ fontWeight: 700, color: 'var(--color-success)' }}>{formatSAR(r.amount)}</td>
                <td className="amount">{r.covers ?? '—'}</td>
                <td><span className="badge badge-neutral">{r.payment_method}</span></td>
              </motion.tr>
            ))}
            {!revenues?.length && <tr><td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>لا توجد بيانات</td></tr>}
          </motion.tbody>
        </table>
      </div>
    </PageTransition>
  )
}
