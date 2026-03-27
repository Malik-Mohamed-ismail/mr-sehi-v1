const fs = require('fs');

function applyRegexPatch(filepath, configs) {
  let content = fs.readFileSync(filepath, 'utf8');
  for (const { regex, to } of configs) {
    if (regex.test(content)) {
      content = content.replace(regex, to);
    } else {
      console.log('Regex not found in ' + filepath + ':\n' + regex.toString());
    }
  }
  fs.writeFileSync(filepath, content, 'utf8');
}

// 1. Delivery
applyRegexPatch('./src/features/revenue/DeliveryRevenuePage.tsx', [
  {
    regex: /import \{ Plus, Download, Trash2, X \} from 'lucide-react'/,
    to: "import { Plus, Download, Trash2, X, Edit2 } from 'lucide-react'"
  },
  {
    regex: /const \[showForm, setShowForm\] = useState\(false\)\s*const \[deleteId, setDeleteId\] = useState<string \| null>\(null\)/,
    to: "const [showForm, setShowForm] = useState(false)\n  const [editingItem, setEditingItem] = useState<any>(null)\n  const [deleteId, setDeleteId] = useState<string | null>(null)"
  },
  {
    regex: /const createMutation = useMutation\(\{[\s\S]*?reset\(\); setShowForm\(false\)\r?\n\s+\},\r?\n\s+onError:[^\n]+\n\s+\}\)/,
    to: `const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/revenue/delivery', data),
    onSuccess: () => {
      toast.success(t('revenue.messages.createSuccess') || 'تم الإضافة')
      qc.invalidateQueries({ queryKey: ['deliveryRevenue'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['journal'] })
      reset(); setShowForm(false); setEditingItem(null);
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(\`/revenue/delivery/\${id}\`, data),
    onSuccess: () => {
      toast.success('تم التعديل بنجاح')
      qc.invalidateQueries({ queryKey: ['deliveryRevenue'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['journal'] })
      reset(); setShowForm(false); setEditingItem(null);
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),
  })`
  },
  {
    regex: /<form onSubmit=\{handleSubmit\(\(d\) => createMutation\.mutate\(d\)\)\} dir=\{i18n\.dir\(\)\}>/,
    to: `<form onSubmit={handleSubmit(d => editingItem ? updateMutation.mutate({ id: editingItem.id, data: d }) : createMutation.mutate(d))} dir={i18n.dir()}>`
  },
  {
    regex: /<span className="form-card-header-title">➕ \{t\('revenue\.delivery\.add'\)\}<\/span>/,
    to: `<span className="form-card-header-title">{editingItem ? <Edit2 size={16}/> : '➕'} {editingItem ? 'تعديل السجل' : t('revenue.delivery.add')}</span>`
  },
  {
    regex: /<button type="button" className="form-close-btn" onClick=\{.*?reset\(\); setShowForm\(false\).*?\} title="إغلاق"><X size=\{16\}\/><\/button>/,
    to: `<button type="button" className="form-close-btn" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }} title="إغلاق"><X size={16}/></button>`
  },
  {
    regex: /<button type="button" className="btn btn-secondary" onClick=\{.*?reset\(\); setShowForm\(false\).*?\}>\{t\('common\.cancel'\)\}<\/button>\s*<button type="submit" className="btn btn-primary" disabled=\{isSubmitting\}>\s*\{isSubmitting \? t\('common\.saving'\) : t\('common\.save'\)\}\s*<\/button>/,
    to: `<button type="button" className="btn btn-secondary" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }}>{t('common.cancel')}</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || updateMutation.isPending}>
                {(isSubmitting || updateMutation.isPending) ? t('common.saving') : t('common.save')}
              </button>`
  },
  {
    regex: /\{user\?\.role === 'admin' && \(\s*<button className="btn btn-ghost btn-sm" style=\{\{ color: 'var\(--color-danger\)' \}\} onClick=\{\(\) => setDeleteId\(r\.id\)\}><Trash2 size=\{14\}\/><\/button>\s*\)\}/,
    to: `{user?.role === 'admin' && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingItem(r); reset({ revenue_date: r.revenue_date, payment_method: r.payment_method, platform: r.platform, gross_amount: Number(r.gross_amount), commission_amount: Number(r.commission_amount) }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>
                        </div>
                      )}`
  }
]);

// 2. Restaurant
applyRegexPatch('./src/features/revenue/RestaurantRevenuePage.tsx', [
  {
    regex: /import \{ Plus, Download, Trash2, X \} from 'lucide-react'/,
    to: "import { Plus, Download, Trash2, X, Edit2 } from 'lucide-react'"
  },
  {
    regex: /const \[showForm, setShowForm\] = useState\(false\)\s*const \[deleteId, setDeleteId\] = useState<string \| null>\(null\)/,
    to: "const [showForm, setShowForm] = useState(false)\n  const [editingItem, setEditingItem] = useState<any>(null)\n  const [deleteId, setDeleteId] = useState<string | null>(null)"
  },
  {
    regex: /const createMutation = useMutation\(\{[\s\S]*?reset\(\); setShowForm\(false\)\r?\n\s+\},\r?\n\s+onError:[^\n]+\n\s+\}\)/,
    to: `const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/revenue/restaurant', data),
    onSuccess: () => {
      toast.success(t('revenue.messages.createSuccess') || 'تم الإضافة')
      qc.invalidateQueries({ queryKey: ['restaurantRevenue'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['journal'] })
      reset(); setShowForm(false); setEditingItem(null);
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(\`/revenue/restaurant/\${id}\`, data),
    onSuccess: () => {
      toast.success('تم التعديل بنجاح')
      qc.invalidateQueries({ queryKey: ['restaurantRevenue'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['journal'] })
      reset(); setShowForm(false); setEditingItem(null);
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),
  })`
  },
  {
    regex: /<form onSubmit=\{handleSubmit\(\(d\) => createMutation\.mutate\(d\)\)\} dir=\{i18n\.dir\(\)\}>/,
    to: `<form onSubmit={handleSubmit(d => editingItem ? updateMutation.mutate({ id: editingItem.id, data: d }) : createMutation.mutate(d))} dir={i18n.dir()}>`
  },
  {
    regex: /<span className="form-card-header-title">➕ \{t\('revenue\.restaurant\.add'\)\}<\/span>/,
    to: `<span className="form-card-header-title">{editingItem ? <Edit2 size={16}/> : '➕'} {editingItem ? 'تعديل الإيراد' : t('revenue.restaurant.add')}</span>`
  },
  {
    regex: /<button type="button" className="form-close-btn" onClick=\{.*?reset\(\); setShowForm\(false\).*?\} title="إغلاق"><X size=\{16\}\/><\/button>/,
    to: `<button type="button" className="form-close-btn" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }} title="إغلاق"><X size={16}/></button>`
  },
  {
    regex: /<button type="button" className="btn btn-secondary" onClick=\{.*?reset\(\); setShowForm\(false\).*?\}>\{t\('common\.cancel'\)\}<\/button>\s*<button type="submit" className="btn btn-primary" disabled=\{isSubmitting\}>\s*\{isSubmitting \? t\('common\.saving'\) : t\('common\.save'\)\}\s*<\/button>/,
    to: `<button type="button" className="btn btn-secondary" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }}>{t('common.cancel')}</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || updateMutation.isPending}>
                {(isSubmitting || updateMutation.isPending) ? t('common.saving') : t('common.save')}
              </button>`
  },
  {
    regex: /\{user\?\.role === 'admin' && \(\s*<button className="btn btn-ghost btn-sm" style=\{\{ color: 'var\(--color-danger\)' \}\} onClick=\{\(\) => setDeleteId\(r\.id\)\}><Trash2 size=\{14\}\/><\/button>\s*\)\}/,
    to: `{user?.role === 'admin' && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingItem(r); reset({ revenue_date: r.revenue_date, payment_method: r.payment_method, amount: Number(r.amount) }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>
                        </div>
                      )}`
  }
]);

// 3. Subscriptions
applyRegexPatch('./src/features/revenue/SubscriptionsRevenuePage.tsx', [
  {
    regex: /import \{ Plus, Download, Trash2, X \} from 'lucide-react'/,
    to: "import { Plus, Download, Trash2, X, Edit2 } from 'lucide-react'"
  },
  {
    regex: /const \[showForm, setShowForm\] = useState\(false\)\s*const \[deleteId, setDeleteId\] = useState<string \| null>\(null\)/,
    to: "const [showForm, setShowForm] = useState(false)\n  const [editingItem, setEditingItem] = useState<any>(null)\n  const [deleteId, setDeleteId] = useState<string | null>(null)"
  },
  {
    regex: /const createMutation = useMutation\(\{[\s\S]*?reset\(\); setShowForm\(false\)\r?\n\s+\},\r?\n\s+onError:[^\n]+\n\s+\}\)/,
    to: `const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/revenue/subscriptions', data),
    onSuccess: () => {
      toast.success(t('revenue.messages.createSuccess') || 'تم الإضافة')
      qc.invalidateQueries({ queryKey: ['subscriptionsRevenue'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['journal'] })
      reset(); setShowForm(false); setEditingItem(null);
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(\`/revenue/subscriptions/\${id}\`, data),
    onSuccess: () => {
      toast.success('تم التعديل بنجاح')
      qc.invalidateQueries({ queryKey: ['subscriptionsRevenue'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['journal'] })
      reset(); setShowForm(false); setEditingItem(null);
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),
  })`
  },
  {
    regex: /<form onSubmit=\{handleSubmit\(\(d\) => createMutation\.mutate\(d\)\)\} dir=\{i18n\.dir\(\)\}>/,
    to: `<form onSubmit={handleSubmit(d => editingItem ? updateMutation.mutate({ id: editingItem.id, data: d }) : createMutation.mutate(d))} dir={i18n.dir()}>`
  },
  {
    regex: /<span className="form-card-header-title">➕ \{t\('revenue\.subscriptions\.add'\)\}<\/span>/,
    to: `<span className="form-card-header-title">{editingItem ? <Edit2 size={16}/> : '➕'} {editingItem ? 'تعديل الإيراد' : t('revenue.subscriptions.add')}</span>`
  },
  {
    regex: /<button type="button" className="form-close-btn" onClick=\{.*?reset\(\); setShowForm\(false\).*?\} title="إغلاق"><X size=\{16\}\/><\/button>/,
    to: `<button type="button" className="form-close-btn" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }} title="إغلاق"><X size={16}/></button>`
  },
  {
    regex: /<button type="button" className="btn btn-secondary" onClick=\{.*?reset\(\); setShowForm\(false\).*?\}>\{t\('common\.cancel'\)\}<\/button>\s*<button type="submit" className="btn btn-primary" disabled=\{isSubmitting\}>\s*\{isSubmitting \? t\('common\.saving'\) : t\('common\.save'\)\}\s*<\/button>/,
    to: `<button type="button" className="btn btn-secondary" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }}>{t('common.cancel')}</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || updateMutation.isPending}>
                {(isSubmitting || updateMutation.isPending) ? t('common.saving') : t('common.save')}
              </button>`
  },
  {
    regex: /\{user\?\.role === 'admin' && \(\s*<button className="btn btn-ghost btn-sm" style=\{\{ color: 'var\(--color-danger\)' \}\} onClick=\{\(\) => setDeleteId\(r\.id\)\}><Trash2 size=\{14\}\/><\/button>\s*\)\}/,
    to: `{user?.role === 'admin' && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingItem(r); reset({ revenue_date: r.revenue_date, payment_method: r.payment_method, subscriber_id: r.subscriber_id, notes: r.notes, amount: Number(r.amount) }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>
                        </div>
                      )}`
  }
]);

console.log('revenue frontend regex patched');
