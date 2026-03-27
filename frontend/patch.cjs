const fs = require('fs');

function patchFile(path, patches) {
  let content = fs.readFileSync(path, 'utf8');
  for (const { from, to } of patches) {
    if (content.includes(from)) {
      content = content.replace(from, to);
    } else {
      console.log('Could not find in ' + path + ':', from.slice(0, 100).replace(/\r/g, '\\r').replace(/\n/g, '\\n'));
    }
  }
  fs.writeFileSync(path, content, 'utf8');
}

// 1. ExpensesPage.tsx
patchFile('./src/features/expenses/ExpensesPage.tsx', [
  {
    from: "import { Plus, Download, Trash2, X } from 'lucide-react'",
    to: "import { Plus, Download, Trash2, X, Edit2 } from 'lucide-react'"
  },
  {
    from: "const [showForm, setShowForm] = useState(false)\r\n  const [deleteId, setDeleteId] = useState<string | null>(null)",
    to: "const [showForm, setShowForm] = useState(false)\r\n  const [editingExpense, setEditingExpense] = useState<any>(null)\r\n  const [deleteId, setDeleteId] = useState<string | null>(null)"
  },
  {
    from: "const [showForm, setShowForm] = useState(false)\n  const [deleteId, setDeleteId] = useState<string | null>(null)",
    to: "const [showForm, setShowForm] = useState(false)\n  const [editingExpense, setEditingExpense] = useState<any>(null)\n  const [deleteId, setDeleteId] = useState<string | null>(null)"
  },
  {
    from: "const createMutation = useMutation({\r\n    mutationFn: (data: any) => api.post('/expenses', { ...data, amount: Number(data.amount) }),\r\n    onSuccess: () => {\r\n      toast.success(t('expenses.messages.createSuccess'))\r\n      qc.invalidateQueries({ queryKey: ['expenses'] })\r\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\r\n      qc.invalidateQueries({ queryKey: ['journal'] })\r\n      reset(); setShowForm(false)\r\n    },\r\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('expenses.messages.error')),\r\n  })",
    to: "const createMutation = useMutation({\r\n    mutationFn: (data: any) => api.post('/expenses', { ...data, amount: Number(data.amount) }),\r\n    onSuccess: () => {\r\n      toast.success(t('expenses.messages.createSuccess'))\r\n      qc.invalidateQueries({ queryKey: ['expenses'] })\r\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\r\n      qc.invalidateQueries({ queryKey: ['journal'] })\r\n      reset(); setShowForm(false); setEditingExpense(null);\r\n    },\r\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('expenses.messages.error')),\r\n  })\r\n\r\n  const updateMutation = useMutation({\r\n    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/expenses/${id}`, { ...data, amount: Number(data.amount) }),\r\n    onSuccess: () => {\r\n      toast.success('تم التعديل بنجاح')\r\n      qc.invalidateQueries({ queryKey: ['expenses'] })\r\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\r\n      qc.invalidateQueries({ queryKey: ['journal'] })\r\n      reset(); setShowForm(false); setEditingExpense(null);\r\n    },\r\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('expenses.messages.error')),\r\n  })"
  },
  {
    from: "const createMutation = useMutation({\n    mutationFn: (data: any) => api.post('/expenses', { ...data, amount: Number(data.amount) }),\n    onSuccess: () => {\n      toast.success(t('expenses.messages.createSuccess'))\n      qc.invalidateQueries({ queryKey: ['expenses'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false)\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('expenses.messages.error')),\n  })",
    to: "const createMutation = useMutation({\n    mutationFn: (data: any) => api.post('/expenses', { ...data, amount: Number(data.amount) }),\n    onSuccess: () => {\n      toast.success(t('expenses.messages.createSuccess'))\n      qc.invalidateQueries({ queryKey: ['expenses'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false); setEditingExpense(null);\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('expenses.messages.error')),\n  })\n\n  const updateMutation = useMutation({\n    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/expenses/${id}`, { ...data, amount: Number(data.amount) }),\n    onSuccess: () => {\n      toast.success('تم التعديل بنجاح')\n      qc.invalidateQueries({ queryKey: ['expenses'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false); setEditingExpense(null);\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('expenses.messages.error')),\n  })"
  },
  {
    from: "<span className=\"form-card-header-title\">➕ {t('expenses.newExpense')}</span>",
    to: "<span className=\"form-card-header-title\">{editingExpense ? <Edit2 size={16}/> : '➕'} {editingExpense ? 'تعديل المصروف' : t('expenses.newExpense')}</span>"
  },
  {
    from: "<button type=\"button\" className=\"form-close-btn\" onClick={() => { reset(); setShowForm(false) }} title=\"إغلاق\"><X size={16}/></button>",
    to: "<button type=\"button\" className=\"form-close-btn\" onClick={() => { reset(); setShowForm(false); setEditingExpense(null); }} title=\"إغلاق\"><X size={16}/></button>"
  },
  {
    from: "<form onSubmit={handleSubmit((d) => createMutation.mutate(d))} dir={i18n.dir()}>",
    to: "<form onSubmit={handleSubmit(d => editingExpense ? updateMutation.mutate({ id: editingExpense.id, data: d }) : createMutation.mutate(d))} dir={i18n.dir()}>"
  },
  {
    from: "<button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting}>{isSubmitting ? t('expenses.buttons.saving') : t('expenses.buttons.save')}</button>",
    to: "<button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting || updateMutation.isPending}>{(isSubmitting || updateMutation.isPending) ? t('expenses.buttons.saving') : t('expenses.buttons.save')}</button>"
  },
  {
    from: `{user?.role === 'admin' && (\r\n                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(e.id)} title={t("purchases.delete.aria") || 'حذف'}><Trash2 size={14}/></button>\r\n                    )}`,
    to: `{user?.role === 'admin' && (\r\n                      <div style={{ display: 'flex', gap: 4 }}>\r\n                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingExpense(e); reset({ expense_date: e.expense_date, account_code: e.account_code, expense_type: e.expense_type, description: e.description, amount: e.amount, payment_method: e.payment_method, has_vat: Number(e.vat_amount) > 0 }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>\r\n                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(e.id)} title={t("purchases.delete.aria") || 'حذف'}><Trash2 size={14}/></button>\r\n                      </div>\r\n                    )}`
  },
  {
    from: `{user?.role === 'admin' && (\n                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(e.id)} title={t("purchases.delete.aria") || 'حذف'}><Trash2 size={14}/></button>\n                    )}`,
    to: `{user?.role === 'admin' && (\n                      <div style={{ display: 'flex', gap: 4 }}>\n                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingExpense(e); reset({ expense_date: e.expense_date, account_code: e.account_code, expense_type: e.expense_type, description: e.description, amount: e.amount, payment_method: e.payment_method, has_vat: Number(e.vat_amount) > 0 }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>\n                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(e.id)} title={t("purchases.delete.aria") || 'حذف'}><Trash2 size={14}/></button>\n                      </div>\n                    )}`
  }
]);

// 2. PurchasesPage.tsx
patchFile('./src/features/purchases/PurchasesPage.tsx', [
  {
    from: "import { Plus, Download, Trash2, X } from 'lucide-react'",
    to: "import { Plus, Download, Trash2, X, Edit2 } from 'lucide-react'"
  },
  {
    from: "const [showForm, setShowForm] = useState(false)\r\n  const [deleteId, setDeleteId] = useState<string | null>(null)",
    to: "const [showForm, setShowForm] = useState(false)\r\n  const [editingPurchase, setEditingPurchase] = useState<any>(null)\r\n  const [deleteId, setDeleteId] = useState<string | null>(null)"
  },
  {
    from: "const [showForm, setShowForm] = useState(false)\n  const [deleteId, setDeleteId] = useState<string | null>(null)",
    to: "const [showForm, setShowForm] = useState(false)\n  const [editingPurchase, setEditingPurchase] = useState<any>(null)\n  const [deleteId, setDeleteId] = useState<string | null>(null)"
  },
  {
    from: "const createMutation = useMutation({\r\n    mutationFn: (data: any) => api.post('/purchases', data),\r\n    onSuccess: () => {\r\n      toast.success(t('purchases.messages.createSuccess'))\r\n      qc.invalidateQueries({ queryKey: ['purchases'] })\r\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\r\n      qc.invalidateQueries({ queryKey: ['journal'] })\r\n      reset(); setShowForm(false)\r\n    },\r\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('purchases.messages.error')),\r\n  })",
    to: "const createMutation = useMutation({\r\n    mutationFn: (data: any) => api.post('/purchases', data),\r\n    onSuccess: () => {\r\n      toast.success(t('purchases.messages.createSuccess'))\r\n      qc.invalidateQueries({ queryKey: ['purchases'] })\r\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\r\n      qc.invalidateQueries({ queryKey: ['journal'] })\r\n      reset(); setShowForm(false); setEditingPurchase(null);\r\n    },\r\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('purchases.messages.error')),\r\n  })\r\n\r\n  const updateMutation = useMutation({\r\n    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/purchases/${id}`, data),\r\n    onSuccess: () => {\r\n      toast.success('تم التعديل بنجاح')\r\n      qc.invalidateQueries({ queryKey: ['purchases'] })\r\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\r\n      qc.invalidateQueries({ queryKey: ['journal'] })\r\n      reset(); setShowForm(false); setEditingPurchase(null);\r\n    },\r\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('purchases.messages.error')),\r\n  })"
  },
  {
    from: "const createMutation = useMutation({\n    mutationFn: (data: any) => api.post('/purchases', data),\n    onSuccess: () => {\n      toast.success(t('purchases.messages.createSuccess'))\n      qc.invalidateQueries({ queryKey: ['purchases'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false)\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('purchases.messages.error')),\n  })",
    to: "const createMutation = useMutation({\n    mutationFn: (data: any) => api.post('/purchases', data),\n    onSuccess: () => {\n      toast.success(t('purchases.messages.createSuccess'))\n      qc.invalidateQueries({ queryKey: ['purchases'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false); setEditingPurchase(null);\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('purchases.messages.error')),\n  })\n\n  const updateMutation = useMutation({\n    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/purchases/${id}`, data),\n    onSuccess: () => {\n      toast.success('تم التعديل بنجاح')\n      qc.invalidateQueries({ queryKey: ['purchases'] })\n      qc.invalidateQueries({ queryKey: ['dashboard'] })\n      qc.invalidateQueries({ queryKey: ['journal'] })\n      reset(); setShowForm(false); setEditingPurchase(null);\n    },\n    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? t('purchases.messages.error')),\n  })"
  },
  {
    from: "  const onSubmit = (data: FormData) => {\r\n    createMutation.mutate({\r\n      ...data,\r\n      subtotal:     parseFloat(subtotal.toFixed(4)),\r\n      vat_amount:   vatAmt,\r\n      total_amount: parseFloat(total.toFixed(4)),\r\n    })\r\n  }",
    to: "  const onSubmit = (data: FormData) => {\r\n    const payload = {\r\n      ...data,\r\n      subtotal:     parseFloat(subtotal.toFixed(4)),\r\n      vat_amount:   vatAmt,\r\n      total_amount: parseFloat(total.toFixed(4)),\r\n    }\r\n    if (editingPurchase) updateMutation.mutate({ id: editingPurchase.id, data: payload })\r\n    else createMutation.mutate(payload)\r\n  }"
  },
  {
    from: "  const onSubmit = (data: FormData) => {\n    createMutation.mutate({\n      ...data,\n      subtotal:     parseFloat(subtotal.toFixed(4)),\n      vat_amount:   vatAmt,\n      total_amount: parseFloat(total.toFixed(4)),\n    })\n  }",
    to: "  const onSubmit = (data: FormData) => {\n    const payload = {\n      ...data,\n      subtotal:     parseFloat(subtotal.toFixed(4)),\n      vat_amount:   vatAmt,\n      total_amount: parseFloat(total.toFixed(4)),\n    }\n    if (editingPurchase) updateMutation.mutate({ id: editingPurchase.id, data: payload })\n    else createMutation.mutate(payload)\n  }"
  },
  {
    from: "<span className=\"form-card-header-title\">➕ {t('purchases.newInvoice')}</span>",
    to: "<span className=\"form-card-header-title\">{editingPurchase ? <Edit2 size={16}/> : '➕'} {editingPurchase ? 'تعديل الفاتورة' : t('purchases.newInvoice')}</span>"
  },
  {
    from: "<button type=\"button\" className=\"form-close-btn\" onClick={() => { reset(); setShowForm(false) }} title=\"إغلاق\"><X size={16}/></button>",
    to: "<button type=\"button\" className=\"form-close-btn\" onClick={() => { reset(); setShowForm(false); setEditingPurchase(null); }} title=\"إغلاق\"><X size={16}/></button>"
  },
  {
    from: "<button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false) }}>{t(\"purchases.buttons.cancel\")}</button>\r\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting}>\r\n                {isSubmitting ? t('purchases.buttons.saving') : t('purchases.buttons.save')}\r\n              </button>",
    to: "<button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false); setEditingPurchase(null); }}>{t(\"purchases.buttons.cancel\")}</button>\r\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting || updateMutation.isPending}>\r\n                {(isSubmitting || updateMutation.isPending) ? t('purchases.buttons.saving') : t('purchases.buttons.save')}\r\n              </button>"
  },
  {
    from: "<button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false) }}>{t(\"purchases.buttons.cancel\")}</button>\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting}>\n                {isSubmitting ? t('purchases.buttons.saving') : t('purchases.buttons.save')}\n              </button>",
    to: "<button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false); setEditingPurchase(null); }}>{t(\"purchases.buttons.cancel\")}</button>\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting || updateMutation.isPending}>\n                {(isSubmitting || updateMutation.isPending) ? t('purchases.buttons.saving') : t('purchases.buttons.save')}\n              </button>"
  },
  {
    from: `{user?.role === 'admin' && (\r\n                      <button\r\n                        className="btn btn-ghost btn-sm"\r\n                        style={{ color: 'var(--color-danger)' }}\r\n                        onClick={() => setDeleteId(p.id)}\r\n                        aria-label={t("purchases.delete.aria")}\r\n                      >\r\n                        <Trash2 size={14}/>\r\n                      </button>\r\n                    )}`,
    to: `{user?.role === 'admin' && (\r\n                      <div style={{ display: 'flex', gap: 4 }}>\r\n                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingPurchase(p); reset({ invoice_number: p.invoice_number, invoice_date: p.invoice_date, supplier_id: p.supplier_id, category: p.category, item_name: p.item_name, quantity: Number(p.quantity), unit_price: Number(p.unit_price), discount: Number(p.discount), payment_method: p.payment_method, is_asset: p.is_asset, notes: p.notes }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>\r\n                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(p.id)} aria-label={t("purchases.delete.aria")}><Trash2 size={14}/></button>\r\n                      </div>\r\n                    )}`
  },
  {
    from: `{user?.role === 'admin' && (\n                      <button\n                        className="btn btn-ghost btn-sm"\n                        style={{ color: 'var(--color-danger)' }}\n                        onClick={() => setDeleteId(p.id)}\n                        aria-label={t("purchases.delete.aria")}\n                      >\n                        <Trash2 size={14}/>\n                      </button>\n                    )}`,
    to: `{user?.role === 'admin' && (\n                      <div style={{ display: 'flex', gap: 4 }}>\n                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingPurchase(p); reset({ invoice_number: p.invoice_number, invoice_date: p.invoice_date, supplier_id: p.supplier_id, category: p.category, item_name: p.item_name, quantity: Number(p.quantity), unit_price: Number(p.unit_price), discount: Number(p.discount), payment_method: p.payment_method, is_asset: p.is_asset, notes: p.notes }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>\n                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(p.id)} aria-label={t("purchases.delete.aria")}><Trash2 size={14}/></button>\n                      </div>\n                    )}`
  }
]);

console.log('Script completed');
