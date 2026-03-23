export default function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <span>{t.type === 'error' ? '❌' : '✅'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
