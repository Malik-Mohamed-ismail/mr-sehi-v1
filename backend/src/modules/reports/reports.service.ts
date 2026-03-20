import { sql } from 'drizzle-orm'
import { db } from '../../config/database.js'
import { getRevenueSummary } from '../revenue/revenue.service.js'
import { calculateBreakEven } from '../../utils/accounting.js'

// ── Income Statement ───────────────────────────────────────────────────────
export async function getIncomeStatement(from: string, to: string) {
  const revenue = await getRevenueSummary(from, to)

  const expenseRows = await db.execute(sql.raw(`
    SELECT account_code, SUM(total_amount) AS total
    FROM expenses
    WHERE is_deleted = false AND expense_date >= '${from}' AND expense_date <= '${to}'
    GROUP BY account_code
  `))

  const purchaseRows = await db.execute(sql.raw(`
    SELECT SUM(subtotal) AS cogs FROM purchase_invoices
    WHERE is_deleted = false AND invoice_date >= '${from}' AND invoice_date <= '${to}'
      AND is_asset = false
  `))

  const totalRevenue  = revenue.grand_total
  const totalCOGS     = Number((purchaseRows.rows[0] as any)?.cogs ?? 0)
  const grossProfit   = totalRevenue - totalCOGS
  const totalExpenses = (expenseRows.rows as any[]).reduce((s: number, r: any) => s + Number(r.total), 0)
  const netProfit     = grossProfit - totalExpenses

  return {
    period: { from, to },
    revenue: {
      delivery:      revenue.delivery_total,
      restaurant:    revenue.restaurant_total,
      subscriptions: revenue.subscriptions_total,
      total:         totalRevenue,
    },
    cogs:           totalCOGS,
    gross_profit:   grossProfit,
    gross_margin:   totalRevenue > 0 ? grossProfit / totalRevenue : 0,
    expenses:       expenseRows.rows,
    total_expenses: totalExpenses,
    net_profit:     netProfit,
    net_margin:     totalRevenue > 0 ? netProfit / totalRevenue : 0,
  }
}

// ── Balance Sheet ─────────────────────────────────────────────────────────
export async function getBalanceSheet(date: string) {
  const result = await db.execute(sql.raw(`
    SELECT
      a.code, a.name_ar, a.type,
      SUM(jel.debit_amount) - SUM(jel.credit_amount) AS balance
    FROM journal_entry_lines jel
    JOIN journal_entries je ON je.id = jel.entry_id
    JOIN accounts a ON a.code = jel.account_code
    WHERE je.entry_date <= '${date}' AND je.is_balanced = true
    GROUP BY a.code, a.name_ar, a.type
    HAVING SUM(jel.debit_amount) - SUM(jel.credit_amount) <> 0
    ORDER BY a.type, a.code
  `))

  const rows     = result.rows as any[]
  const assets      = rows.filter(r => r.type === 'asset')
  const liabilities = rows.filter(r => r.type === 'liability')
  const equity      = rows.filter(r => r.type === 'equity')

  const totalAssets      = assets.reduce((s, r) => s + Number(r.balance), 0)
  const totalLiabilities = liabilities.reduce((s, r) => s + Number(r.balance), 0)
  const totalEquity      = equity.reduce((s, r) => s + Number(r.balance), 0)

  return {
    date,
    assets,      total_assets:      totalAssets,
    liabilities, total_liabilities: totalLiabilities,
    equity,      total_equity:      totalEquity,
    is_balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────
export async function getDashboard(from?: string, to?: string) {
  const now    = new Date()
  const f      = from ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const t      = to   ?? now.toISOString().split('T')[0]
  const income = await getIncomeStatement(f, t)

  const subStats = await db.execute(sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'active' AND is_deleted = false) AS active_subscribers,
      COUNT(*) FILTER (WHERE status = 'expired' AND is_deleted = false) AS expired_subscribers
    FROM subscribers
  `)

  return {
    period: { from: f, to: t },
    revenue:            income.revenue,
    gross_profit:       income.gross_profit,
    gross_margin:       income.gross_margin,
    net_profit:         income.net_profit,
    net_margin:         income.net_margin,
    total_expenses:     income.total_expenses,
    subscribers:        (subStats as any).rows[0],
  }
}

// ── Break-Even ────────────────────────────────────────────────────────────
export async function getBreakevenAnalysis(from: string, to: string) {
  const income = await getIncomeStatement(from, to)

  // Fixed costs = ثابت expenses
  const fixedExpenses = await db.execute(sql.raw(`
    SELECT COALESCE(SUM(total_amount), 0) AS total
    FROM expenses
    WHERE is_deleted = false AND expense_date >= '${from}' AND expense_date <= '${to}'
      AND expense_type = 'ثابت'
  `))
  const fixedCosts = Number((fixedExpenses.rows[0] as any)?.total ?? 0)
  const breakeven  = calculateBreakEven(income.revenue.total, income.cogs, fixedCosts)

  return { period: { from, to }, income_statement: income, ...breakeven }
}

// ── VAT Summary ───────────────────────────────────────────────────────────
export async function getVATSummary(from: string, to: string) {
  const purchases = await db.execute(sql.raw(`
    SELECT COALESCE(SUM(vat_amount), 0) AS total_vat_input
    FROM purchase_invoices
    WHERE is_deleted = false AND invoice_date >= '${from}' AND invoice_date <= '${to}'
  `))
  const totalRevenue   = await getRevenueSummary(from, to)
  const totalVATOutput = totalRevenue.grand_total * 0.15  // 15% on all revenue

  return {
    period:           { from, to },
    vat_input:        Number((purchases as any).rows?.[0]?.total_vat_input ?? 0),
    vat_output:       parseFloat(totalVATOutput.toFixed(4)),
    net_vat_payable:  parseFloat((totalVATOutput - Number((purchases as any).rows?.[0]?.total_vat_input ?? 0)).toFixed(4)),
  }
}

// ── Performance Trends ────────────────────────────────────────────────────
export async function getPerformanceTrends(from: string, to: string) {
  const expenseRows = await db.execute(sql.raw(`
    SELECT TO_CHAR(expense_date, 'YYYY-MM-DD') as date, SUM(total_amount) as amount
    FROM expenses
    WHERE is_deleted = false AND expense_date >= '${from}' AND expense_date <= '${to}'
    GROUP BY TO_CHAR(expense_date, 'YYYY-MM-DD')
  `))

  const purchaseRows = await db.execute(sql.raw(`
    SELECT TO_CHAR(invoice_date, 'YYYY-MM-DD') as date, SUM(subtotal) as amount
    FROM purchase_invoices
    WHERE is_deleted = false AND invoice_date >= '${from}' AND invoice_date <= '${to}' AND is_asset = false
    GROUP BY TO_CHAR(invoice_date, 'YYYY-MM-DD')
  `))

  const revenueRows = await db.execute(sql.raw(`
    SELECT TO_CHAR(je.entry_date, 'YYYY-MM-DD') as date, SUM(jel.credit_amount) - SUM(jel.debit_amount) as amount
    FROM journal_entry_lines jel
    JOIN journal_entries je ON je.id = jel.entry_id
    JOIN accounts a ON a.code = jel.account_code
    WHERE a.type = 'revenue' AND je.entry_date >= '${from}' AND je.entry_date <= '${to}' AND je.is_balanced = true
    GROUP BY TO_CHAR(je.entry_date, 'YYYY-MM-DD')
  `))

  const datesMap = new Map<string, { date: string, revenue: number, expenses: number, profit: number }>()

  const addData = (rows: any[], type: 'revenue' | 'expenses') => {
    for (const row of rows) {
      if (!row.date) continue
      if (!datesMap.has(row.date)) datesMap.set(row.date, { date: row.date, revenue: 0, expenses: 0, profit: 0 })
      const obj = datesMap.get(row.date)!
      obj[type] += Number(row.amount ?? 0)
      obj.profit = obj.revenue - obj.expenses
    }
  }

  addData(revenueRows.rows, 'revenue')
  addData(expenseRows.rows, 'expenses')
  addData(purchaseRows.rows, 'expenses')

  return Array.from(datesMap.values()).sort((a, b) => a.date.localeCompare(b.date))
}
