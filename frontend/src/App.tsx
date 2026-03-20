import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AppShell } from './components/layout/AppShell'
import { useAuthStore } from './store/authStore'
import './index.css'

const LoginPage                = lazy(() => import('./features/auth/LoginPage'))
const DashboardPage            = lazy(() => import('./features/dashboard/DashboardPage'))
const PurchasesPage            = lazy(() => import('./features/purchases/PurchasesPage'))
const DeliveryRevenuePage      = lazy(() => import('./features/revenue/DeliveryRevenuePage'))
const RestaurantRevenuePage    = lazy(() => import('./features/revenue/RestaurantRevenuePage'))
const SubscriptionsRevenuePage = lazy(() => import('./features/revenue/SubscriptionsRevenuePage'))
const SubscribersPage          = lazy(() => import('./features/subscribers/SubscribersPage'))
const SuppliersPage            = lazy(() => import('./features/suppliers/SuppliersPage'))
const JournalPage              = lazy(() => import('./features/journal/JournalPage'))
const ExpensesPage             = lazy(() => import('./features/expenses/ExpensesPage'))
const PettyCashPage            = lazy(() => import('./features/petty-cash/PettyCashPage'))
const ProductionPage           = lazy(() => import('./features/production/ProductionPage'))
const AccountsPage             = lazy(() => import('./features/accounts/AccountsPage'))
const IncomeStatementPage      = lazy(() => import('./features/reports/IncomeStatementPage'))
const PerformancePage          = lazy(() => import('./features/reports/PerformancePage'))
const SettingsPage             = lazy(() => import('./features/settings/SettingsPage'))
const TrialBalancePage         = lazy(() =>
  import('./features/reports/TrialBalancePage').then(m => ({ default: m.TrialBalancePage }))
)
const LedgerPage               = lazy(() =>
  import('./features/reports/TrialBalancePage').then(m => ({ default: m.LedgerPage }))
)

function ComingSoon({ title }: { title: string }) {
  return (
    <div style={{ padding: '60px 24px', textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
        background: 'var(--color-primary-light)', border: '2px solid var(--color-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
      }}>⏳</div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>هذه الصفحة قيد التطوير</p>
    </div>
  )
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 2 * 60 * 1000, refetchOnWindowFocus: false } },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div style={{ padding: 24 }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 80, marginBottom: 12, borderRadius: 12 }} />
        ))}
      </div>
    }>
      {children}
    </Suspense>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PageSuspense><LoginPage /></PageSuspense>} />
          <Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"             element={<PageSuspense><DashboardPage /></PageSuspense>} />
            <Route path="revenue/delivery"      element={<PageSuspense><DeliveryRevenuePage /></PageSuspense>} />
            <Route path="revenue/restaurant"    element={<PageSuspense><RestaurantRevenuePage /></PageSuspense>} />
            <Route path="revenue/subscriptions" element={<PageSuspense><SubscriptionsRevenuePage /></PageSuspense>} />
            <Route path="purchases"             element={<PageSuspense><PurchasesPage /></PageSuspense>} />
            <Route path="expenses"              element={<PageSuspense><ExpensesPage /></PageSuspense>} />
            <Route path="petty-cash"            element={<PageSuspense><PettyCashPage /></PageSuspense>} />
            <Route path="suppliers"             element={<PageSuspense><SuppliersPage /></PageSuspense>} />
            <Route path="subscribers"           element={<PageSuspense><SubscribersPage /></PageSuspense>} />
            <Route path="production"            element={<PageSuspense><ProductionPage /></PageSuspense>} />
            <Route path="accounts"              element={<PageSuspense><AccountsPage /></PageSuspense>} />
            <Route path="journal"               element={<PageSuspense><JournalPage /></PageSuspense>} />
            <Route path="ledger"                element={<PageSuspense><LedgerPage /></PageSuspense>} />
            <Route path="trial-balance"         element={<PageSuspense><TrialBalancePage /></PageSuspense>} />
            <Route path="income-statement"      element={<PageSuspense><IncomeStatementPage /></PageSuspense>} />
            <Route path="performance"           element={<PageSuspense><PerformancePage /></PageSuspense>} />
            <Route path="reports"               element={<ComingSoon title="التقارير والتحليلات" />} />
            <Route path="settings"              element={<PageSuspense><SettingsPage /></PageSuspense>} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-arabic)', direction: 'rtl',
            borderRadius: '12px', boxShadow: 'var(--shadow-lg)',
          },
        }}
      />
    </QueryClientProvider>
  )
}
