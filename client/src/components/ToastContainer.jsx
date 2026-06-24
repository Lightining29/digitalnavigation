export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      maxWidth: 380,
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="neu-raised"
          onClick={() => onRemove(t.id)}
          style={{
            padding: '12px 20px',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 500,
            borderLeft: `4px solid ${
              t.type === 'success' ? 'var(--success)' : t.type === 'error' ? 'var(--danger)' : 'var(--accent)'
            }`,
            color: t.type === 'error' ? 'var(--danger)' : 'var(--text)',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
