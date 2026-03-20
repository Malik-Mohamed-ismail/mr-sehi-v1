import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { exportToExcel } from '../../lib/export'
import { PageTransition } from '../../components/ui/PageTransition'
import { formatSAR } from '../../lib/utils'
import { Download } from 'lucide-react'

export function TrialBalancePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['trial-balance', date],
    queryFn: () => api.get(`/trial-balance?date=${date}`).then(r => r.data.data),
  })

  const totalDebit  = (data ?? []).reduce((s: number, r: any) => s + Number(r.total_debit),  0)
  const totalCredit = (data ?? []).reduce((s: number, r: any) => s + Number(r.total_credit), 0)
  const isBalanced  = Math.abs(totalDebit - totalCredit) < 0.01

  const handleExport = () => {
    const exportData = (data ?? []).map((r: any) => ({
      'كود الحساب': r.account_code,
      'اسم الحساب': r.name_ar,
      'النوع': r.type,
      'إجمالي المدين': parseFloat(r.total_debit) || 0,
      'إجمالي الدائن': parseFloat(r.total_credit) || 0,
      'الرصيد': parseFloat(r.balance) || 0
    }))
    exportData.push({
      'كود الحساب': 'المجموع',
      'اسم الحساب': '',
      'النوع': '',
      'إجمالي المدين': totalDebit,
      'إجمالي الدائن': totalCredit,
      'الرصيد': totalDebit - totalCredit
    })
    exportToExcel(exportData, `ميزان_المراجعة_${date}`)
  }

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>ميزان المراجعة</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Trial Balance</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input" style={{ width: 160, height: 36 }}/>
          <button className="btn btn-primary btn-sm" onClick={() => refetch()}>تحديث</button>
          <button className="btn btn-secondary btn-sm" onClick={handleExport} disabled={!data?.length}>
            <Download size={14}/> تصدير Excel
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="card">{[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 36, marginBottom: 8 }}/>)}</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>كود الحساب</th>
                <th>اسم الحساب</th>
                <th>النوع</th>
                <th>إجمالي المدين</th>
                <th>إجمالي الدائن</th>
                <th>الرصيد</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((r: any) => (
                <tr key={r.account_code}>
                  <td style={{ fontFamily: 'var(--font-latin)', fontWeight: 600, color: 'var(--color-primary)' }}>{r.account_code}</td>
                  <td>{r.name_ar ?? '—'}</td>
                  <td><span className="badge badge-neutral">{r.type ?? '—'}</span></td>
                  <td className="amount">{formatSAR(r.total_debit)}</td>
                  <td className="amount">{formatSAR(r.total_credit)}</td>
                  <td className="amount" style={{ fontWeight: 700, color: Number(r.balance) >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {formatSAR(r.balance)}
                  </td>
                </tr>
              ))}
              {/* Totals row */}
              <tr style={{ background: 'var(--bg-surface-2)', fontWeight: 700 }}>
                <td colSpan={3} style={{ textAlign: 'left', padding: '12px 16px' }}>
                  {isBalanced
                    ? <span style={{ color: 'var(--color-success)' }}>✓ الميزان متوازن</span>
                    : <span style={{ color: 'var(--color-danger)' }}>✗ الميزان غير متوازن</span>}
                </td>
                <td className="amount" style={{ fontWeight: 800 }}>{formatSAR(totalDebit)}</td>
                <td className="amount" style={{ fontWeight: 800 }}>{formatSAR(totalCredit)}</td>
                <td className="amount" style={{ color: isBalanced ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {formatSAR(totalDebit - totalCredit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </PageTransition>
  )
}

export function LedgerPage() {
  const [from, setFrom] = useState('')
  const [to, setTo]     = useState('')
  const [code, setCode] = useState('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['ledger', code, from, to],
    queryFn: () => {
      const params = new URLSearchParams()
      if (from) params.set('from', from)
      if (to)   params.set('to', to)
      const url = code ? `/ledger/${code}?${params}` : `/ledger?${params}`
      return api.get(url).then(r => r.data.data)
    },
  })

  const handleExport = () => {
    const exportData = (data ?? []).map((r: any) => ({
      'التاريخ': r.entry_date,
      'رقم القيد': r.entry_number,
      'البيان': r.description,
      'الحساب': r.account_code + (r.account_name ? ` — ${r.account_name}` : ''),
      'مدين': Number(r.debit_amount) || 0,
      'دائن': Number(r.credit_amount) || 0,
      'الرصيد': r.running_balance
    }))
    exportToExcel(exportData, `دفتر_الاستاذ_${code}`)
  }

  return (
    <PageTransition>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>الأستاذ العام</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>General Ledger</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleExport} disabled={!data?.length}>
          <Download size={14}/> تصدير Excel
        </button>
      </div>

      <div className="card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="form-field has-value" style={{ marginBottom: 0 }}>
          <label>كود الحساب (اختياري)</label>
          <input value={code} onChange={e => setCode(e.target.value)} className="form-input" style={{ width: 120 }} placeholder="مثال: 1101"/>
        </div>
        <div className="form-field has-value" style={{ marginBottom: 0 }}>
          <label>من</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="form-input" style={{ width: 160 }}/>
        </div>
        <div className="form-field has-value" style={{ marginBottom: 0 }}>
          <label>إلى</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="form-input" style={{ width: 160 }}/>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => refetch()}>بحث</button>
      </div>

      {isLoading ? (
        <div className="card">{[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 36, marginBottom: 8 }}/>)}</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr><th>التاريخ</th><th>رقم القيد</th><th>البيان</th><th>الحساب</th><th>مدين</th><th>دائن</th><th>الرصيد</th></tr>
            </thead>
            <tbody>
              {(data ?? []).map((r: any, i: number) => (
                <tr key={i}>
                  <td className="amount">{r.entry_date}</td>
                  <td style={{ fontFamily: 'var(--font-latin)', color: 'var(--color-primary)', fontWeight: 600 }}>{r.entry_number}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description}</td>
                  <td style={{ fontFamily: 'var(--font-latin)', fontSize: 12 }}>{r.account_code} {r.account_name && `— ${r.account_name}`}</td>
                  <td className="amount">{Number(r.debit_amount) > 0 ? formatSAR(r.debit_amount) : '—'}</td>
                  <td className="amount">{Number(r.credit_amount) > 0 ? formatSAR(r.credit_amount) : '—'}</td>
                  <td className="amount" style={{ fontWeight: 700, color: Number(r.running_balance) >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {formatSAR(r.running_balance)}
                  </td>
                </tr>
              ))}
              {!data?.length && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>لا توجد بيانات</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </PageTransition>
  )
}
