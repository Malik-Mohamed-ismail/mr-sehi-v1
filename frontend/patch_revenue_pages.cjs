const fs = require('fs');

function patchFile(filepath, patches) {
  let content = fs.readFileSync(filepath, 'utf8');
  for (const { from, to } of patches) {
    if (content.includes(from)) {
      content = content.replace(from, to);
    } else {
      console.log('Could not find in ' + filepath + ':\n' + from.slice(0, 100).replace(/\r/g, '\\r').replace(/\n/g, '\\n'));
    }
  }
  fs.writeFileSync(filepath, content, 'utf8');
}

// 1. DeliveryRevenuePage.tsx
patchFile('./src/features/revenue/DeliveryRevenuePage.tsx', [
  {
    from: "import { Plus, Download, Trash2, X } from 'lucide-react'",
    to: "import { Plus, Download, Trash2, X, Edit2 } from 'lucide-react'"
  },
  {
    from: "const [showForm, setShowForm] = useState(false)\n  const [deleteId, setDeleteId] = useState<string | null>(null)",
    to: "const [showForm, setShowForm] = useState(false)\n  const [editingItem, setEditingItem] = useState<any>(null)\n  const [deleteId, setDeleteId] = useState<string | null>(null)"
  },
  {
    from: "const createMutation = useMutation({\n    mutationFn: (data: any) => api.post('/revenue/delivery', data),\n    onSuccess: () => {\n      toast.success(t('revenue.messages.createSuccess'))\n      qc.invalidateQueries({ queryKey: ['deliveryRevenue'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false)\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),\n  })",
    to: "const createMutation = useMutation({\n    mutationFn: (data: any) => api.post('/revenue/delivery', data),\n    onSuccess: () => {\n      toast.success(t('revenue.messages.createSuccess'))\n      qc.invalidateQueries({ queryKey: ['deliveryRevenue'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false); setEditingItem(null);\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),\n  })\n\n  const updateMutation = useMutation({\n    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/revenue/delivery/${id}`, data),\n    onSuccess: () => {\n      toast.success('تم التعديل بنجاح')\n      qc.invalidateQueries({ queryKey: ['deliveryRevenue'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false); setEditingItem(null);\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),\n  })"
  },
  {
    from: "<span className=\"form-card-header-title\">➕ {t('revenue.delivery.add')}</span>",
    to: "<span className=\"form-card-header-title\">{editingItem ? <Edit2 size={16}/> : '➕'} {editingItem ? 'تعديل السجل' : t('revenue.delivery.add')}</span>"
  },
  {
    from: "<button type=\"button\" className=\"form-close-btn\" onClick={() => { reset(); setShowForm(false) }} title=\"إغلاق\"><X size={16}/></button>",
    to: "<button type=\"button\" className=\"form-close-btn\" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }} title=\"إغلاق\"><X size={16}/></button>"
  },
  {
    from: "<form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir={i18n.dir()}>",
    to: "<form onSubmit={handleSubmit(d => editingItem ? updateMutation.mutate({ id: editingItem.id, data: d }) : createMutation.mutate(d))} dir={i18n.dir()}>"
  },
  {
    from: "<button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false) }}>{t('common.cancel')}</button>\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting}>\n                {isSubmitting ? t('common.saving') : t('common.save')}\n              </button>",
    to: "<button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }}>{t('common.cancel')}</button>\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting || updateMutation.isPending}>\n                {(isSubmitting || updateMutation.isPending) ? t('common.saving') : t('common.save')}\n              </button>"
  },
  {
    from: `{user?.role === 'admin' && (\n                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>\n                      )}`,
    to: `{user?.role === 'admin' && (\n                        <div style={{ display: 'flex', gap: 4 }}>\n                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingItem(r); reset({ revenue_date: r.revenue_date, payment_method: r.payment_method, platform: r.platform, gross_amount: Number(r.gross_amount), commission_amount: Number(r.commission_amount) }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>\n                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>\n                        </div>\n                      )}`
  }
]);

// 2. RestaurantRevenuePage.tsx
patchFile('./src/features/revenue/RestaurantRevenuePage.tsx', [
  {
    from: "import { Plus, Download, Trash2, X } from 'lucide-react'",
    to: "import { Plus, Download, Trash2, X, Edit2 } from 'lucide-react'"
  },
  {
    from: "const [showForm, setShowForm] = useState(false)\n  const [deleteId, setDeleteId] = useState<string | null>(null)",
    to: "const [showForm, setShowForm] = useState(false)\n  const [editingItem, setEditingItem] = useState<any>(null)\n  const [deleteId, setDeleteId] = useState<string | null>(null)"
  },
  {
    from: "const createMutation = useMutation({\n    mutationFn: (data: any) => api.post('/revenue/restaurant', data),\n    onSuccess: () => {\n      toast.success(t('revenue.messages.createSuccess'))\n      qc.invalidateQueries({ queryKey: ['restaurantRevenue'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false)\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),\n  })",
    to: "const createMutation = useMutation({\n    mutationFn: (data: any) => api.post('/revenue/restaurant', data),\n    onSuccess: () => {\n      toast.success(t('revenue.messages.createSuccess'))\n      qc.invalidateQueries({ queryKey: ['restaurantRevenue'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false); setEditingItem(null);\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),\n  })\n\n  const updateMutation = useMutation({\n    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/revenue/restaurant/${id}`, data),\n    onSuccess: () => {\n      toast.success('تم التعديل بنجاح')\n      qc.invalidateQueries({ queryKey: ['restaurantRevenue'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false); setEditingItem(null);\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),\n  })"
  },
  {
    from: "<span className=\"form-card-header-title\">➕ {t('revenue.restaurant.add')}</span>",
    to: "<span className=\"form-card-header-title\">{editingItem ? <Edit2 size={16}/> : '➕'} {editingItem ? 'تعديل الإيراد' : t('revenue.restaurant.add')}</span>"
  },
  {
    from: "<button type=\"button\" className=\"form-close-btn\" onClick={() => { reset(); setShowForm(false) }} title=\"إغلاق\"><X size={16}/></button>",
    to: "<button type=\"button\" className=\"form-close-btn\" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }} title=\"إغلاق\"><X size={16}/></button>"
  },
  {
    from: "<form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir={i18n.dir()}>",
    to: "<form onSubmit={handleSubmit(d => editingItem ? updateMutation.mutate({ id: editingItem.id, data: d }) : createMutation.mutate(d))} dir={i18n.dir()}>"
  },
  {
    from: "<button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false) }}>{t('common.cancel')}</button>\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting}>\n                {isSubmitting ? t('common.saving') : t('common.save')}\n              </button>",
    to: "<button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }}>{t('common.cancel')}</button>\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting || updateMutation.isPending}>\n                {(isSubmitting || updateMutation.isPending) ? t('common.saving') : t('common.save')}\n              </button>"
  },
  {
    from: `{user?.role === 'admin' && (\n                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>\n                      )}`,
    to: `{user?.role === 'admin' && (\n                        <div style={{ display: 'flex', gap: 4 }}>\n                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingItem(r); reset({ revenue_date: r.revenue_date, payment_method: r.payment_method, amount: Number(r.amount) }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>\n                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>\n                        </div>\n                      )}`
  }
]);

// 3. SubscriptionsRevenuePage.tsx
patchFile('./src/features/revenue/SubscriptionsRevenuePage.tsx', [
  {
    from: "import { Plus, Download, Trash2, X } from 'lucide-react'",
    to: "import { Plus, Download, Trash2, X, Edit2 } from 'lucide-react'"
  },
  {
    from: "const [showForm, setShowForm] = useState(false)\n  const [deleteId, setDeleteId] = useState<string | null>(null)",
    to: "const [showForm, setShowForm] = useState(false)\n  const [editingItem, setEditingItem] = useState<any>(null)\n  const [deleteId, setDeleteId] = useState<string | null>(null)"
  },
  {
    from: "const createMutation = useMutation({\n    mutationFn: (data: any) => api.post('/revenue/subscriptions', data),\n    onSuccess: () => {\n      toast.success(t('revenue.messages.createSuccess'))\n      qc.invalidateQueries({ queryKey: ['subscriptionsRevenue'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false)\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),\n  })",
    to: "const createMutation = useMutation({\n    mutationFn: (data: any) => api.post('/revenue/subscriptions', data),\n    onSuccess: () => {\n      toast.success(t('revenue.messages.createSuccess'))\n      qc.invalidateQueries({ queryKey: ['subscriptionsRevenue'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false); setEditingItem(null);\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),\n  })\n\n  const updateMutation = useMutation({\n    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/revenue/subscriptions/${id}`, data),\n    onSuccess: () => {\n      toast.success('تم التعديل بنجاح')\n      qc.invalidateQueries({ queryKey: ['subscriptionsRevenue'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false); setEditingItem(null);\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('revenue.messages.error')),\n  })"
  },
  {
    from: "<span className=\"form-card-header-title\">➕ {t('revenue.subscriptions.add')}</span>",
    to: "<span className=\"form-card-header-title\">{editingItem ? <Edit2 size={16}/> : '➕'} {editingItem ? 'تعديل السجل' : t('revenue.subscriptions.add')}</span>"
  },
  {
    from: "<button type=\"button\" className=\"form-close-btn\" onClick={() => { reset(); setShowForm(false) }} title=\"إغلاق\"><X size={16}/></button>",
    to: "<button type=\"button\" className=\"form-close-btn\" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }} title=\"إغلاق\"><X size={16}/></button>"
  },
  {
    from: "<form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir={i18n.dir()}>",
    to: "<form onSubmit={handleSubmit(d => editingItem ? updateMutation.mutate({ id: editingItem.id, data: d }) : createMutation.mutate(d))} dir={i18n.dir()}>"
  },
  {
    from: "<button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false) }}>{t('common.cancel')}</button>\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting}>\n                {isSubmitting ? t('common.saving') : t('common.save')}\n              </button>",
    to: "<button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }}>{t('common.cancel')}</button>\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting || updateMutation.isPending}>\n                {(isSubmitting || updateMutation.isPending) ? t('common.saving') : t('common.save')}\n              </button>"
  },
  {
    from: `{user?.role === 'admin' && (\n                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>\n                      )}`,
    to: `{user?.role === 'admin' && (\n                        <div style={{ display: 'flex', gap: 4 }}>\n                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingItem(r); reset({ revenue_date: r.revenue_date, payment_method: r.payment_method, subscriber_id: r.subscriber_id, notes: r.notes, amount: Number(r.amount) }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>\n                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>\n                        </div>\n                      )}`
  }
]);

console.log('revenue frontend patched');
