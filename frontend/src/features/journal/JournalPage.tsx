import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Plus, Minus, RotateCcw, CheckCircle, XCircle, Download } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { staggerContainer, staggerItem } from '../../lib/animations'
import { formatSAR, formatDate } from '../../lib/utils'
import { exportToExcel } from '../../lib/export'
import { useAuthStore } from '../../store/authStore'

interface JournalLine { account_code: string; debit_amount: number; credit_amount: number; description?: string }
interface FormData { entry_date: string; description: string; reference?: string; lines: JournalLine[] }

export default function JournalPage() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [reverseId, setReverseId] = useState<number | null>(null)
  const [reverseReason, setReverseReason] = useState('')

  const { data: entries, isLoading } = useQuery({
    queryKey: ['journal'],
    queryFn:  () => api.get('/journal').then(r => r.data.data),
  })

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn:  () => api.get('/accounts').then(r => r.data.data),
  })

  const { register, handleSubmit, control, watch, reset, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: {
      lines: [
        { account_code: '', debit_amount: 0, credit_amount: 0 },
        { account_code: '', debit_amount: 0, credit_amount: 0 },
      ],
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const lines = watch('lines') ?? []

  // Real-time balance
  const totalDebit  = lines.reduce((s, l) => s + (Number(l.debit_amount) || 0), 0)
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit_amount) || 0), 0)
  const diff        = Math.abs(totalDebit - totalCredit)
  const isBalanced  = diff < 0.001

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/journal', data),
    onSuccess: () => {
      toast.success('تم حفظ القيد المحاسبي')
      qc.invalidateQueries({ queryKey: ['journal'] })
      reset(); setShowForm(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ'),
  })

  const reverseMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      api.post(`/journal/${id}/reverse`, { reason }),
    onSuccess: () => {
      toast.success('تم عكس القيد بنجاح')
      qc.invalidateQueries({ queryKey: ['journal'] })
      setReverseId(null); setReverseReason('')
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ'),
  })

  const SOURCE_LABELS: Record<string, string> = {
    purchase: 'مشتريات', revenue: 'إيرادات', expense: 'مصروفات',
    reversal: 'عكس', manual: 'يدوي',
  }

  const handleExport = () => {
    const exportData = (entries ?? []).map((e: any) => ({
      'رقم القيد': e.entry_number,
      'التاريخ': formatDate(e.entry_date),
      'البيان': e.description,
      'المصدر': SOURCE_LABELS[e.source_type] ?? e.source_type,
      'المرجع': e.reference || '-',
      'المبلغ': Number(e.amount) || 0,
      'متوازن': e.is_balanced ? 'نعم' : 'لا',
      'الحالة': e.is_reversed ? 'مُعكوس' : 'فعّال'
    }))
    exportToExcel(exportData, 'قيود_اليومية')
  }

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>قيود اليومية</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>القيود المحاسبية مزدوجة القيد</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={handleExport} disabled={!entries?.length}>
            <Download size={16}/> تصدير Excel
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
            <Plus size={16}/> قيد جديد
          </button>
        </div>
      </div>

      {/* Manual entry form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir="rtl">
            <div className="form-section-header">
              <div className="form-section-number">١</div>
              <div className="form-section-title">بيانات القيد</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div className="form-field has-value">
                <label>التاريخ</label>
                <input {...register('entry_date')} type="date" className="form-input"/>
              </div>
              <div className="form-field has-value" style={{ gridColumn: '2 / -1' }}>
                <label>البيان</label>
                <input {...register('description')} className="form-input"/>
              </div>
              <div className="form-field has-value">
                <label>المرجع</label>
                <input {...register('reference')} className="form-input"/>
              </div>
            </div>

            {/* Lines */}
            <div className="form-section-header">
              <div className="form-section-number">٢</div>
              <div className="form-section-title">أسطر القيد</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr auto', gap: 10, marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', padding: '0 4px' }}>
                <span>الحساب</span>
                <span>مدين</span>
                <span>دائن</span>
                <span>البيان</span>
                <span/>
              </div>
              {fields.map((field, idx) => (
                <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr auto', gap: 10, marginBottom: 8, alignItems: 'center' }}>
                  <select {...register(`lines.${idx}.account_code`)} className="form-select" style={{ height: 42 }}>
                    <option value="">اختر الحساب</option>
                    {(accounts ?? []).map((a: any) => (
                      <option key={a.code} value={a.code}>{a.code} — {a.name_ar}</option>
                    ))}
                  </select>
                  <input {...register(`lines.${idx}.debit_amount`)} type="number" step="0.01" className="form-input amount-field" style={{ height: 42 }}/>
                  <input {...register(`lines.${idx}.credit_amount`)} type="number" step="0.01" className="form-input amount-field" style={{ height: 42 }}/>
                  <input {...register(`lines.${idx}.description`)} className="form-input" style={{ height: 42 }}/>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => fields.length > 2 && remove(idx)}
                    style={{ color: 'var(--color-danger)', width: 32, padding: 0, justifyContent: 'center' }}>
                    <Minus size={14}/>
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => append({ account_code: '', debit_amount: 0, credit_amount: 0 })}>
                <Plus size={14}/> إضافة سطر
              </button>
            </div>

            {/* Balance indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              borderRadius: 10, marginBottom: 20,
              background: isBalanced ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
              border: `1px solid ${isBalanced ? 'rgba(29,184,123,0.20)' : 'rgba(232,56,77,0.20)'}`,
            }}>
              {isBalanced
                ? <CheckCircle size={16} color="var(--color-success)"/>
                : <XCircle size={16} color="var(--color-danger)"/>}
              <span style={{ fontSize: 13, fontFamily: 'var(--font-arabic)' }}>
                {isBalanced
                  ? 'القيد متوازن ✓'
                  : `القيد غير متوازن — الفرق: ${diff.toFixed(4)} ريال`}
              </span>
              <div style={{ marginRight: 'auto', display: 'flex', gap: 16, fontFamily: 'var(--font-latin)', fontSize: 13 }}>
                <span>مدين: {totalDebit.toFixed(2)}</span>
                <span>دائن: {totalCredit.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); setShowForm(false) }}>إلغاء</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isBalanced}>
                {isSubmitting ? 'جارٍ الحفظ...' : '💾 حفظ القيد'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Entries table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontWeight: 600 }}>قيود اليومية</span>
        </div>
        {isLoading ? (
          <div style={{ padding: 24 }}>{[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }}/>)}</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>رقم القيد</th>
                <th>التاريخ</th>
                <th>البيان</th>
                <th>المصدر</th>
                <th>المرجع</th>
                <th>المبلغ</th>
                <th>متوازن</th>
                <th>الحالة</th>
                {user?.role === 'admin' && <th>عكس</th>}
              </tr>
            </thead>
            <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
              {(entries ?? []).map((e: any) => (
                <motion.tr key={e.id} variants={staggerItem}
                  style={{ opacity: e.is_reversed ? 0.5 : 1 }}>
                  <td style={{ fontFamily: 'var(--font-latin)', fontWeight: 600, color: 'var(--color-primary)' }}>{e.entry_number}</td>
                  <td>{formatDate(e.entry_date)}</td>
                  <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description}</td>
                  <td><span className="badge badge-info">{SOURCE_LABELS[e.source_type] ?? e.source_type}</span></td>
                  <td style={{ fontFamily: 'var(--font-latin)' }}>{e.reference || '-'}</td>
                  <td className="amount" style={{ fontWeight: 600 }}>{formatSAR(Number(e.amount) || 0)}</td>
                  <td>
                    {e.is_balanced
                      ? <CheckCircle size={15} color="var(--color-success)"/>
                      : <XCircle size={15} color="var(--color-danger)"/>}
                  </td>
                  <td>
                    {e.is_reversed
                      ? <span className="badge badge-danger">مُعكوس</span>
                      : <span className="badge badge-success">فعّال</span>}
                  </td>
                  {user?.role === 'admin' && (
                    <td>
                      {!e.is_reversed && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--color-warning)', gap: 4 }}
                          onClick={() => setReverseId(e.id)}
                        >
                          <RotateCcw size={13}/> عكس
                        </button>
                      )}
                    </td>
                  )}
                </motion.tr>
              ))}
              {!entries?.length && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>لا توجد قيود</td></tr>
              )}
            </motion.tbody>
          </table>
        )}
      </div>

      {/* Reverse dialog */}
      <ConfirmDialog
        open={reverseId !== null}
        title="عكس القيد"
        message="سيتم إنشاء قيد عكسي يُلغي أثر هذا القيد. هذا الإجراء لا يمكن التراجع عنه."
        onConfirm={() => reverseId && reverseMutation.mutate({ id: reverseId, reason: reverseReason || 'عكس يدوي' })}
        onCancel={() => setReverseId(null)}
        loading={reverseMutation.isPending}
      />
    </PageTransition>
  )
}
