import { Router, Request, Response, NextFunction } from 'express'
import { and, desc, eq, sql } from 'drizzle-orm'
import { db } from '../../config/database.js'
import { auditLog } from '../../db/schema/auditLog.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize, ADMIN_ONLY } from '../../middleware/authorize.js'

const router = Router()
router.use(authenticate, authorize(...ADMIN_ONLY))

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to, user_id, action, table_name } = req.query as any
    const conditions: any[] = []
    if (from)       conditions.push(sql`${auditLog.created_at} >= ${from}`)
    if (to)         conditions.push(sql`${auditLog.created_at} <= ${to + 'T23:59:59'}`)
    if (user_id)    conditions.push(eq(auditLog.user_id, Number(user_id)))
    if (action)     conditions.push(eq(auditLog.action as any, action))
    if (table_name) conditions.push(eq(auditLog.table_name, table_name))

    const page  = Number(req.query.page  ?? 1)
    const limit = Number(req.query.limit ?? 50)
    const rows  = await db.select().from(auditLog)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(auditLog.created_at))
      .limit(limit).offset((page - 1) * limit)

    res.json({ success: true, data: rows, page, limit })
  } catch (e) { next(e) }
})

export default router
