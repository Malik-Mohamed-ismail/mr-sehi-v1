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
      height: '100vh',
      background: 'linear-gradient(160deg, #0C2010 0%, #132E11 45%, #1A4515 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glowing orbs background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,146,37,0.18) 0%, transparent 70%)', top: '-10%', right: '-10%' }}/>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,100,27,0.22) 0%, transparent 70%)', bottom: '-15%', left: '-10%' }}/>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,83,0.07) 0%, transparent 70%)', top: '40%', left: '30%' }}/>
      </div>

      <motion.div
        variants={slideUp} initial="initial" animate="animate"
        style={{
          width: '100%', maxWidth: 440,
          background: '#FFFFFF',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.30)',
          position: 'relative', zIndex: 1,
          border: '1px solid rgba(43,146,37,0.08)',
        }}
      >
        {/* Animated gradient header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2510 0%, #1A4A19 50%, #132E11 100%)',
          padding: '28px 32px 24px',
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
            <div style={{
              width: 64, height: 64,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            }}>
              <img
                src="/logo_icon_only.png"
                alt="مستر صحي"
                style={{ 
                  width: 44, 
                  height: 44, 
                  objectFit: 'contain',
                }}
              />
            </div>
            <div style={{ 
              fontSize: 20, 
              fontWeight: 800, 
              color: '#FFFFFF', 
              marginBottom: 4,
              letterSpacing: '-0.3px',
            }}>
              {t('layout.title') || 'مستر صحي'}
            </div>
            <div style={{ 
              fontSize: 11, 
              color: 'rgba(255,255,255,0.60)', 
              fontWeight: 500,
            }}>
              {t('auth.subtitle')}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '32px 32px 40px' }}>
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
                  borderRadius: 2,
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
                    borderRadius: 2,
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
                borderRadius: 2,
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
