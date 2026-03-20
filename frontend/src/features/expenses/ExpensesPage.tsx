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

const EXPENSE_ACCOUNTS = [
  { code: '5201', name: 'رواتب وأجور' },
  { code: '5202', name: 'إيجار' },
  { code: '5203', name: 'كهرباء وماء' },
  { code: '5204', name: 'صيانة' },
  { code: '5205', name: 'تسويق وإعلان' },
  { code: '5206', name: 'نقل ومواصلات' },
  { code: '5207', name: 'اتصالات وانترنت' },
  { code: '5208', name: 'مصاريف إدارية' },
  { code: '5209', name: 'مصاريف متنوعة' },
  { code: '5210', name: 'تالف وهدر' },
]

export default function ExpensesPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => api.get('/expenses').then(r => r.data.data),
  })

  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { expense_date: '', account_code: '5201', expense_type: 'ثابت', description: '', amount: 0, payment_method: 'بنك', has_vat: false },
  })

  const amount  = watch('amount') ?? 0
  const hasVAT  = watch('has_vat')
  const vatAmt  = hasVAT ? parseFloat((Number(amount) * 0.15).toFixed(4)) : 0
  const total   = Number(amount) + vatAmt

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/expenses', { ...data, amount: Number(data.amount) }),
    onSuccess: () => {
      toast.success('تم حفظ المصروف')
      qc.invalidateQueries({ queryKey: ['expenses'] })
      reset(); setShowForm(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ'),
  })

  const handleExport = () => {
    const exportData = (expenses ?? []).map((e: any) => ({
      'التاريخ': formatDate(e.expense_date),
      'البيان': e.description,
      'النوع': e.expense_type,
      'طريقة الدفع': e.payment_method,
      'المبلغ': e.amount,
      'الضريبة': e.vat_amount,
      'الإجمالي': e.total_amount
    }))
    exportToExcel(exportData, 'المصروفات')
  }

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>إدخال المصروفات</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>تسجيل المصروفات التشغيلية مع القيد المحاسبي</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={handleExport} disabled={!expenses?.length}>
            <Download size={16}/> تصدير Excel
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}><Plus size={16}/> مصروف جديد</button>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir="rtl">
            <div className="form-section-header">
              <div className="form-section-number">١</div>
              <div className="form-section-title">بيانات المصروف</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-field has-value"><label>التاريخ</label><input {...register('expense_date')} type="date" className="form-input"/></div>
              <div className="form-field has-value">
                <label>الحساب</label>
                <select {...register('account_code')} className="form-select">
                  {EXPENSE_ACCOUNTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}
                </select>
              </div>
              <div className="form-field has-value">
                <label>نوع المصروف</label>
                <select {...register('expense_type')} className="form-select">
                  <option value="ثابت">ثابت</option>
                  <option value="متغير">متغير</option>
                  <option value="تشغيلي">تشغيلي</option>
                  <option value="طارئ">طارئ</option>
                </select>
              </div>
              <div className="form-field has-value">
                <label>طريقة الدفع</label>
                <select {...register('payment_method')} className="form-select">
                  <option value="كاش">كاش</option><option value="بنك">بنك</option><option value="آجل">آجل</option>
                </select>
              </div>
              <div className="form-field has-value" style={{ gridColumn: '1 / -1' }}><label>البيان</label><input {...register('description')} className="form-input"/></div>
              <div className="form-field has-value"><label>المبلغ</label><input {...register('amount')} type="number" step="0.01" className="form-input"/></div>
              <div className="form-field has-value" style={{ display: 'flex', alignItems: 'center', paddingTop: 12 }}>
                <label style={{ position: 'static', transform: 'none', fontSize: 14, padding: 0 }}>
                  <input {...register('has_vat')} type="checkbox" style={{ marginLeft: 8 }}/>
                  يشمل ضريبة القيمة المضافة 15%
                </label>
              </div>
            </div>
            {hasVAT && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-field has-value"><label style={{ color: 'var(--color-success)' }}>الضريبة</label><input readOnly value={vatAmt.toFixed(2)} className="form-input amount-field"/></div>
                <div className="form-field has-value"><label style={{ color: 'var(--color-success)' }}>الإجمالي</label><input readOnly value={total.toFixed(2)} className="form-input amount-field" style={{ fontWeight: 700 }}/></div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); setShowForm(false) }}>إلغاء</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'جارٍ الحفظ...' : '💾 حفظ المصروف'}</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? <div style={{ padding: 24 }}>{[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }}/>)}</div> : (
          <table className="data-table">
            <thead><tr><th>التاريخ</th><th>البيان</th><th>النوع</th><th>طريقة الدفع</th><th>المبلغ</th><th>الضريبة</th><th>الإجمالي</th></tr></thead>
            <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
              {(expenses ?? []).map((e: any) => (
                <motion.tr key={e.id} variants={staggerItem}>
                  <td className="amount">{formatDate(e.expense_date)}</td>
                  <td>{e.description}</td>
                  <td><span className="badge badge-warning">{e.expense_type}</span></td>
                  <td><span className="badge badge-neutral">{e.payment_method}</span></td>
                  <td className="amount">{formatSAR(e.amount)}</td>
                  <td className="amount">{formatSAR(e.vat_amount)}</td>
                  <td className="amount" style={{ fontWeight: 700 }}>{formatSAR(e.total_amount)}</td>
                </motion.tr>
              ))}
              {!expenses?.length && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>لا توجد بيانات</td></tr>}
            </motion.tbody>
          </table>
        )}
      </div>
    </PageTransition>
  )
}
