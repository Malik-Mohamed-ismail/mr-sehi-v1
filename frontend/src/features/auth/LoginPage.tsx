import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import { slideUp } from '../../lib/animations'
import { useTranslation } from 'react-i18next'
import i18n from '../../lib/i18n'

const schema = z.object({
  email:    z.string().email(i18n.t('auth.invalidEmail')),
  password: z.string().min(1, i18n.t('auth.passwordRequired')),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate       = useNavigate()
  const { setAuth }    = useAuthStore()
  const { t }          = useTranslation()
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data)
      setAuth(res.data.data.user, res.data.data.accessToken)
      toast.success(t('auth.welcome') + ' ' + res.data.data.user.full_name)
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message ?? t('auth.loginError'))
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-page)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <motion.div
        variants={slideUp} initial="initial" animate="animate"
        style={{
          width: '100%', maxWidth: 420,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 40px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'var(--gradient-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: 'var(--shadow-gold)',
          }}>
            <Sparkles size={28} color="#0D0F1A"/>
          </div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>{t('layout.title')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{t('auth.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} dir={i18n.dir()}>
          {/* Email */}
          <div className="form-field has-value" style={{ marginBottom: 24 }}>
            <label style={{ top: -8, fontSize: 12 }}>
              {t('auth.email')}
            </label>
            <input
              {...register('email')}
              type="email"
              className={`form-input ${errors.email ? 'is-error' : ''}`}
              placeholder="admin@mrsehi.sa"
            />
            {errors.email && <p style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 6 }}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-field has-value" style={{ marginBottom: 32 }}>
            <label style={{ top: -8, fontSize: 12 }}>
              {t('auth.password')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'is-error' : ''}`}
                placeholder="••••••••"
                style={i18n.dir() === 'rtl' ? { paddingRight: 48 } : { paddingLeft: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{
                  position: 'absolute', 
                  [i18n.dir() === 'rtl' ? 'right' : 'left']: 16, 
                  top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-secondary)', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                aria-label={showPw ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            {errors.password && <p style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 6 }}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center', fontSize: 16, height: 52, borderRadius: 14 }}
          >
            {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
