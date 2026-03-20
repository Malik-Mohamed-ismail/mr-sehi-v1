import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Users, Plus, Save, Activity } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { staggerContainer, staggerItem } from '../../lib/animations'

type TabType = 'system' | 'users' | 'audit'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('system')

  return (
    <PageTransition>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>الإعدادات</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>System Configuration & User Management</p>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Settings Sidebar */}
        <div className="card" style={{ width: 240, padding: '16px 12px', flexShrink: 0 }}>
          <button
            onClick={() => setActiveTab('system')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
              borderRadius: 8, background: activeTab === 'system' ? 'var(--color-primary-light)' : 'transparent',
              color: activeTab === 'system' ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'system' ? 700 : 500, fontSize: 14,
              border: 'none', cursor: 'pointer', textAlign: 'right', transition: 'all 0.2s',
            }}
          >
            <Settings size={18}/> إعدادات النظام
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
              borderRadius: 8, background: activeTab === 'users' ? 'var(--color-primary-light)' : 'transparent',
              color: activeTab === 'users' ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'users' ? 700 : 500, fontSize: 14,
              border: 'none', cursor: 'pointer', textAlign: 'right', transition: 'all 0.2s', marginTop: 4,
            }}
          >
            <Users size={18}/> المستخدمين والصلاحيات
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
              borderRadius: 8, background: activeTab === 'audit' ? 'var(--color-primary-light)' : 'transparent',
              color: activeTab === 'audit' ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'audit' ? 700 : 500, fontSize: 14,
              border: 'none', cursor: 'pointer', textAlign: 'right', transition: 'all 0.2s', marginTop: 4,
            }}
          >
            <Activity size={18}/> سجل النظام
          </button>
        </div>

        {/* Settings Content Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {activeTab === 'system' && (
              <motion.div key="system" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SystemSettingsTab />
              </motion.div>
            )}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <UsersManagementTab />
              </motion.div>
            )}
            {activeTab === 'audit' && (
              <motion.div key="audit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AuditLogsTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}

function SystemSettingsTab() {
  const qc = useQueryClient()
  const { data: profile, isLoading } = useQuery({
    queryKey: ['settings', 'SYSTEM_PROFILE'],
    queryFn: () => api.get('/settings/SYSTEM_PROFILE').then(r => r.data.data),
  })

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    values: {
      restaurant_name: profile?.restaurant_name ?? '',
      tax_number: profile?.tax_number ?? '',
      cr_number: profile?.cr_number ?? '',
      vat_rate: profile?.vat_rate ?? 15,
    }
  })

  const mutation = useMutation({
    mutationFn: (data: any) => api.put('/settings/SYSTEM_PROFILE', data),
    onSuccess: () => {
      toast.success('تم الحفظ بنجاح')
      qc.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: () => toast.error('حدث خطأ أثناء الحفظ')
  })

  if (isLoading) return <div className="skeleton" style={{ height: 200, width: '100%' }} />

  return (
    <div className="card">
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>الملف التعريفي والضريبي</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>هذه البيانات ستظهر في الفواتير المطبوعة والإقرارات الضريبية.</p>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} dir="rtl">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16, marginBottom: 24 }}>
          <div className="form-field has-value">
            <label>اسم المطعم (الرسمي)</label>
            <input {...register('restaurant_name', { required: true })} className="form-input"/>
          </div>
          <div className="form-field has-value">
            <label>السجل التجاري (CR)</label>
            <input {...register('cr_number')} className="form-input"/>
          </div>
          <div className="form-field has-value">
            <label>الرقم الضريبي (VAT No)</label>
            <input {...register('tax_number')} className="form-input"/>
          </div>
          <div className="form-field has-value">
            <label>نسبة ضريبة القيمة المضافة (%)</label>
            <input {...register('vat_rate', { valueAsNumber: true })} type="number" step="1" className="form-input" dir="ltr"/>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'جارٍ الحفظ...' : <><Save size={16}/> حفظ الإعدادات</>}
          </button>
        </div>
      </form>
    </div>
  )
}

function UsersManagementTab() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/auth/users').then(r => r.data.data),
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { username: '', email: '', password: '', full_name: '', role: 'cashier' }
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/users', data),
    onSuccess: () => {
      toast.success('تمت إضافة المستخدم بنجاح')
      qc.invalidateQueries({ queryKey: ['users'] })
      reset()
      setShowForm(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? 'حدث خطأ')
  })

  const ROLE_BADGES: Record<string, string> = {
    admin: 'badge-danger',
    accountant: 'badge-info',
    cashier: 'badge-success',
  }
  const ROLE_NAMES: Record<string, string> = {
    admin: 'مدير نظام',
    accountant: 'محاسب',
    cashier: 'كاشير',
  }

  return (
    <>
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 20 }}>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir="rtl">
            <div className="form-section-header">
              <div className="form-section-number">١</div>
              <div className="form-section-title">بيانات المستخدم الجديد</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16, marginBottom: 20 }}>
              <div className="form-field has-value">
                <label>الاسم الكامل</label>
                <input {...register('full_name', { required: true })} className="form-input"/>
              </div>
              <div className="form-field has-value">
                <label>اسم المستخدم (للدخول)</label>
                <input {...register('username', { required: true })} className="form-input" dir="ltr"/>
              </div>
              <div className="form-field has-value">
                <label>البريد الإلكتروني</label>
                <input {...register('email', { required: true })} type="email" className="form-input" dir="ltr"/>
              </div>
              <div className="form-field has-value">
                <label>كلمة المرور</label>
                <input {...register('password', { required: true })} type="password" className="form-input" dir="ltr"/>
              </div>
              <div className="form-field has-value" style={{ gridColumn: '1 / -1' }}>
                <label>الصلاحية</label>
                <select {...register('role', { required: true })} className="form-select">
                  <option value="cashier">كاشير</option>
                  <option value="accountant">محاسب</option>
                  <option value="admin">مدير نظام</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'جارٍ الحفظ...' : '💾 إضافة المستخدم'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontWeight: 700 }}>قائمة المستخدمين</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(s => !s)} disabled={showForm}>
            <Plus size={14}/> مستخدم جديد
          </button>
        </div>
        
        {isLoading ? (
          <div style={{ padding: 20 }}>{[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }}/>)}</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>الاسم الكامل</th>
                <th>اسم الدخول</th>
                <th style={{ fontFamily: 'var(--font-latin)' }}>البريد الإلكتروني</th>
                <th>الصلاحية</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
              {(users ?? []).map((u: any) => (
                <motion.tr key={u.id} variants={staggerItem}>
                  <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                  <td style={{ fontFamily: 'var(--font-latin)' }}>{u.username}</td>
                  <td style={{ fontFamily: 'var(--font-latin)', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td><span className={`badge ${ROLE_BADGES[u.role] ?? 'badge-neutral'}`}>{ROLE_NAMES[u.role] ?? u.role}</span></td>
                  <td>
                    {u.is_active 
                      ? <span className="badge badge-success">مفعل</span> 
                      : <span className="badge badge-danger">معطل</span>}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        )}
      </div>
    </>
  )
}

function AuditLogsTab() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => api.get('/audit-log?limit=100').then(r => r.data.data),
  })

  // Basic styling mapping for actions
  const actionColors: Record<string, string> = {
    CREATE: 'badge-success',
    UPDATE: 'badge-info',
    DELETE: 'badge-danger',
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
        <span style={{ fontWeight: 700 }}>سجل حركات النظام</span>
      </div>
      
      {isLoading ? (
        <div style={{ padding: 20 }}>{[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }}/>)}</div>
      ) : (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>التاريخ والوقت</th>
                <th>المستخدم</th>
                <th>العملية</th>
                <th>الجدول</th>
                <th style={{ minWidth: 200 }}>التفاصيل (JSON)</th>
              </tr>
            </thead>
            <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
              {(logs ?? []).map((log: any) => (
                <motion.tr key={log.id} variants={staggerItem}>
                  <td style={{ fontFamily: 'var(--font-latin)' }}>
                    {new Date(log.created_at).toLocaleString('ar-SA')}
                  </td>
                  <td style={{ fontWeight: 600 }}>ID: {log.user_id}</td>
                  <td>
                    <span className={`badge ${actionColors[log.action] ?? 'badge-neutral'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-latin)' }}>{log.table_name}</td>
                  <td>
                    <details style={{ cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-latin)', background: 'var(--bg-page)', padding: 4, borderRadius: 4 }}>
                      <summary style={{ outline: 'none' }}>عرض التفاصيل</summary>
                      <pre style={{ margin: 0, marginTop: 4, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                        {JSON.stringify(log.new_values || log.old_values, null, 2)}
                      </pre>
                    </details>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}
    </div>
  )
}

