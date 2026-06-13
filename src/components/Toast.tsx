export function Toast({ message }: { message: string }) {
  return (
    <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: '#2E2A24', color: '#F6F1E7', borderRadius: 999, padding: '14px 32px', fontSize: 14, fontWeight: 500, boxShadow: '0 8px 24px rgba(46,42,36,0.3)', zIndex: 100, animation: 'toastIn 0.2s ease' }}>
      {message}
    </div>
  );
}
