export default function DurumBadge({ durum }) {
  return durum === 'TAMAMLANDI' ? (
    <span className="badge bg-dark">Tamamlandı</span>
  ) : (
    <span className="badge bg-success">Aktif</span>
  );
}
