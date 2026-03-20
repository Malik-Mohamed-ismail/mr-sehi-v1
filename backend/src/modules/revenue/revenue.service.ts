import { eq, and, desc, sql } from 'drizzle-orm'
import { db } from '../../config/database.js'
import { deliveryRevenue, restaurantRevenue, subscriptionRevenue } from '../../db/schema/revenue.js'
import { subscribers } from '../../db/schema/subscribers.js'
import { journalEntries, journalEntryLines } from '../../db/schema/journal.js'
import { generateEntryNumber } from '../../utils/entryNumberGenerator.js'
import { validateJournalBalance } from '../../utils/accounting.js'
import { writeAuditLog } from '../../utils/auditLogger.js'
import { AppError } from '../../utils/AppError.js'

// ── Delivery ─────────────────────────────────────────────────────────────
async function createRevenueJournalEntry(tx: any, amount: number, description: string, date: string, paymentMethod: string, userId: number) {
  const REVENUE_ACCOUNT   = '410101'
  const PAYMENT_ACCOUNTS: Record<string, string> = { 'كاش': '1101', 'بنك': '1104', 'آجل': '1201' }
  const creditAccount     = PAYMENT_ACCOUNTS[paymentMethod] ?? '1104'
  const lines             = [
    { account_code: creditAccount,    debit_amount: amount, credit_amount: 0 },
    { account_code: REVENUE_ACCOUNT,  debit_amount: 0, credit_amount: amount },
  ]
  const { isBalanced } = validateJournalBalance(lines)
  if (!isBalanced) throw new AppError('JOURNAL_UNBALANCED', 422)

  const entryNumber = await generateEntryNumber(tx, 'R')
  const [entry] = await tx.insert(journalEntries).values({
    entry_number: entryNumber, entry_date: date,
    description, source_type: 'revenue', is_balanced: true, created_by: userId,
  } as any).returning()
  await tx.insert(journalEntryLines).values(lines.map((l: any) => ({ ...l, entry_id: entry.id })))
  return entry
}

export async function createDeliveryRevenue(dto: any, userId: number) {
  return db.transaction(async (tx) => {
    const net = parseFloat((Number(dto.gross_amount) - Number(dto.commission_amount ?? 0)).toFixed(4))
    const [row] = await tx.insert(deliveryRevenue).values({
      ...dto, net_amount: String(net), created_by: userId,
    } as any).returning()
    const entry = await createRevenueJournalEntry(tx, net, `إيراد توصيل — ${dto.platform}`, dto.revenue_date, dto.payment_method, userId)
    await tx.update(deliveryRevenue).set({ journal_entry_id: entry.id } as any).where(eq(deliveryRevenue.id, row.id))
    await writeAuditLog(tx, { userId, action: 'CREATE', tableName: 'delivery_revenue', recordId: row.id, newValues: row })
    return row
  })
}

export async function listDeliveryRevenue(query: any) {
  const conditions: any[] = [eq(deliveryRevenue.is_deleted, false)]
  if (query.from)     conditions.push(sql`${deliveryRevenue.revenue_date} >= ${query.from}`)
  if (query.to)       conditions.push(sql`${deliveryRevenue.revenue_date} <= ${query.to}`)
  if (query.platform) conditions.push(eq(deliveryRevenue.platform as any, query.platform))
  const rows = await db.select().from(deliveryRevenue)
    .where(and(...conditions)).orderBy(desc(deliveryRevenue.revenue_date))
  return rows
}

// ── Restaurant ────────────────────────────────────────────────────────────
export async function createRestaurantRevenue(dto: any, userId: number) {
  return db.transaction(async (tx) => {
    const [row] = await tx.insert(restaurantRevenue).values({ ...dto, created_by: userId } as any).returning()
    const entry = await createRevenueJournalEntry(tx, Number(dto.amount), 'إيراد مطعم', dto.revenue_date, dto.payment_method, userId)
    await tx.update(restaurantRevenue).set({ journal_entry_id: entry.id } as any).where(eq(restaurantRevenue.id, row.id))
    await writeAuditLog(tx, { userId, action: 'CREATE', tableName: 'restaurant_revenue', recordId: row.id, newValues: row })
    return row
  })
}

export async function listRestaurantRevenue(query: any) {
  const conditions: any[] = [eq(restaurantRevenue.is_deleted, false)]
  if (query.from) conditions.push(sql`${restaurantRevenue.revenue_date} >= ${query.from}`)
  if (query.to)   conditions.push(sql`${restaurantRevenue.revenue_date} <= ${query.to}`)
  return db.select().from(restaurantRevenue).where(and(...conditions)).orderBy(desc(restaurantRevenue.revenue_date))
}

// ── Subscriptions ─────────────────────────────────────────────────────────
export async function createSubscriptionRevenue(dto: any, userId: number) {
  return db.transaction(async (tx) => {
    const [row] = await tx.insert(subscriptionRevenue).values({ ...dto, created_by: userId } as any).returning()
    const entry = await createRevenueJournalEntry(tx, Number(dto.amount), 'إيراد اشتراكات', dto.revenue_date, dto.payment_method, userId)
    await tx.update(subscriptionRevenue).set({ journal_entry_id: entry.id } as any).where(eq(subscriptionRevenue.id, row.id))
    await writeAuditLog(tx, { userId, action: 'CREATE', tableName: 'subscription_revenue', recordId: row.id, newValues: row })
    return row
  })
}

export async function listSubscriptionRevenue(query: any) {
  const conditions: any[] = [eq(subscriptionRevenue.is_deleted, false)]
  if (query.from) conditions.push(sql`${subscriptionRevenue.revenue_date} >= ${query.from}`)
  if (query.to)   conditions.push(sql`${subscriptionRevenue.revenue_date} <= ${query.to}`)
  return db.select().from(subscriptionRevenue).where(and(...conditions)).orderBy(desc(subscriptionRevenue.revenue_date))
}

// ── Summary + Daily Series ─────────────────────────────────────────────────
export async function getRevenueSummary(from?: string, to?: string) {
  const buildCond = (table: any, dateCol: any) => {
    const c: any[] = [eq(table.is_deleted, false)]
    if (from) c.push(sql`${dateCol} >= ${from}`)
    if (to)   c.push(sql`${dateCol} <= ${to}`)
    return c
  }
  const [delivTotals, restTotals, subsTotals] = await Promise.all([
    db.select({ total: sql<number>`coalesce(sum(net_amount), 0)::numeric` })
      .from(deliveryRevenue).where(and(...buildCond(deliveryRevenue, deliveryRevenue.revenue_date))),
    db.select({ total: sql<number>`coalesce(sum(amount), 0)::numeric` })
      .from(restaurantRevenue).where(and(...buildCond(restaurantRevenue, restaurantRevenue.revenue_date))),
    db.select({ total: sql<number>`coalesce(sum(amount), 0)::numeric` })
      .from(subscriptionRevenue).where(and(...buildCond(subscriptionRevenue, subscriptionRevenue.revenue_date))),
  ])
  const delivery     = Number(delivTotals[0].total)
  const restaurant   = Number(restTotals[0].total)
  const subscription = Number(subsTotals[0].total)
  const grandTotal   = delivery + restaurant + subscription
  return {
    delivery_total:      delivery,
    restaurant_total:    restaurant,
    subscriptions_total: subscription,
    grand_total:         grandTotal,
    channel_pct: {
      delivery:     grandTotal > 0 ? delivery     / grandTotal : 0,
      restaurant:   grandTotal > 0 ? restaurant   / grandTotal : 0,
      subscriptions:grandTotal > 0 ? subscription / grandTotal : 0,
    },
  }
}

export async function getDailySeries(from?: string, to?: string) {
  const result = await db.execute(sql`
    WITH dates AS (
      SELECT generate_series(
        CAST(${from ? sql`${from}` : sql`(now() - interval '30 days')`} AS date),
        CAST(${to   ? sql`${to}`   : sql`now()`} AS date),
        '1 day'::interval
      )::date AS d
    ),
    delivery_daily AS (
      SELECT revenue_date, SUM(net_amount) AS amount FROM delivery_revenue
      WHERE is_deleted = false ${from ? sql`AND revenue_date >= ${from}` : sql``} ${to ? sql`AND revenue_date <= ${to}` : sql``}
      GROUP BY revenue_date
    ),
    restaurant_daily AS (
      SELECT revenue_date, SUM(amount) AS amount FROM restaurant_revenue
      WHERE is_deleted = false ${from ? sql`AND revenue_date >= ${from}` : sql``} ${to ? sql`AND revenue_date <= ${to}` : sql``}
      GROUP BY revenue_date
    ),
    subscription_daily AS (
      SELECT revenue_date, SUM(amount) AS amount FROM subscription_revenue
      WHERE is_deleted = false ${from ? sql`AND revenue_date >= ${from}` : sql``} ${to ? sql`AND revenue_date <= ${to}` : sql``}
      GROUP BY revenue_date
    )
    SELECT
      dates.d AS date,
      COALESCE(dd.amount, 0) AS delivery,
      COALESCE(rd.amount, 0) AS restaurant,
      COALESCE(sd.amount, 0) AS subscriptions,
      COALESCE(dd.amount, 0) + COALESCE(rd.amount, 0) + COALESCE(sd.amount, 0) AS total
    FROM dates
    LEFT JOIN delivery_daily     dd ON dd.revenue_date = dates.d
    LEFT JOIN restaurant_daily   rd ON rd.revenue_date = dates.d
    LEFT JOIN subscription_daily sd ON sd.revenue_date = dates.d
    ORDER BY dates.d
  `)
  return result.rows
}
