import { UserRole } from '../db/schema/users.js'

declare global {
  namespace Express {
    interface Request {
      user: {
        id:       number
        role:     UserRole
        username: string
      }
    }
  }
}
