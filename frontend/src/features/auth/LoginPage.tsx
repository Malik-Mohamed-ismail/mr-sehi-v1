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
      background: 'var(--gradient-hero)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* Glow */}
      <div style={{
        position: 'fixed', top: '20%', right: '30%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,168,83,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <motion.div
        variants={slideUp} initial="initial" animate="animate"
        style={{
          width: '100%', maxWidth: 400,
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 36px',
          boxShadow: 'var(--shadow-lg), var(--shadow-gold)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--gradient-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: 'var(--shadow-gold)',
          }}>
            <Sparkles size={24} color="#0D0F1A"/>
          </div>
          <h1 style={{ color: '#EDE9E0', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t('layout.title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 13 }}>{t('auth.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} dir={i18n.dir()}>
          {/* Email */}
          <div className="form-field has-value" style={{ marginBottom: 20 }}>
            <label style={{ background: 'transparent', color: 'rgba(255,255,255,0.50)', top: -8, fontSize: 11 }}>
              {t('auth.email')}
            </label>
            <input
              {...register('email')}
              type="email"
              className={`form-input ${errors.email ? 'is-error' : ''}`}
              placeholder="admin@mrsehi.sa"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#EDE9E0', borderColor: 'rgba(255,255,255,0.12)' }}
            />
            {errors.email && <p style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-field has-value" style={{ marginBottom: 28 }}>
            <label style={{ background: 'transparent', color: 'rgba(255,255,255,0.50)', top: -8, fontSize: 11 }}>
              {t('auth.password')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'is-error' : ''}`}
                placeholder="••••••••"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#EDE9E0', borderColor: 'rgba(255,255,255,0.12)', paddingLeft: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.40)', padding: 0,
                }}
                aria-label={showPw ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
            {errors.password && <p style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}
          >
            {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
