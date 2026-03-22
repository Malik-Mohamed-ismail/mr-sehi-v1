import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, CheckCircle, XCircle, Download, Trash2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { staggerContainer, staggerItem } from '../../lib/animations'
import { exportToExcel } from '../../lib/export'
import { useTranslation } from 'react-i18next'
import i18n from '../../lib/i18n'
import { useAuthStore } from '../../store/authStore'

const schema = z.object({
  name_ar:    z.string().min(1, i18n.t('suppliers.validation.nameArRequired')),
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
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

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
      toast.success(t('suppliers.messages.createSuccess'))
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      reset(); setShowForm(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('suppliers.messages.error')),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/suppliers/${id}`),
    onSuccess: () => {
      toast.success(t('purchases.messages.deleteSuccess') || 'تم الحذف')
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      setDeleteId(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('suppliers.messages.error')),
  })

  const handleExport = () => {
    const exportData = (suppliers ?? []).map((s: any) => ({
      [i18n.t('suppliers.fields.nameAr')]: s.name_ar,
      [i18n.t('suppliers.fields.nameEn')]: s.name_en || '-',
      [i18n.t('suppliers.fields.category')]: i18n.t(`purchases.categories.${s.category || '-'}`) || '-',
      [i18n.t('suppliers.table.vatNumber')]: s.vat_number || i18n.t('suppliers.table.exempt'),
      [i18n.t('suppliers.table.phone')]: s.phone || '-',
      [i18n.t('suppliers.fields.email')]: s.email || '-',
      [i18n.t('suppliers.table.status')]: s.is_active ? i18n.t('suppliers.table.active') : i18n.t('suppliers.table.inactive')
    }))
    exportToExcel(exportData, i18n.t('suppliers.exportTitle'))
  }

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{t('suppliers.pageTitle')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>{t('suppliers.pageSubtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={handleExport} disabled={!suppliers?.length}>
            <Download size={16}/> {t('suppliers.table.export')}
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
            <Plus size={16}/> {t('suppliers.newSupplier')}
          </button>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir={i18n.dir()}>
            <div className="form-section-header">
              <div className="form-section-number">١</div>
              <div className="form-section-title">{t('suppliers.section1')}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div className="form-field has-value">
                <label>{t('suppliers.fields.nameAr')}</label>
                <input {...register('name_ar')} className={`form-input ${errors.name_ar ? 'is-error' : ''}`}/>
              </div>
              <div className="form-field has-value">
                <label>{t('suppliers.fields.nameEn')}</label>
                <input {...register('name_en')} className="form-input" dir="ltr"/>
              </div>
              <div className="form-field has-value">
                <label>{t('suppliers.fields.vatNumber')}</label>
                <input {...register('vat_number')} className="form-input" dir="ltr" placeholder="310xxxxxxxxxx"/>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{t('suppliers.fields.vatHelper')}</p>
              </div>
              <div className="form-field has-value">
                <label>{t('suppliers.fields.category')}</label>
                <select {...register('category')} className="form-select">
                  <option value="">{t('suppliers.fields.selectCategory')}</option>
                  {['مواد غذائية','خضار','بلاستيكيات','مشروبات','خبز','معدات مطبخ','مياه'].map(c => (
                    <option key={c} value={c}>{t(`purchases.categories.${c}`)}</option>
                  ))}
                </select>
              </div>
              <div className="form-field has-value">
                <label>{t('suppliers.fields.phone')}</label>
                <input {...register('phone')} className="form-input" dir="ltr"/>
              </div>
              <div className="form-field has-value">
                <label>{t('suppliers.fields.email')}</label>
                <input {...register('email')} className="form-input" dir="ltr"/>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); setShowForm(false) }}>{t('suppliers.buttons.cancel')}</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? t('suppliers.buttons.saving') : t('suppliers.buttons.save')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24 }}>{[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }}/>)}</div>
        ) : (
          <div style={{ overflow: 'auto', width: '100%', maxHeight: '500px' }}>
            <table className="data-table">
            <thead>
              <tr>
                <th>{t('suppliers.table.name')}</th>
                <th>{t('suppliers.table.category')}</th>
                <th>{t('suppliers.table.vatNumber')}</th>
                <th>{t('suppliers.table.phone')}</th>
                <th>{t('suppliers.table.vatStatus')}</th>
                <th>{t('suppliers.table.status')}</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
              {(suppliers ?? []).map((s: any) => (
                <motion.tr key={s.id} variants={staggerItem}>
                  <td style={{ fontWeight: 600 }}>{s.name_ar}</td>
                  <td>{s.category ? <span className="badge badge-info">{t(`purchases.categories.${s.category}`)}</span> : '—'}</td>
                  <td className="amount" style={{ fontSize: 12 }}>{s.vat_number ?? '—'}</td>
                  <td className="amount">{s.phone ?? '—'}</td>
                  <td>
                    {s.vat_number
                      ? <span style={{ display:'flex', alignItems:'center', gap:4, color:'var(--color-success)' }}><CheckCircle size={13}/> {t('suppliers.table.registered')}</span>
                      : <span style={{ display:'flex', alignItems:'center', gap:4, color:'var(--color-warning)' }}><XCircle size={13}/> {t('suppliers.table.exempt')}</span>}
                  </td>
                  <td>
                    <span className={`badge ${s.is_active ? 'badge-success' : 'badge-neutral'}`}>
                      {s.is_active ? t('suppliers.table.active') : t('suppliers.table.inactive')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <Link
                        to={`/suppliers/${s.id}/ledger`}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-primary)' }}
                        title="كشف الحساب"
                      >
                        <FileText size={14}/>
                      </Link>
                      {user?.role === 'admin' && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--color-danger)' }}
                          onClick={() => setDeleteId(s.id)}
                          title={t("purchases.delete.aria") || 'حذف'}
                        >
                          <Trash2 size={14}/>
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {!suppliers?.length && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>{t('suppliers.table.empty')}</td></tr>
              )}
            </motion.tbody>
          </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title={t("purchases.delete.title") || 'تأكيد الحذف'}
        message={t("purchases.delete.message") || 'هل أنت متأكد من الحذف؟'}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </PageTransition>
  )
}
