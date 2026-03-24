import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, RefreshCw, Users, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { SearchInput } from '../../components/ui/SearchInput'
import { staggerContainer, staggerItem } from '../../lib/animations'

const ROLES = ['admin', 'accountant', 'cashier'] as const

const schema = z.object({
  full_name: z.string().min(2),
  email:     z.string().email(),
  username:  z.string().min(3),
  password:  z.string().min(8),
  role:      z.enum(ROLES),
})
type FormData = z.infer<typeof schema>

export default function UsersPage() {
  const { t }       = useTranslation()
  const qc          = useQueryClient()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/auth/users')
      return res.data.data
    },
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'cashier' },
  })

  const createMutation = useMutation({
    mutationFn: (dto: FormData) => api.post('/auth/users', dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success(t('users.created'))
      setShowForm(false)
      reset()
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('common.error')),
  })

  const toggleActive = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      api.patch(`/auth/users/${id}`, { is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  const users = (data ?? []).filter((u: any) =>
    !search || u.full_name.includes(search) || u.email.includes(search) || u.username.includes(search)
  )

  const ROLE_COLORS: Record<string, string> = {
    admin:      'var(--color-danger)',
    accountant: 'var(--color-info)',
    cashier:    'var(--color-success)',
  }

  return (
    <PageTransition>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="var(--color-primary)" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{t('pages.users')}</h1>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t('users.desc')}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => refetch()}><RefreshCw size={14} /></button>
            <button className="btn btn-primary" onClick={() => setShowForm(s => !s)} style={{ gap: 6 }}>
              <Plus size={15} /> {t('users.addUser')}
            </button>
          </div>
        </div>

        {/* Add user form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 20 }}>
            <h2 style={{ fontWeight: 600, marginBottom: 16 }}>{t('users.newUser')}</h2>
            <form onSubmit={handleSubmit(d => createMutation.mutate(d))}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                {[
                  { field: 'full_name', label: t('users.fullName'),  type: 'text' },
                  { field: 'email',     label: t('auth.email'),      type: 'email' },
                  { field: 'username',  label: t('users.username'),  type: 'text' },
                  { field: 'password',  label: t('auth.password'),   type: 'password' },
                ].map(f => (
                  <div key={f.field} className="form-field has-value">
                    <label style={{ top: -8, fontSize: 12 }}>{f.label}</label>
                    <input {...register(f.field as any)} type={f.type} className={`form-input ${errors[f.field as keyof FormData] ? 'is-error' : ''}`} />
                  </div>
                ))}
                <div className="form-field has-value">
                  <label style={{ top: -8, fontSize: 12 }}>{t('users.role')}</label>
                  <select {...register('role')} className="form-select">
                    {ROLES.map(r => <option key={r} value={r}>{t(`sidebar.roles.${r}`)}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); reset() }}>{t('common.cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ gap: 6 }}>
                  {isSubmitting ? <Loader2 size={14} className="spin" /> : <Plus size={14} />} {t('common.save')}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div style={{ marginBottom: 16 }}>
          <SearchInput value={search} onChange={setSearch} placeholder={t('users.searchPlaceholder')} />
        </div>

        {isLoading ? (
          <div>{[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 64, marginBottom: 8, borderRadius: 10 }} />)}</div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ display: 'grid', gap: 10 }}>
            {users.map((user: any) => (
              <motion.div key={user.id} variants={staggerItem} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: '#2B9225',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#FFFFFF', fontWeight: 700, fontSize: 16, flexShrink: 0,
                }}>
                  {user.full_name?.[0] ?? 'U'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{user.full_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-latin)' }}>{user.email} · @{user.username}</div>
                </div>
                <span className="badge" style={{ background: `${ROLE_COLORS[user.role]}20`, color: ROLE_COLORS[user.role] }}>
                  {t(`sidebar.roles.${user.role}`)}
                </span>
                <button
                  className={`btn btn-sm ${user.is_active ? 'btn-ghost' : 'btn-secondary'}`}
                  style={{ gap: 4, color: user.is_active ? 'var(--color-success)' : 'var(--color-danger)' }}
                  onClick={() => toggleActive.mutate({ id: user.id, is_active: !user.is_active })}
                >
                  {user.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {user.is_active ? t('users.active') : t('users.inactive')}
                </button>
              </motion.div>
            ))}
            {users.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>{t('common.noData')}</div>}
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
