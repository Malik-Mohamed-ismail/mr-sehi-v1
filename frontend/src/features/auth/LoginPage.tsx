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
          width: '100%', maxWidth: 440,
          background: '#FFFFFF',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.30)',
          position: 'relative', zIndex: 1,
          border: '1px solid rgba(43,146,37,0.08)',
        }}
      >
        {/* Animated gradient header */}
        <div style={{
          background: 'linear-gradient(135deg, #132E11 0%, #1F6E1A 50%, #1A3D18 100%)',
          padding: '40px 32px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `
              radial-gradient(circle at 20% 50%, rgba(212,168,83,0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 30%, rgba(43,146,37,0.20) 0%, transparent 50%)
            `,
          }}/>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <img
              src="/logo_icon_only.png"
              alt="مستر صحي"
              style={{ 
                width: 64, 
                height: 64, 
                objectFit: 'contain', 
                marginBottom: 16,
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
              }}
            />
            <div style={{ 
              fontSize: 24, 
              fontWeight: 800, 
              color: '#FFFFFF', 
              marginBottom: 8,
              letterSpacing: '-0.5px',
            }}>
              {t('layout.title') || 'مستر صحي'}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: 'rgba(255,255,255,0.70)', 
              opacity: 0.85,
              fontWeight: 500,
            }}>
              {t('auth.subtitle')}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '40px 32px' }}>
          <h2 style={{ 
            color: '#132E11', 
            fontSize: 20, 
            fontWeight: 700, 
            marginBottom: 8,
            letter: 'spacing: -0.3px',
          }}>
            {t('auth.loginTitle')}
          </h2>
          <p style={{ 
            color: '#8A9E88', 
            fontSize: 14, 
            marginBottom: 32,
            lineHeight: 1.5,
          }}>
            {t('auth.loginSubtitle')}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} dir={i18n.dir()}>
            {/* Email */}
            <div className="form-field has-value" style={{ marginBottom: 24 }}>
              <label style={{ 
                top: -10, 
                fontSize: 13, 
                background: '#FFFFFF',
                fontWeight: 600,
                color: '#2B6B27',
              }}>
                {t('auth.email')}
              </label>
              <input
                {...register('email')}
                type="email"
                className={`form-input ${errors.email ? 'is-error' : ''}`}
                placeholder={t('auth.emailPlaceholder')}
                style={{
                  borderRadius: 6,
                  fontSize: 14,
                  padding: '12px 16px',
                  transition: 'all 0.2s ease',
                }}
              />
              {errors.email && <p style={{ color: '#E8384D', fontSize: 12, marginTop: 8, fontWeight: 500 }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="form-field has-value" style={{ marginBottom: 32 }}>
              <label style={{ 
                top: -10, 
                fontSize: 13, 
                background: '#FFFFFF',
                fontWeight: 600,
                color: '#2B6B27',
              }}>
                {t('auth.password')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'is-error' : ''}`}
                  placeholder="••••••••"
                  style={{
                    borderRadius: 6,
                    fontSize: 14,
                    padding: '12px 16px',
                    paddingLeft: i18n.dir() === 'rtl' ? 16 : 48,
                    paddingRight: i18n.dir() === 'rtl' ? 48 : 16,
                    transition: 'all 0.2s ease',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{
                    position: 'absolute',
                    [i18n.dir() === 'rtl' ? 'right' : 'left']: 14,
                    top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#A0B8A0', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'color 0.2s ease',
                  }}
                  aria-label={showPw ? t('auth.hidePassword') : t('auth.showPassword')}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2B6B27'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#A0B8A0'}
                >
                  {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              {errors.password && <p style={{ color: '#E8384D', fontSize: 12, marginTop: 8, fontWeight: 500 }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                fontSize: 16, 
                height: 48, 
                borderRadius: 6,
                fontWeight: 600,
                letterSpacing: '-0.2px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

          {/* Decorative footer line */}
          <div style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid rgba(43,146,37,0.08)',
            textAlign: 'center',
            fontSize: 12,
            color: '#A0B8A0',
          }}>
            {t('auth.footerNote') || 'Secure authentication powered by مستر صحي'}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
