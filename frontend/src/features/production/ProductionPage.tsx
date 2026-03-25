import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Plus, Download, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { staggerContainer, staggerItem } from '../../lib/animations'
import { formatSAR, formatDate } from '../../lib/utils'
import { useTranslation } from 'react-i18next'
import i18n from '../../lib/i18n'
import { exportToExcel } from '../../lib/export'
import { useAuthStore } from '../../store/authStore'

export default function ProductionPage() {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: records, isLoading } = useQuery({
    queryKey: ['production'],
    queryFn: () => api.get('/production').then(r => r.data.data),
  })

  const { data: products = [] } = useQuery({
    queryKey: ['lookups', 'product_name'],
    queryFn: () => api.get('/lookups?type=product_name').then(r => r.data.data),
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
      toast.success(t('production.messages.createSuccess'))
      qc.invalidateQueries({ queryKey: ['production'] })
      qc.invalidateQueries({ queryKey: ['production-summary'] })
      reset(); setShowForm(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('production.messages.error')),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/production/${id}`),
    onSuccess: () => {
      toast.success(t('purchases.messages.deleteSuccess') || 'تم الحذف')
      qc.invalidateQueries({ queryKey: ['production'] })
      qc.invalidateQueries({ queryKey: ['production-summary'] })
      setDeleteId(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('production.messages.error')),
  })

  const handleExport = () => {
    const exportData = (records ?? []).map((r: any) => ({
      [i18n.t('production.table.date')]: formatDate(r.production_date),
      [i18n.t('production.table.product')]: r.product_name,
      [i18n.t('production.table.productionKg')]: r.produced_kg,
      [i18n.t('production.table.wasteGrams')]: r.waste_grams,
      [i18n.t('production.table.wasteValue')]: r.waste_value
    }))
    exportToExcel(exportData, i18n.t('production.exportTitle'))
  }

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{t('production.pageTitle')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{t('production.pageSubtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={handleExport} disabled={!records?.length}>
            <Download size={16}/> تصدير Excel
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}><Plus size={16}/> {t('production.newProduction')}</button>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
          <div className="form-card-header">
            <span className="form-card-header-title">➕ {t('production.newProduction')}</span>
            <button type="button" className="form-close-btn" onClick={() => { reset(); setShowForm(false) }} title="إغلاق"><X size={16}/></button>
          </div>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir={i18n.dir()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div className="form-field has-value"><label>{t('production.fields.date')}</label><input {...register('production_date')} type="date" className="form-input"/></div>
              <div className="form-field has-value">
                <label>{t('production.fields.productName')}</label>
                <select {...register('product_name', { required: true })} className="form-select">
                  <option value="">اختر المنتج...</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.name_ar}>{i18n.language === 'ar' ? p.name_ar : p.name_en}</option>
                  ))}
                </select>
              </div>
              <div className="form-field has-value"><label>{t('production.fields.producedKg')}</label><input {...register('produced_kg')} type="number" step="0.001" className="form-input"/></div>
              <div className="form-field has-value"><label>{t('production.fields.wasteGrams')}</label><input {...register('waste_grams')} type="number" step="1" className="form-input"/></div>
              <div className="form-field has-value"><label>{t('production.fields.wasteValue')}</label><input {...register('waste_value')} type="number" step="0.01" className="form-input"/></div>
              <div className="form-field has-value"><label>{t('production.fields.unitCost')}</label><input {...register('unit_cost')} type="number" step="0.01" className="form-input"/></div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); setShowForm(false) }}>{t('production.buttons.cancel')}</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? t('production.buttons.saving') : t('production.buttons.save')}</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Summary */}
      {summary?.length > 0 && (
        <div className="card" style={{ marginBottom: 24, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>{t('production.section1')}</div>
          <div style={{ overflow: 'auto', width: '100%', maxHeight: '500px' }}>
            <style>{`.summary-table th, .summary-table td { border: 1px solid var(--border-color); }`}</style>
            <table className="data-table summary-table">
            <thead><tr><th>{t('production.table.product')}</th><th>{t('production.table.productionKg')}</th><th>{t('production.table.wasteGrams')}</th><th>{t('production.table.wasteValue')}</th><th>{t('production.table.wastePct')}</th></tr></thead>
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
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflow: 'auto', width: '100%', maxHeight: '500px' }}>
            <table className="data-table">
          <thead><tr><th>{t('production.table.date')}</th><th>{t('production.table.product')}</th><th>{t('production.table.productionKg')}</th><th>{t('production.table.wasteGrams')}</th><th>{t('production.table.wasteValue')}</th><th style={{ width: 60 }}></th></tr></thead>
          <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
            {(records ?? []).map((r: any) => (
              <motion.tr key={r.id} variants={staggerItem}>
                <td className="amount">{formatDate(r.production_date)}</td>
                <td style={{ fontWeight: 600 }}>{r.product_name}</td>
                <td className="amount">{Number(r.produced_kg).toFixed(3)}</td>
                <td className="amount">{Number(r.waste_grams).toFixed(0)}</td>
                <td className="amount" style={{ color: 'var(--color-danger)' }}>{formatSAR(r.waste_value)}</td>
                <td>
                  {user?.role === 'admin' && (
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)} title={t("purchases.delete.aria") || 'حذف'}><Trash2 size={14}/></button>
                  )}
                </td>
              </motion.tr>
            ))}
            {!records?.length && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>{t('production.table.empty')}</td></tr>}
          </motion.tbody>
        </table>
          </div>
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
