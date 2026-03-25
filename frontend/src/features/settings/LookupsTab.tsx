import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { api } from '../../lib/api'
import { useTranslation } from 'react-i18next'
import i18n from '../../lib/i18n'
import { staggerContainer, staggerItem } from '../../lib/animations'

type LookupType = 'platform' | 'payment_method' | 'category' | 'product_name'

const LOOKUP_TYPES: { value: LookupType, label: string }[] = [
  { value: 'platform', label: 'منصات التوصيل (Platforms)' },
  { value: 'payment_method', label: 'طرق الدفع (Payment Methods)' },
  { value: 'category', label: 'التصنيفات (Categories)' },
  { value: 'product_name', label: 'المنتجات (Products)' },
]

export function LookupsTab() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [activeType, setActiveType] = useState<LookupType>('platform')
  const [showForm, setShowForm] = useState(false)

  const { data: lookups, isLoading } = useQuery({
    queryKey: ['lookups', activeType],
    queryFn: () => api.get(`/lookups?type=${activeType}`).then(r => r.data.data),
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { name_ar: '', name_en: '' }
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/lookups', { ...data, type: activeType }),
    onSuccess: () => {
      toast.success('تم الإضافة بنجاح')
      qc.invalidateQueries({ queryKey: ['lookups', activeType] })
      reset()
      setShowForm(false)
    },
    onError: () => toast.error('حدث خطأ أثناء الإضافة')
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/lookups/${id}`),
    onSuccess: () => {
      toast.success('تم الحذف بنجاح')
      qc.invalidateQueries({ queryKey: ['lookups', activeType] })
    },
    onError: () => toast.error('حدث خطأ أثناء الحذف')
  })

  return (
    <>
      <div className="card" style={{ marginBottom: 20, padding: '16px 20px', display: 'flex', gap: 12, overflowX: 'auto' }}>
        {LOOKUP_TYPES.map(type => (
          <button
            key={type.value}
            onClick={() => { setActiveType(type.value); setShowForm(false); }}
            className={`btn ${activeType === type.value ? 'btn-primary' : 'btn-secondary'}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {type.label}
          </button>
        ))}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 20 }}>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir={i18n.dir()}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16, marginBottom: 20 }}>
              <div className="form-field has-value">
                <label>الاسم (بالعربي)</label>
                <input {...register('name_ar', { required: true })} className="form-input" />
              </div>
              <div className="form-field has-value">
                <label>Name (English)</label>
                <input {...register('name_en', { required: true })} className="form-input" dir="ltr" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontWeight: 700 }}>إدارة {LOOKUP_TYPES.find(t => t.value === activeType)?.label}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(s => !s)} disabled={showForm}>
            <Plus size={14} /> إضافة جديد
          </button>
        </div>
        
        {isLoading ? (
          <div style={{ padding: 20 }}>{[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }}/>)}</div>
        ) : (
          <div style={{ overflow: 'auto', width: '100%', maxHeight: '500px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>الاسم (بالعربي)</th>
                  <th style={{ fontFamily: 'var(--font-latin)' }}>Name (English)</th>
                  <th style={{ width: 80 }}>الإجراء</th>
                </tr>
              </thead>
              <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
                {(lookups ?? []).map((item: any) => (
                  <motion.tr key={item.id} variants={staggerItem}>
                    <td style={{ fontWeight: 600 }}>{item.name_ar}</td>
                    <td style={{ fontFamily: 'var(--font-latin)', color: 'var(--text-secondary)' }}>{item.name_en}</td>
                    <td>
                      <button 
                        className="btn btn-ghost btn-sm" 
                        style={{ color: 'var(--color-danger)' }} 
                        onClick={() => {
                          if (confirm('هل أنت متأكد من الحذف؟')) {
                            deleteMutation.mutate(item.id)
                          }
                        }}
                      >
                        <Trash2 size={14}/>
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {!lookups?.length && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: 30, color: 'var(--text-secondary)' }}>لا توجد بيانات مسجلة</td></tr>
                )}
              </motion.tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
