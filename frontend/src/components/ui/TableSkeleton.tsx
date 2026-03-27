interface TableSkeletonProps {
  rows?:    number
  columns?: number
}

/**
 * Animated skeleton placeholder for tables while data is loading.
 * Renders `rows` rows with `columns` cells each.
 */
export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      {/* Header skeleton */}
      <div style={{
        display:       'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap:           12,
        padding:       '12px 16px',
        borderBottom:  '1px solid var(--color-border)',
        marginBottom:  4,
      }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 14, borderRadius: 4, opacity: 0.5 }} />
        ))}
      </div>

      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          style={{
            display:             'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap:                 12,
            padding:             '14px 16px',
            borderBottom:        '1px solid var(--color-border)',
            animationDelay:      `${row * 80}ms`,
          }}
        >
          {Array.from({ length: columns }).map((_, col) => (
            <div
              key={col}
              className="skeleton"
              style={{
                height:       18,
                borderRadius: 4,
                width:        col === 0 ? '60%' : '85%',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
