import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Plus, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { staggerContainer, staggerItem } from '../../lib/animations'

const schema = z.object({
  name_ar:    z.string().min(1, 'الاسم العربي مطلوب'),
  name_en:    z.string().optional(),
  vat_number: z.string().optional().nullable(),
  phone:      z.string().optional(),
  email:      z.string().email().optional().or(z.literal('')),
  category:   z.string().optional(),
  notes:      z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function SuppliersPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn:  () => api.get('/suppliers').then(r => r.data.data),
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/suppliers', data),
    onSuccess: () => {
      toast.success('تم إضافة المورد')
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      reset(); setShowForm(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ'),
  })

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>الموردين</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>إدارة بيانات الموردين وأرقام ضريبة القيمة المضافة</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          <Plus size={16}/> مورد جديد
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir="rtl">
            <div className="form-section-header">
              <div className="form-section-number">١</div>
              <div className="form-section-title">بيانات المورد</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div className="form-field has-value">
                <label>الاسم بالعربي</label>
                <input {...register('name_ar')} className={`form-input ${errors.name_ar ? 'is-error' : ''}`}/>
              </div>
              <div className="form-field has-value">
                <label>الاسم بالإنجليزي</label>
                <input {...register('name_en')} className="form-input" dir="ltr"/>
              </div>
              <div className="form-field has-value">
                <label>رقم ضريبة القيمة المضافة</label>
                <input {...register('vat_number')} className="form-input" dir="ltr" placeholder="310xxxxxxxxxx"/>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>اتركه فارغاً إذا كان المورد معفى من الضريبة</p>
              </div>
              <div className="form-field has-value">
                <label>التصنيف</label>
                <select {...register('category')} className="form-select">
                  <option value="">اختر التصنيف</option>
                  {['مواد غذائية','خضار','بلاستيكيات','مشروبات','خبز','معدات مطبخ','مياه'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-field has-value">
                <label>الجوال</label>
                <input {...register('phone')} className="form-input" dir="ltr"/>
              </div>
              <div className="form-field has-value">
                <label>البريد الإلكتروني</label>
                <input {...register('email')} className="form-input" dir="ltr"/>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); setShowForm(false) }}>إلغاء</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'جارٍ الحفظ...' : '💾 حفظ المورد'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24 }}>{[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }}/>)}</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>اسم المورد</th>
                <th>التصنيف</th>
                <th>رقم الضريبة</th>
                <th>الجوال</th>
                <th>ضريبة القيمة المضافة</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
              {(suppliers ?? []).map((s: any) => (
                <motion.tr key={s.id} variants={staggerItem}>
                  <td style={{ fontWeight: 600 }}>{s.name_ar}</td>
                  <td>{s.category ? <span className="badge badge-info">{s.category}</span> : '—'}</td>
                  <td className="amount" style={{ fontSize: 12 }}>{s.vat_number ?? '—'}</td>
                  <td className="amount">{s.phone ?? '—'}</td>
                  <td>
                    {s.vat_number
                      ? <span style={{ display:'flex', alignItems:'center', gap:4, color:'var(--color-success)' }}><CheckCircle size={13}/> مسجل</span>
                      : <span style={{ display:'flex', alignItems:'center', gap:4, color:'var(--color-warning)' }}><XCircle size={13}/> معفى</span>}
                  </td>
                  <td>
                    <span className={`badge ${s.is_active ? 'badge-success' : 'badge-neutral'}`}>
                      {s.is_active ? 'نشط' : 'معطّل'}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {!suppliers?.length && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>لا يوجد موردون</td></tr>
              )}
            </motion.tbody>
          </table>
        )}
      </div>
    </PageTransition>
  )
}
