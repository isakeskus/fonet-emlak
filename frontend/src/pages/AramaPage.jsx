import { useCallback, useState } from 'react';
import { emlakApi } from '../api/services';
import useSayfaliVeri from '../hooks/useSayfaliVeri';
import Sayfalama from '../components/Sayfalama.jsx';
import DurumBadge from '../components/DurumBadge.jsx';
import { formatPrice } from '../utils/format';
import {
  DURUMLAR,
  EMLAK_TURLERI,
  ISINMA_TURLERI,
  ISLEM_TURLERI,
  SAYFA_BOYUTU,
} from '../utils/secenekler';

const BOS = {
  islemTuru: 'KİRALIK',
  emlakTuru: '',
  minM2: '',
  maxM2: '',
  minOda: '',
  maxOda: '',
  isinmaTuru: '',
  maxFiyat: '',
  durum: '',
};

// Form alanlarını backend'in beklediği parametre adlarına çevirir; boş olanlar gönderilmez.
function kriterOlustur(f) {
  const eslesme = {
    islemTuru: f.islemTuru,
    emlakTuru: f.emlakTuru,
    minMetrekare: f.minM2,
    maxMetrekare: f.maxM2,
    minOdaSayisi: f.minOda,
    maxOdaSayisi: f.maxOda,
    isinmaTuru: f.isinmaTuru,
    maxFiyat: f.maxFiyat,
    durum: f.durum,
  };
  return Object.fromEntries(Object.entries(eslesme).filter(([, v]) => v !== ''));
}

function Secim({ etiket, ad, deger, onChange, liste, tumu }) {
  return (
    <div className="col-md-3">
      <label className="form-label">{etiket}</label>
      <select className="form-select" name={ad} value={deger} onChange={onChange}>
        {tumu && <option value="">Tümü</option>}
        {liste.map((s) => (
          <option key={s.deger} value={s.deger}>
            {s.ad}
          </option>
        ))}
      </select>
    </div>
  );
}

function Sayi({ etiket, ad, deger, onChange, adim }) {
  return (
    <div className="col-md-3">
      <label className="form-label">{etiket}</label>
      <input type="number" className="form-control" name={ad} min="0" step={adim} value={deger} onChange={onChange} />
    </div>
  );
}

export default function AramaPage() {
  const [form, setForm] = useState(BOS);
  // Arama yalnızca "Ara"ya basılınca çalışsın diye uygulanan kriter ayrı tutulur.
  const [kriter, setKriter] = useState(null);

  const getir = useCallback((sayfa) => emlakApi.ara(kriter, sayfa, SAYFA_BOYUTU), [kriter]);
  const { veri, setSayfa, yukleniyor, hata } = useSayfaliVeri(getir, { aktif: kriter !== null });

  const degistir = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const ara = (e) => {
    e.preventDefault();
    setKriter(kriterOlustur(form));
    setSayfa(0);
  };

  const liste = veri?.content ?? [];

  return (
    <section className="content-section">
      <h2 className="mb-4">Emlak Arama</h2>
      <div className="card shadow mb-4">
        <div className="card-body bg-light">
          <form className="row g-3 align-items-end" onSubmit={ara}>
            <Secim etiket="İşlem Türü" ad="islemTuru" deger={form.islemTuru} onChange={degistir} liste={ISLEM_TURLERI} />
            <Secim etiket="Emlak Türü" ad="emlakTuru" deger={form.emlakTuru} onChange={degistir} liste={EMLAK_TURLERI} tumu />
            <Sayi etiket="Min m²" ad="minM2" deger={form.minM2} onChange={degistir} />
            <Sayi etiket="Max m²" ad="maxM2" deger={form.maxM2} onChange={degistir} />
            <Sayi etiket="Min Oda" ad="minOda" deger={form.minOda} onChange={degistir} />
            <Sayi etiket="Max Oda" ad="maxOda" deger={form.maxOda} onChange={degistir} />
            <Secim etiket="Isınma Türü" ad="isinmaTuru" deger={form.isinmaTuru} onChange={degistir} liste={ISINMA_TURLERI} tumu />
            <Sayi etiket="Max Fiyat (TL)" ad="maxFiyat" deger={form.maxFiyat} onChange={degistir} adim="0.01" />
            <Secim etiket="Durum" ad="durum" deger={form.durum} onChange={degistir} liste={DURUMLAR} tumu />
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-search" /> Ara
              </button>
            </div>
          </form>
        </div>
      </div>

      <div id="printArea">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Arama Sonuçları</h4>
          <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
            <i className="fas fa-print" /> Yazdır
          </button>
        </div>
        {hata && <div className="alert alert-danger">{hata}</div>}
        <div className="table-responsive bg-white shadow-sm p-3 rounded">
          <table className="table table-bordered table-striped">
            <thead className="table-primary">
              <tr>
                <th>İşlem</th>
                <th>Emlak</th>
                <th>m²</th>
                <th>Oda</th>
                <th>Bul. Kat</th>
                <th>Bina Kat</th>
                <th>Isınma</th>
                <th>Fiyat</th>
                <th>Komisyon</th>
                <th>Durum</th>
                <th>Müşteri</th>
              </tr>
            </thead>
            <tbody>
              {liste.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center text-muted">
                    {kriter === null
                      ? 'Arama yapmak için yukarıdaki formu kullanın.'
                      : yukleniyor
                        ? 'Aranıyor...'
                        : 'Kriterlere uygun emlak bulunamadı.'}
                  </td>
                </tr>
              ) : (
                liste.map((e) => (
                  <tr key={e.id}>
                    <td>{e.islemTuru}</td>
                    <td>{e.emlakTuru}</td>
                    <td>{e.metrekare ?? '-'}</td>
                    <td>{e.odaSayisi ?? '-'}</td>
                    <td>{e.bulunduguKat ?? '-'}</td>
                    <td>{e.binaKati ?? '-'}</td>
                    <td>{e.isinmaTuru ?? '-'}</td>
                    <td>{formatPrice(e.fiyat)}</td>
                    <td>{formatPrice(e.komisyonTutari)}</td>
                    <td>
                      <DurumBadge durum={e.durum} />
                    </td>
                    <td>{e.musteriAd ? `${e.musteriAd} ${e.musteriSoyad}` : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Sayfalama veri={kriter === null ? null : veri} onDegistir={(d) => setSayfa((s) => Math.max(0, s + d))} />
        </div>
      </div>
    </section>
  );
}
