export default function Sayfalama({ veri, onDegistir }) {
  if (!veri) return null;
  return (
    <div className="d-flex justify-content-between align-items-center">
      <small className="text-muted">
        Sayfa {veri.number + 1} / {Math.max(veri.totalPages, 1)} — Toplam {veri.totalElements} kayıt
      </small>
      <div>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary me-1"
          disabled={veri.first}
          onClick={() => onDegistir(-1)}
        >
          <i className="fas fa-chevron-left" /> Önceki
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          disabled={veri.last}
          onClick={() => onDegistir(1)}
        >
          Sonraki <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}
