import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Plus, Download } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { staggerContainer, staggerItem } from '../../lib/animations'
import { formatSAR, formatDate } from '../../lib/utils'
import { exportToExcel } from '../../lib/export'

export default function ProductionPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: records, isLoading } = useQuery({
    queryKey: ['production'],
    queryFn: () => api.get('/production').then(r => r.data.data),
  })

  const { data: summary } = useQuery({
    queryKey: ['production-summary'],
    queryFn: () => api.get('/production/summary').then(r => r.data.data),
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { production_date: '', product_name: '', produced_kg: '', waste_grams: 0, waste_value: 0, unit_cost: '', notes: '' },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/production', data),
    onSuccess: () => {
      toast.success('تم تسجيل الإنتاج')
      qc.invalidateQueries({ queryKey: ['production'] })
      qc.invalidateQueries({ queryKey: ['production-summary'] })
      reset(); setShowForm(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ'),
  })

  const handleExport = () => {
    const exportData = (records ?? []).map((r: any) => ({
      'التاريخ': formatDate(r.production_date),
      'المنتج': r.product_name,
      'الإنتاج (كجم)': r.produced_kg,
      'التالف (جم)': r.waste_grams,
      'قيمة التالف': r.waste_value
    }))
    exportToExcel(exportData, 'سجل_الإنتاج')
  }

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>الإنتاج والتالف</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>متابعة الإنتاج اليومي ونسبة الهدر</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={handleExport} disabled={!records?.length}>
            <Download size={16}/> تصدير Excel
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}><Plus size={16}/> تسجيل إنتاج</button>
        </div>
      </div>

      {/* Summary */}
      {summary?.length > 0 && (
        <div className="card" style={{ marginBottom: 24, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>ملخص الإنتاج</div>
          <table className="data-table">
            <thead><tr><th>المنتج</th><th>الإنتاج (كجم)</th><th>التالف (جم)</th><th>قيمة التالف</th><th>نسبة التالف</th></tr></thead>
            <tbody>
              {(summary ?? []).map((s: any) => (
                <tr key={s.product_name}>
                  <td style={{ fontWeight: 600 }}>{s.product_name}</td>
                  <td className="amount">{Number(s.total_kg).toFixed(2)}</td>
                  <td className="amount">{Number(s.total_waste_grams).toFixed(0)}</td>
                  <td className="amount" style={{ color: 'var(--color-danger)' }}>{formatSAR(s.total_waste_value)}</td>
                  <td className="amount">
                    <span className={`badge ${Number(s.waste_pct) > 5 ? 'badge-danger' : 'badge-success'}`}>
                      {Number(s.waste_pct).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir="rtl">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div className="form-field has-value"><label>التاريخ</label><input {...register('production_date')} type="date" className="form-input"/></div>
              <div className="form-field has-value"><label>اسم المنتج</label><input {...register('product_name')} className="form-input"/></div>
              <div className="form-field has-value"><label>الإنتاج (كجم)</label><input {...register('produced_kg')} type="number" step="0.001" className="form-input"/></div>
              <div className="form-field has-value"><label>التالف (جرام)</label><input {...register('waste_grams')} type="number" step="1" className="form-input"/></div>
              <div className="form-field has-value"><label>قيمة التالف (ريال)</label><input {...register('waste_value')} type="number" step="0.01" className="form-input"/></div>
              <div className="form-field has-value"><label>سعر التكلفة/كجم</label><input {...register('unit_cost')} type="number" step="0.01" className="form-input"/></div>
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
          <thead><tr><th>التاريخ</th><th>المنتج</th><th>الإنتاج (كجم)</th><th>التالف (جم)</th><th>قيمة التالف</th></tr></thead>
          <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
            {(records ?? []).map((r: any) => (
              <motion.tr key={r.id} variants={staggerItem}>
                <td className="amount">{formatDate(r.production_date)}</td>
                <td style={{ fontWeight: 600 }}>{r.product_name}</td>
                <td className="amount">{Number(r.produced_kg).toFixed(3)}</td>
                <td className="amount">{Number(r.waste_grams).toFixed(0)}</td>
                <td className="amount" style={{ color: 'var(--color-danger)' }}>{formatSAR(r.waste_value)}</td>
              </motion.tr>
            ))}
            {!records?.length && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>لا توجد بيانات</td></tr>}
          </motion.tbody>
        </table>
      </div>
    </PageTransition>
  )
}
