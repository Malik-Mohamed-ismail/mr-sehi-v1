import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  title?:  string
  message?: string
  icon?:   React.ReactNode
}

/**
 * Shown when a list query returns no results.
 * Uses the design system colors to stay consistent with the rest of the UI.
 */
export function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            16,
      padding:        '64px 24px',
      textAlign:      'center',
    }}>
      <div style={{
        width:          72,
        height:         72,
        borderRadius:   '50%',
        background:     'rgba(212,168,83,0.08)',
        border:         '1px solid rgba(212,168,83,0.18)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        color:          '#D4A853',
      }}>
        {icon ?? <SearchX size={28} strokeWidth={1.5} />}
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
          {title ?? 'لا توجد بيانات'}
        </div>
        {message && (
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 320 }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
