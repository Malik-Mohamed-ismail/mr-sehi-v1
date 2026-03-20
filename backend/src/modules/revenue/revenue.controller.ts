// ── Controller ────────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express'
import * as svc from './revenue.service.js'

export async function listDelivery(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await svc.listDeliveryRevenue(req.query) }) }
  catch (err) { next(err) }
}
export async function createDelivery(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await svc.createDeliveryRevenue(req.body, req.user.id), message: 'تم حفظ إيراد التوصيل' }) }
  catch (err) { next(err) }
}
export async function listRestaurant(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await svc.listRestaurantRevenue(req.query) }) }
  catch (err) { next(err) }
}
export async function createRestaurant(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await svc.createRestaurantRevenue(req.body, req.user.id), message: 'تم حفظ إيراد المطعم' }) }
  catch (err) { next(err) }
}
export async function listSubscriptions(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await svc.listSubscriptionRevenue(req.query) }) }
  catch (err) { next(err) }
}
export async function createSubscription(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await svc.createSubscriptionRevenue(req.body, req.user.id), message: 'تم حفظ إيراد الاشتراكات' }) }
  catch (err) { next(err) }
}
export async function summary(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to } = req.query as any
    res.json({ success: true, data: await svc.getRevenueSummary(from, to) })
  } catch (err) { next(err) }
}
export async function dailySeries(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to } = req.query as any
    res.json({ success: true, data: await svc.getDailySeries(from, to) })
  } catch (err) { next(err) }
}
