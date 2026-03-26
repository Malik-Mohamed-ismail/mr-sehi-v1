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
const SupplierLedgerPage       = lazy(() => import('./features/suppliers/SupplierLedgerPage'))
const JournalPage              = lazy(() => import('./features/journal/JournalPage'))
const ExpensesPage             = lazy(() => import('./features/expenses/ExpensesPage'))
const FixedAssetsPage          = lazy(() => import('./features/fixed-assets/FixedAssetsPage'))
const PettyCashPage            = lazy(() => import('./features/petty-cash/PettyCashPage'))
const ProductionPage           = lazy(() => import('./features/production/ProductionPage'))
const ProductionSummaryPage    = lazy(() => import('./features/production/ProductionSummaryPage').then(m => ({ default: m.ProductionSummaryPage })))
const AccountsPage             = lazy(() => import('./features/accounts/AccountsPage'))
const IncomeStatementPage      = lazy(() => import('./features/reports/IncomeStatementPage'))
const PerformancePage          = lazy(() => import('./features/reports/PerformancePage'))
const BalanceSheetPage         = lazy(() => import('./features/reports/BalanceSheetPage'))
const CashFlowPage             = lazy(() => import('./features/reports/CashFlowPage'))
const ChannelAnalysisPage      = lazy(() => import('./features/reports/ChannelAnalysisPage'))
const WasteAnalysisPage        = lazy(() => import('./features/reports/WasteAnalysisPage'))
const BreakEvenPage            = lazy(() => import('./features/reports/BreakEvenPage'))
const VATSummaryPage           = lazy(() => import('./features/reports/VATSummaryPage'))
const ReportsHubPage           = lazy(() => import('./features/reports/ReportsHubPage'))
const AuditLogPage             = lazy(() => import('./features/settings/AuditLogPage'))
const UsersPage                = lazy(() => import('./features/settings/UsersPage'))
const SettingsPage             = lazy(() => import('./features/settings/SettingsPage'))
const TrialBalancePage         = lazy(() =>
  import('./features/reports/TrialBalancePage').then(m => ({ default: m.TrialBalancePage }))
)
const LedgerPage               = lazy(() =>
  import('./features/reports/TrialBalancePage').then(m => ({ default: m.LedgerPage }))
)

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 0, refetchOnWindowFocus: true } },
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
          <div key={i} className="skeleton" style={{ height: 80, marginBottom: 12, borderRadius: 2 }} />
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
            <Route path="fixed-assets"          element={<PageSuspense><FixedAssetsPage /></PageSuspense>} />
            <Route path="petty-cash"            element={<PageSuspense><PettyCashPage /></PageSuspense>} />
            <Route path="suppliers"             element={<PageSuspense><SuppliersPage /></PageSuspense>} />
            <Route path="suppliers/:id/ledger"  element={<PageSuspense><SupplierLedgerPage /></PageSuspense>} />
            <Route path="subscribers"           element={<PageSuspense><SubscribersPage /></PageSuspense>} />
            <Route path="production"            element={<PageSuspense><ProductionPage /></PageSuspense>} />
            <Route path="production/summary"    element={<PageSuspense><ProductionSummaryPage /></PageSuspense>} />
            <Route path="accounts"              element={<PageSuspense><AccountsPage /></PageSuspense>} />
            <Route path="journal"               element={<PageSuspense><JournalPage /></PageSuspense>} />
            <Route path="ledger"                element={<PageSuspense><LedgerPage /></PageSuspense>} />
            <Route path="trial-balance"         element={<PageSuspense><TrialBalancePage /></PageSuspense>} />
            <Route path="income-statement"      element={<PageSuspense><IncomeStatementPage /></PageSuspense>} />
            <Route path="performance"           element={<PageSuspense><PerformancePage /></PageSuspense>} />
            <Route path="balance-sheet"         element={<PageSuspense><BalanceSheetPage /></PageSuspense>} />
            <Route path="cash-flow"             element={<PageSuspense><CashFlowPage /></PageSuspense>} />
            <Route path="channel-analysis"      element={<PageSuspense><ChannelAnalysisPage /></PageSuspense>} />
            <Route path="waste-analysis"        element={<PageSuspense><WasteAnalysisPage /></PageSuspense>} />
            <Route path="breakeven"             element={<PageSuspense><BreakEvenPage /></PageSuspense>} />
            <Route path="vat-summary"           element={<PageSuspense><VATSummaryPage /></PageSuspense>} />
            <Route path="audit-log"             element={<PageSuspense><AuditLogPage /></PageSuspense>} />
            <Route path="users"                 element={<PageSuspense><UsersPage /></PageSuspense>} />
            <Route path="reports"               element={<PageSuspense><ReportsHubPage /></PageSuspense>} />
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
            fontFamily: 'var(--font-arabic)', 
            direction: 'rtl',
            borderRadius: 2, 
            padding: '16px 20px',
            fontSize: '15px',
            fontWeight: 600,
            boxShadow: 'var(--shadow-lg)',
          },
        }}
      />
    </QueryClientProvider>
  )
}
