const fs = require('fs');

function patch(filepath, patches) {
  let content = fs.readFileSync(filepath, 'utf8');
  for (const { from, to } of patches) {
    if (content.includes(from)) {
      content = content.replace(from, to);
    } else {
      console.log('Not found in ' + filepath + ':\n' + from.slice(0, 80).replace(/\r/g, '\\r').replace(/\n/g, '\\n'));
    }
  }
  fs.writeFileSync(filepath, content, 'utf8');
}

// 1. Delivery
patch('./src/features/revenue/DeliveryRevenuePage.tsx', [
  {
    from: "import { Plus, Download, X } from 'lucide-react'\r\n",
    to: "import { Plus, Download, X, Edit2 } from 'lucide-react'\r\n"
  },
  {
    from: "  const onSubmit = (data: FormData) => {\r\n    createMutation.mutate({ ...data, commission_amount: commAmount })\r\n  }",
    to: "  const onSubmit = (data: FormData) => {\r\n    if (editingItem) updateMutation.mutate({ id: editingItem.id, data: { ...data, commission_amount: commAmount } })\r\n    else createMutation.mutate({ ...data, commission_amount: commAmount })\r\n  }"
  },
  {
    from: "<span className=\"form-card-header-title\">➕ {t('delivery.newRevenue')}</span>",
    to: "<span className=\"form-card-header-title\">{editingItem ? <Edit2 size={16}/> : '➕'} {editingItem ? 'تعديل السجل' : t('delivery.newRevenue')}</span>"
  },
  {
    from: "              <button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false) }}>{t('delivery.buttons.cancel')}</button>\r\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting}>\r\n                {isSubmitting ? t('delivery.buttons.saving') : t('delivery.buttons.save')}\r\n              </button>",
    to: "              <button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }}>{t('delivery.buttons.cancel')}</button>\r\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting || updateMutation.isPending}>\r\n                {(isSubmitting || updateMutation.isPending) ? t('delivery.buttons.saving') : t('delivery.buttons.save')}\r\n              </button>"
  },
  {
    from: "                    {user?.role === 'admin' && (\r\n                      <button className=\"btn btn-ghost btn-sm\" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)} title={t(\"purchases.delete.aria\") || 'حذف'}><Trash2 size={14}/></button>\r\n                    )}",
    to: "                    {user?.role === 'admin' && (\r\n                      <div style={{ display: 'flex', gap: 4 }}>\r\n                        <button className=\"btn btn-ghost btn-sm\" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingItem(r); reset({ revenue_date: r.revenue_date, payment_method: r.payment_method, platform: r.platform, gross_amount: Number(r.gross_amount), commission_rate: Number(r.commission_rate ?? 0.15), notes: r.notes || '' }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>\r\n                        <button className=\"btn btn-ghost btn-sm\" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)} title={t(\"purchases.delete.aria\") || 'حذف'}><Trash2 size={14}/></button>\r\n                      </div>\r\n                    )}"
  }
]);

// 2. Restaurant
patch('./src/features/revenue/RestaurantRevenuePage.tsx', [
  {
    from: "import { Plus, Download, X } from 'lucide-react'\r\n",
    to: "import { Plus, Download, X, Edit2 } from 'lucide-react'\r\n"
  },
  {
    from: "  const onSubmit = (data: FormData) => {\r\n    createMutation.mutate(data)\r\n  }",
    to: "  const onSubmit = (data: FormData) => {\r\n    if (editingItem) updateMutation.mutate({ id: editingItem.id, data })\r\n    else createMutation.mutate(data)\r\n  }"
  },
  {
    from: "<span className=\"form-card-header-title\">➕ {t('restaurant.newRevenue')}</span>",
    to: "<span className=\"form-card-header-title\">{editingItem ? <Edit2 size={16}/> : '➕'} {editingItem ? 'تعديل السجل' : t('restaurant.newRevenue')}</span>"
  },
  {
    from: "              <button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false) }}>{t('restaurant.buttons.cancel')}</button>\r\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting}>\r\n                {isSubmitting ? t('restaurant.buttons.saving') : t('restaurant.buttons.save')}\r\n              </button>",
    to: "              <button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }}>{t('restaurant.buttons.cancel')}</button>\r\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting || updateMutation.isPending}>\r\n                {(isSubmitting || updateMutation.isPending) ? t('restaurant.buttons.saving') : t('restaurant.buttons.save')}\r\n              </button>"
  },
  {
    from: "                    {user?.role === 'admin' && (\r\n                      <button className=\"btn btn-ghost btn-sm\" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>\r\n                    )}",
    to: "                    {user?.role === 'admin' && (\r\n                      <div style={{ display: 'flex', gap: 4 }}>\r\n                        <button className=\"btn btn-ghost btn-sm\" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingItem(r); reset({ revenue_date: r.revenue_date, payment_method: r.payment_method, amount: Number(r.amount) }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>\r\n                        <button className=\"btn btn-ghost btn-sm\" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>\r\n                      </div>\r\n                    )}"
  }
]);

// 3. Subscriptions
patch('./src/features/revenue/SubscriptionsRevenuePage.tsx', [
  {
    from: "import { Plus, Download, X } from 'lucide-react'\r\n",
    to: "import { Plus, Download, X, Edit2 } from 'lucide-react'\r\n"
  },
  {
    from: "  const onSubmit = (data: FormData) => {\r\n    createMutation.mutate(data)\r\n  }",
    to: "  const onSubmit = (data: FormData) => {\r\n    if (editingItem) updateMutation.mutate({ id: editingItem.id, data })\r\n    else createMutation.mutate(data)\r\n  }"
  },
  {
    from: "<span className=\"form-card-header-title\">➕ {t('subscriptions.newSubscription')}</span>",
    to: "<span className=\"form-card-header-title\">{editingItem ? <Edit2 size={16}/> : '➕'} {editingItem ? 'تعديل السجل' : t('subscriptions.newSubscription')}</span>"
  },
  {
    from: "              <button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false) }}>{t('subscriptions.buttons.cancel')}</button>\r\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting}>\r\n                {isSubmitting ? t('subscriptions.buttons.saving') : t('subscriptions.buttons.save')}\r\n              </button>",
    to: "              <button type=\"button\" className=\"btn btn-secondary\" onClick={() => { reset(); setShowForm(false); setEditingItem(null); }}>{t('subscriptions.buttons.cancel')}</button>\r\n              <button type=\"submit\" className=\"btn btn-primary\" disabled={isSubmitting || updateMutation.isPending}>\r\n                {(isSubmitting || updateMutation.isPending) ? t('subscriptions.buttons.saving') : t('subscriptions.buttons.save')}\r\n              </button>"
  },
  {
    from: "                    {user?.role === 'admin' && (\r\n                      <button className=\"btn btn-ghost btn-sm\" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>\r\n                    )}",
    to: "                    {user?.role === 'admin' && (\r\n                      <div style={{ display: 'flex', gap: 4 }}>\r\n                        <button className=\"btn btn-ghost btn-sm\" style={{ color: 'var(--color-primary)' }} onClick={() => { setEditingItem(r); reset({ revenue_date: r.revenue_date, payment_method: r.payment_method, subscriber_id: r.subscriber_id, amount: Number(r.amount), notes: r.notes || '' }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={14}/></button>\r\n                        <button className=\"btn btn-ghost btn-sm\" style={{ color: 'var(--color-danger)' }} onClick={() => setDeleteId(r.id)}><Trash2 size={14}/></button>\r\n                      </div>\r\n                    )}"
  }
]);

console.log('Done exact patching with \\r\\n');
