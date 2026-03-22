import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
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
      background: 'linear-gradient(145deg, #132E11 0%, #1A3D18 40%, #2B6B27 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative radial gradients */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 30% 60%, rgba(196,122,60,0.15) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 20%, rgba(43,146,37,0.20) 0%, transparent 50%)
        `,
      }}/>

      <motion.div
        variants={slideUp} initial="initial" animate="animate"
        style={{
          width: '100%', maxWidth: 420,
          background: '#FFFFFF',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.40)',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Card Header — dark green */}
        <div style={{
          background: '#132E11',
          padding: '32px 32px 24px',
          textAlign: 'center',
          borderBottom: '3px solid #C47A3C',
        }}>
          <img
            src="/logo_icon_only.png"
            alt="مستر صحي"
            style={{ width: 72, height: 72, objectFit: 'contain', marginBottom: 12 }}
          />
          <div style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
            {t('layout.title') || 'مستر صحي'}
          </div>
          <div style={{ fontSize: 13, color: '#C8DEC6', opacity: 0.75 }}>
            {t('auth.subtitle')}
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: 32 }}>
          <h2 style={{ color: '#1A2B18', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            {t('auth.loginTitle')}
          </h2>
          <p style={{ color: '#8A9E88', fontSize: 14, marginBottom: 28 }}>
            {t('auth.loginSubtitle')}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} dir={i18n.dir()}>
            {/* Email */}
            <div className="form-field has-value" style={{ marginBottom: 24 }}>
              <label style={{ top: -8, fontSize: 12, background: '#FFFFFF' }}>
                {t('auth.email')}
              </label>
              <input
                {...register('email')}
                type="email"
                className={`form-input ${errors.email ? 'is-error' : ''}`}
                placeholder={t('auth.emailPlaceholder')}
              />
              {errors.email && <p style={{ color: '#E8384D', fontSize: 12, marginTop: 6 }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="form-field has-value" style={{ marginBottom: 32 }}>
              <label style={{ top: -8, fontSize: 12, background: '#FFFFFF' }}>
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
                    color: '#8A9E88', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  aria-label={showPw ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              {errors.password && <p style={{ color: '#E8384D', fontSize: 12, marginTop: 6 }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', fontSize: 16, height: 52, borderRadius: 14 }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 16, height: 16,
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}/>
                  {t('auth.loggingIn')}
                </span>
              ) : (
                t('auth.login')
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
