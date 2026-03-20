import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Plus, Download, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { staggerContainer, staggerItem } from '../../lib/animations'
import { formatSAR, formatDate } from '../../lib/utils'
import { exportToExcel } from '../../lib/export'

const schema = z.object({
  invoice_number: z.string().min(1),
  invoice_date:   z.string().min(1),
  supplier_id:    z.coerce.number().positive('يجب اختيار مورد'),
  category:       z.enum(['مواد غذائية', 'خضار', 'بلاستيكيات', 'مشروبات', 'خبز', 'معدات مطبخ', 'مياه']),
  item_name:      z.string().min(1),
  quantity:       z.coerce.number().positive(),
  unit_price:     z.coerce.number().positive(),
  discount:       z.coerce.number().min(0).default(0),
  payment_method: z.enum(['كاش', 'بنك', 'آجل']),
  is_asset:       z.boolean().default(false),
  notes:          z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function PurchasesPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn:  () => api.get('/suppliers').then(r => r.data.data),
  })

  const { data: purchases, isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn:  () => api.get('/purchases').then(r => r.data.data),
  })

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1, discount: 0, is_asset: false },
  })

  // Auto-compute subtotal, VAT, total
  const qty      = watch('quantity') ?? 0
  const price    = watch('unit_price') ?? 0
  const discount = watch('discount') ?? 0
  const suppId   = watch('supplier_id')
  const supplier = suppliers?.find((s: any) => s.id === Number(suppId))
  const hasVAT   = !!(supplier?.vat_number?.trim())
  const subtotal = Math.max(0, (qty * price) - discount)
  const vatAmt   = hasVAT ? parseFloat((subtotal * 0.15).toFixed(4)) : 0
  const total    = subtotal + vatAmt

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/purchases', data),
    onSuccess: () => {
      toast.success('تم حفظ الفاتورة وإنشاء القيد المحاسبي تلقائياً')
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      reset(); setShowForm(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/purchases/${id}`),
    onSuccess: () => {
      toast.success('تم حذف الفاتورة وعكس القيد المحاسبي')
      qc.invalidateQueries({ queryKey: ['purchases'] })
      setDeleteId(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ'),
  })

  const onSubmit = (data: FormData) => {
    createMutation.mutate({
      ...data,
      subtotal:     parseFloat(subtotal.toFixed(4)),
      vat_amount:   vatAmt,
      total_amount: parseFloat(total.toFixed(4)),
    })
  }

  const handleExport = () => {
    const exportData = (purchases ?? []).map((p: any) => {
      const supplier = suppliers?.find((s: any) => s.id === p.supplier_id)
      return {
        'رقم الفاتورة': p.invoice_number,
        'التاريخ': formatDate(p.invoice_date),
        'المورد': supplier?.name_ar || p.supplier_id,
        'الصنف': p.item_name,
        'التصنيف': p.category,
        'الكمية': p.quantity,
        'السعر': p.unit_price,
        'طريقة الدفع': p.payment_method,
        'المجموع': p.subtotal,
        'الضريبة': p.vat_amount,
        'الإجمالي': p.total_amount
      }
    })
    exportToExcel(exportData, 'مشتريات')
  }

  return (
    <PageTransition>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>إدخال المشتريات</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>تسجيل فواتير الموردين مع القيد المحاسبي التلقائي</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          <Plus size={16}/> فاتورة جديدة
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="card" style={{ marginBottom: 24 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
            {/* Section 1 */}
            <div className="form-section-header">
              <div className="form-section-number">١</div>
              <div className="form-section-title">بيانات الفاتورة</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div className="form-field has-value">
                <label>رقم الفاتورة</label>
                <input {...register('invoice_number')} className={`form-input ${errors.invoice_number ? 'is-error' : ''}`}/>
              </div>
              <div className="form-field has-value">
                <label>تاريخ الفاتورة</label>
                <input {...register('invoice_date')} type="date" className={`form-input ${errors.invoice_date ? 'is-error' : ''}`}/>
              </div>
              <div className="form-field has-value">
                <label>المورد</label>
                <select {...register('supplier_id')} className={`form-select ${errors.supplier_id ? 'is-error' : ''}`}>
                  <option value="">اختر المورد</option>
                  {suppliers?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name_ar}</option>
                  ))}
                </select>
              </div>
              <div className="form-field has-value">
                <label>التصنيف</label>
                <select {...register('category')} className={`form-select ${errors.category ? 'is-error' : ''}`}>
                  {['مواد غذائية','خضار','بلاستيكيات','مشروبات','خبز','معدات مطبخ','مياه'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-field has-value" style={{ gridColumn: '1 / -1' }}>
                <label>اسم الصنف</label>
                <input {...register('item_name')} className={`form-input ${errors.item_name ? 'is-error' : ''}`}/>
              </div>
            </div>

            {/* Section 2 */}
            <div className="form-section-header">
              <div className="form-section-number">٢</div>
              <div className="form-section-title">الكميات والأسعار</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-field has-value">
                <label>الكمية</label>
                <input {...register('quantity')} type="number" step="0.001" className="form-input"/>
              </div>
              <div className="form-field has-value">
                <label>سعر الوحدة</label>
                <input {...register('unit_price')} type="number" step="0.01" className="form-input"/>
              </div>
              <div className="form-field has-value">
                <label>الخصم</label>
                <input {...register('discount')} type="number" step="0.01" className="form-input"/>
              </div>
            </div>

            {/* Computed readonly fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div className="form-field has-value">
                <label style={{ color: 'var(--color-success)' }}>المجموع قبل الضريبة</label>
                <input readOnly value={subtotal.toFixed(2)} className="form-input amount-field"/>
              </div>
              <div className="form-field has-value">
                <label style={{ color: 'var(--color-success)' }}>
                  ضريبة القيمة المضافة 15%
                  {!hasVAT && <span style={{ fontSize: 10, color: 'var(--color-warning)', marginRight: 4 }}>(معفى)</span>}
                </label>
                <input readOnly value={vatAmt.toFixed(2)} className="form-input amount-field"/>
              </div>
              <div className="form-field has-value">
                <label style={{ color: 'var(--color-success)' }}>الإجمالي</label>
                <input readOnly value={total.toFixed(2)} className="form-input amount-field" style={{ fontSize: 16, fontWeight: 700 }}/>
              </div>
            </div>

            {/* Section 3 */}
            <div className="form-section-header">
              <div className="form-section-number">٣</div>
              <div className="form-section-title">طريقة الدفع</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div className="form-field has-value">
                <label>طريقة الدفع</label>
                <select {...register('payment_method')} className={`form-select ${errors.payment_method ? 'is-error' : ''}`}>
                  <option value="كاش">كاش</option>
                  <option value="بنك">بنك</option>
                  <option value="آجل">آجل</option>
                </select>
              </div>
              <div className="form-field has-value" style={{ display: 'flex', alignItems: 'center', paddingTop: 12 }}>
                <label style={{ position: 'static', transform: 'none', fontSize: 14, padding: 0, marginLeft: 8 }}>
                  <input {...register('is_asset')} type="checkbox" style={{ marginLeft: 6 }}/>
                  أصل ثابت (معدات / أثاث)
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); setShowForm(false) }}>إلغاء</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'جارٍ الحفظ...' : '💾 حفظ الفاتورة'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>سجل الفواتير</span>
          <button className="btn btn-secondary btn-sm" onClick={handleExport} disabled={!purchases?.length}>
            <Download size={14}/> تصدير Excel
          </button>
        </div>
        {isLoading ? (
          <div style={{ padding: 24 }}>
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }}/>)}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>التاريخ</th>
                <th>المورد</th>
                <th>الصنف</th>
                <th>طريقة الدفع</th>
                <th>المجموع</th>
                <th>الضريبة</th>
                <th>الإجمالي</th>
                <th></th>
              </tr>
            </thead>
            <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
              {(purchases ?? []).map((p: any) => (
                <motion.tr key={p.id} variants={staggerItem}>
                  <td style={{ fontFamily: 'var(--font-latin)', fontWeight: 600 }}>{p.invoice_number}</td>
                  <td className="amount">{formatDate(p.invoice_date)}</td>
                  <td>{p.supplier_id}</td>
                  <td>{p.item_name}</td>
                  <td>
                    <span className={`badge ${p.payment_method === 'آجل' ? 'badge-warning' : p.payment_method === 'بنك' ? 'badge-info' : 'badge-success'}`}>
                      {p.payment_method}
                    </span>
                  </td>
                  <td className="amount">{formatSAR(p.subtotal)}</td>
                  <td className="amount">{formatSAR(p.vat_amount)}</td>
                  <td className="amount" style={{ fontWeight: 700 }}>{formatSAR(p.total_amount)}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--color-danger)' }}
                      onClick={() => setDeleteId(p.id)}
                      aria-label="حذف الفاتورة"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </td>
                </motion.tr>
              ))}
              {!purchases?.length && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>لا توجد فواتير</td></tr>
              )}
            </motion.tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="حذف الفاتورة"
        message="سيتم حذف الفاتورة وعكس القيد المحاسبي تلقائياً. هذا الإجراء لا يمكن التراجع عنه."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </PageTransition>
  )
}
