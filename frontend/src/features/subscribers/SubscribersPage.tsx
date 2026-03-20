import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Plus, RefreshCw, AlertTriangle, Users } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { staggerContainer, staggerItem } from '../../lib/animations'
import { formatSAR, formatDate } from '../../lib/utils'

const schema = z.object({
  name:           z.string().min(1, 'الاسم مطلوب'),
  phone:          z.string().optional(),
  plan_name:      z.string().optional(),
  plan_amount:    z.coerce.number().positive('المبلغ مطلوب'),
  start_date:     z.string().min(1, 'تاريخ البداية مطلوب'),
  end_date:       z.string().min(1, 'تاريخ النهاية مطلوب'),
  payment_method: z.enum(['كاش', 'بنك', 'آجل']),
  notes:          z.string().optional(),
})
type FormData = z.infer<typeof schema>

const STATUS_STYLES: Record<string, { label: string; badge: string }> = {
  active:    { label: 'نشط',    badge: 'badge-success' },
  expired:   { label: 'منتهي', badge: 'badge-danger' },
  cancelled: { label: 'ملغي',  badge: 'badge-neutral' },
}

export default function SubscribersPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['subscribers'],
    queryFn:  () => api.get('/subscribers').then(r => r.data.data),
  })

  const { data: expiring } = useQuery({
    queryKey: ['subscribers-expiring'],
    queryFn:  () => api.get('/subscribers/expiring?days=7').then(r => r.data.data),
  })

  const { data: stats } = useQuery({
    queryKey: ['subscribers-stats'],
    queryFn:  () => api.get('/subscribers/stats').then(r => r.data.data),
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { payment_method: 'بنك' },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/subscribers', data),
    onSuccess: () => {
      toast.success('تم إضافة المشترك')
      qc.invalidateQueries({ queryKey: ['subscribers'] })
      reset(); setShowForm(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ'),
  })

  const renewMutation = useMutation({
    mutationFn: (id: number) => api.post(`/subscribers/${id}/renew`),
    onSuccess: () => {
      toast.success('تم تجديد الاشتراك وإنشاء قيد الإيراد تلقائياً')
      qc.invalidateQueries({ queryKey: ['subscribers'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ'),
  })

  const filtered = (subscribers ?? []).filter((s: any) =>
    filter === 'all' ? true : s.status === filter
  )

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>متابعة الاشتراكات</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>إدارة المشتركين وتجديد الاشتراكات</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          <Plus size={16}/> مشترك جديد
        </button>
      </div>

      {/* Expiring alert */}
      {expiring?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="alert alert-warning" style={{ marginBottom: 20, gap: 12 }}>
          <AlertTriangle size={16}/>
          <span>
            <strong>{expiring.length} مشتركين</strong> تنتهي اشتراكاتهم خلال 7 أيام
          </span>
        </motion.div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="kpi-label">المشتركون النشطون</div>
          <div className="kpi-value" style={{ color: 'var(--color-success)', fontSize: 28 }}>{stats?.active ?? 0}</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="kpi-label">المنتهية اشتراكاتهم</div>
          <div className="kpi-value" style={{ color: 'var(--color-danger)', fontSize: 28 }}>{stats?.expired ?? 0}</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="kpi-label">الدخل الشهري (MRR)</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>{formatSAR(stats?.active_mrr ?? 0)}</div>
        </div>
      </div>

      {/* New subscriber form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir="rtl">
            <div className="form-section-header">
              <div className="form-section-number">١</div>
              <div className="form-section-title">بيانات المشترك</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-field has-value">
                <label>اسم المشترك</label>
                <input {...register('name')} className={`form-input ${errors.name ? 'is-error' : ''}`}/>
              </div>
              <div className="form-field has-value">
                <label>رقم الجوال</label>
                <input {...register('phone')} className="form-input" dir="ltr"/>
              </div>
              <div className="form-field has-value">
                <label>اسم الباقة</label>
                <input {...register('plan_name')} className="form-input"/>
              </div>
              <div className="form-field has-value">
                <label>قيمة الاشتراك (ريال)</label>
                <input {...register('plan_amount')} type="number" step="0.01" className={`form-input ${errors.plan_amount ? 'is-error' : ''}`}/>
              </div>
              <div className="form-field has-value">
                <label>تاريخ البداية</label>
                <input {...register('start_date')} type="date" className={`form-input ${errors.start_date ? 'is-error' : ''}`}/>
              </div>
              <div className="form-field has-value">
                <label>تاريخ النهاية</label>
                <input {...register('end_date')} type="date" className={`form-input ${errors.end_date ? 'is-error' : ''}`}/>
              </div>
              <div className="form-field has-value">
                <label>طريقة الدفع</label>
                <select {...register('payment_method')} className="form-select">
                  <option value="كاش">كاش</option>
                  <option value="بنك">بنك</option>
                  <option value="آجل">آجل</option>
                </select>
              </div>
              <div className="form-field has-value">
                <label>ملاحظات</label>
                <input {...register('notes')} className="form-input"/>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); setShowForm(false) }}>إلغاء</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'جارٍ الحفظ...' : '💾 حفظ المشترك'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { key: 'all', label: 'الكل' },
          { key: 'active', label: 'نشط' },
          { key: 'expired', label: 'منتهي' },
          { key: 'cancelled', label: 'ملغي' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`btn btn-sm ${filter === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>المشترك</th>
              <th>الجوال</th>
              <th>الباقة</th>
              <th>تاريخ الانتهاء</th>
              <th>القيمة</th>
              <th>الحالة</th>
              <th>الإجراء</th>
            </tr>
          </thead>
          <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
            {(filtered ?? []).map((s: any) => (
              <motion.tr key={s.id} variants={staggerItem}>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td className="amount">{s.phone ?? '—'}</td>
                <td>{s.plan_name ?? '—'}</td>
                <td className="amount">{formatDate(s.end_date)}</td>
                <td className="amount">{formatSAR(s.plan_amount)}</td>
                <td>
                  <span className={`badge ${STATUS_STYLES[s.status]?.badge ?? 'badge-neutral'}`}>
                    {STATUS_STYLES[s.status]?.label ?? s.status}
                  </span>
                </td>
                <td>
                  {s.status !== 'cancelled' && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--color-primary)', gap: 4 }}
                      onClick={() => renewMutation.mutate(s.id)}
                      disabled={renewMutation.isPending}
                      title="تجديد الاشتراك"
                    >
                      <RefreshCw size={13}/> تجديد
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
            {!filtered?.length && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>لا توجد بيانات</td></tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </PageTransition>
  )
}
