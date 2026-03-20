import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { staggerContainer, staggerItem } from '../../lib/animations'

const TYPE_LABELS: Record<string, { label: string; badge: string }> = {
  asset:     { label: 'أصول',     badge: 'badge-info' },
  liability: { label: 'التزامات', badge: 'badge-danger' },
  equity:    { label: 'حقوق ملكية', badge: 'badge-warning' },
  revenue:   { label: 'إيرادات',  badge: 'badge-success' },
  expense:   { label: 'مصروفات',  badge: 'badge-neutral' },
}

export default function AccountsPage() {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then(r => r.data.data),
  })

  const grouped = (accounts ?? []).reduce((acc: any, a: any) => {
    const type = a.type ?? 'other'
    if (!acc[type]) acc[type] = []
    acc[type].push(a)
    return acc
  }, {})

  return (
    <PageTransition>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>دليل الحسابات</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>Chart of Accounts — {accounts?.length ?? 0} حساب</p>
      </div>

      {isLoading ? (
        <div>{[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }}/>)}</div>
      ) : (
        Object.entries(TYPE_LABELS).map(([type, meta]) => {
          const items = grouped[type] ?? []
          if (!items.length) return null
          return (
            <div key={type} className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '12px 20px', borderBottom: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--bg-surface-2)',
              }}>
                <BookOpen size={15} color="var(--color-primary)"/>
                <span style={{ fontWeight: 700 }}>{meta.label}</span>
                <span className={`badge ${meta.badge}`} style={{ marginRight: 'auto' }}>{items.length} حساب</span>
              </div>
              <table className="data-table">
                <thead><tr><th>الكود</th><th>اسم الحساب</th><th>Account Name</th><th>المستوى</th><th>النظام</th></tr></thead>
                <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
                  {items.map((a: any) => (
                    <motion.tr key={a.code} variants={staggerItem}
                      style={{ paddingRight: a.level > 1 ? (a.level - 1) * 16 : 0 }}>
                      <td style={{ fontFamily: 'var(--font-latin)', fontWeight: 600, color: 'var(--color-primary)' }}>{a.code}</td>
                      <td style={{ paddingRight: a.level > 1 ? (a.level - 1) * 16 + 16 : 16 }}>{a.name_ar}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-latin)' }}>{a.name_en ?? '—'}</td>
                      <td className="amount">{a.level}</td>
                      <td>{a.is_system ? <span className="badge badge-warning">نظام</span> : '—'}</td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )
        })
      )}
    </PageTransition>
  )
}
