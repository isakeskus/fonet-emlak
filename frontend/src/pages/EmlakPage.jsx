import { useCallback, useEffect, useRef, useState } from 'react';
import { emlakApi, musteriApi } from '../api/services';
import { useAlert } from '../context/AlertContext.jsx';
import useSayfaliVeri from '../hooks/useSayfaliVeri';
import Sayfalama from '../components/Sayfalama.jsx';
import DurumBadge from '../components/DurumBadge.jsx';
import { formatPrice, parseFloatOrNull, parseIntOrNull } from '../utils/format';
import {
  DURUMLAR,
  EMLAK_TURLERI,
  ISINMA_TURLERI,
  ISLEM_TURLERI,
  SAYFA_BOYUTU,
} from '../utils/secenekler';

const BOS = {
  musteriId: '',
  islemTuru: 'KİRALIK',
  emlakTuru: 'DAİRE',
  metrekare: '',
  odaSayisi: '',
  salonSayisi: '',
  bulunduguKat: '',
  binaKati: '',
  isinmaTuru: '',
  fiyat: '',
  komisyonOrani: '2',
  durum: 'AKTİF',
};

function Secenekler({ liste, bosEtiket }) {
  return (
    <>
      {bosEtiket && <option value="">{bosEtiket}</option>}
      {liste.map((s) => (
        <option key={s.deger} value={s.deger}>
          {s.ad}
        </option>
      ))}
    </>
  );
}

export default function EmlakPage() {
  const showAlert = useAlert();
  const formRef = useRef(null);
  const [musteriler, setMusteriler] = useState([]);
  const [form, setForm] = useState(BOS);
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  const getir = useCallback((sayfa) => emlakApi.liste(sayfa, SAYFA_BOYUTU), []);
  const { veri, setSayfa, yukleniyor, hata, yenile } = useSayfaliVeri(getir);

  useEffect(() => {
    musteriApi
      .liste()
      .then(setMusteriler)
      .catch((e) => showAlert(e.userMessage, 'danger'));
  }, [showAlert]);

  const degistir = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const iptal = () => {
    setDuzenlenenId(null);
    setForm(BOS);
  };

  const duzenle = (e) => {
    setForm({
      musteriId: e.musteriId != null ? String(e.musteriId) : '',
      islemTuru: e.islemTuru || 'KİRALIK',
      emlakTuru: e.emlakTuru || 'DAİRE',
      metrekare: e.metrekare ?? '',
      odaSayisi: e.odaSayisi ?? '',
      salonSayisi: e.salonSayisi ?? '',
      bulunduguKat: e.bulunduguKat ?? '',
      binaKati: e.binaKati ?? '',
      isinmaTuru: e.isinmaTuru || '',
      fiyat: e.fiyat ?? '',
      komisyonOrani: e.komisyonOrani ?? 2,
      durum: e.durum || 'AKTİF',
    });
    setDuzenlenenId(e.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sil = async (id) => {
    if (!window.confirm('Bu emlak kaydını silmek istediğinize emin misiniz?')) return;
    try {
      await emlakApi.sil(id);
      showAlert('Emlak kaydı silindi.');
      if (duzenlenenId === id) iptal();
      yenile();
    } catch (err) {
      showAlert(`Emlak silinemedi: ${err.userMessage}`, 'danger');
    }
  };

  const kaydet = async (e) => {
    e.preventDefault();
    const payload = {
      musteriId: parseIntOrNull(form.musteriId),
      islemTuru: form.islemTuru,
      emlakTuru: form.emlakTuru,
      metrekare: parseIntOrNull(form.metrekare),
      odaSayisi: parseIntOrNull(form.odaSayisi),
      salonSayisi: parseIntOrNull(form.salonSayisi),
      bulunduguKat: parseIntOrNull(form.bulunduguKat),
      binaKati: parseIntOrNull(form.binaKati),
      isinmaTuru: form.isinmaTuru || null,
      fiyat: parseFloatOrNull(form.fiyat),
      komisyonOrani: parseFloatOrNull(form.komisyonOrani) ?? 2,
      durum: form.durum,
    };
    try {
      if (duzenlenenId) {
        await emlakApi.guncelle(duzenlenenId, payload);
        showAlert('Emlak kaydı güncellendi.');
      } else {
        await emlakApi.kaydet(payload);
        showAlert('Emlak kaydedildi.');
      }
      iptal();
      yenile();
    } catch (err) {
      showAlert(`Emlak kaydedilemedi: ${err.userMessage}`, 'danger');
    }
  };

  const liste = veri?.content ?? [];

  return (
    <section className="content-section">
      <h2 className="mb-4">Emlak Tanımı</h2>
      <div className="card shadow" ref={formRef}>
        <div className="card-body">
          <form onSubmit={kaydet}>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Müşteri (Satıcı/Kiralayan)</label>
                <select className="form-select" name="musteriId" value={form.musteriId} onChange={degistir} required>
                  <option value="">Seçiniz...</option>
                  {musteriler.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.ad} {m.soyad}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">İşlem Türü</label>
                <select className="form-select" name="islemTuru" value={form.islemTuru} onChange={degistir} required>
                  <Secenekler liste={ISLEM_TURLERI} />
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Emlak Türü</label>
                <select className="form-select" name="emlakTuru" value={form.emlakTuru} onChange={degistir} required>
                  <Secenekler liste={EMLAK_TURLERI} />
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Metrekare (m²)</label>
                <input type="number" className="form-control" name="metrekare" min="1" value={form.metrekare} onChange={degistir} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Oda Sayısı</label>
                <input type="number" className="form-control" name="odaSayisi" min="0" value={form.odaSayisi} onChange={degistir} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Salon Sayısı</label>
                <input type="number" className="form-control" name="salonSayisi" min="0" value={form.salonSayisi} onChange={degistir} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Bulunduğu Kat</label>
                <input type="number" className="form-control" name="bulunduguKat" value={form.bulunduguKat} onChange={degistir} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Bina Kat Sayısı</label>
                <input type="number" className="form-control" name="binaKati" min="1" value={form.binaKati} onChange={degistir} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Isınma Türü</label>
                <select className="form-select" name="isinmaTuru" value={form.isinmaTuru} onChange={degistir}>
                  <Secenekler liste={ISINMA_TURLERI} bosEtiket="Seçiniz..." />
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Fiyat (TL)</label>
                <input type="number" className="form-control" name="fiyat" min="0" step="0.01" value={form.fiyat} onChange={degistir} required />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Komisyon Oranı (%)</label>
                <input type="number" className="form-control" name="komisyonOrani" min="0" max="100" step="0.1" value={form.komisyonOrani} onChange={degistir} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Durum</label>
                <select className="form-select" name="durum" value={form.durum} onChange={degistir}>
                  <Secenekler liste={DURUMLAR} />
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary me-2">
              {duzenlenenId ? (
                <>
                  <i className="fas fa-save" /> Güncelle
                </>
              ) : (
                <>
                  <i className="fas fa-plus" /> Emlak Kaydet
                </>
              )}
            </button>
            {duzenlenenId && (
              <button type="button" className="btn btn-secondary" onClick={iptal}>
                İptal
              </button>
            )}
          </form>
        </div>
      </div>

      <h4 className="mb-3 mt-4">Kayıtlı Emlaklar</h4>
      {hata && <div className="alert alert-danger">{hata}</div>}
      <div className="table-responsive bg-white shadow-sm p-3 rounded">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>İşlem</th>
              <th>Tür</th>
              <th>m²</th>
              <th>Oda</th>
              <th>Fiyat</th>
              <th>Komisyon</th>
              <th>Durum</th>
              <th>Müşteri</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {liste.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  {yukleniyor ? 'Yükleniyor...' : 'Henüz emlak kaydı yok.'}
                </td>
              </tr>
            ) : (
              liste.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.islemTuru}</td>
                  <td>{e.emlakTuru}</td>
                  <td>{e.metrekare ?? '-'}</td>
                  <td>{e.odaSayisi ?? '-'}</td>
                  <td>{formatPrice(e.fiyat)}</td>
                  <td>{formatPrice(e.komisyonTutari)}</td>
                  <td>
                    <DurumBadge durum={e.durum} />
                  </td>
                  <td>{e.musteriAd ? `${e.musteriAd} ${e.musteriSoyad}` : '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => duzenle(e)}>
                      <i className="fas fa-pen" /> Düzenle
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => sil(e.id)}>
                      <i className="fas fa-trash" /> Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Sayfalama veri={veri} onDegistir={(d) => setSayfa((s) => Math.max(0, s + d))} />
      </div>
    </section>
  );
}
