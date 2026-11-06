import { useEffect, useState } from 'react';
import { isyeriApi } from '../api/services';
import { useAlert } from '../context/AlertContext.jsx';

const BOS = { isletmeAdi: '', yetkili: '', telefon: '', fax: '', adres: '' };

export default function IsyeriPage() {
  const showAlert = useAlert();
  const [form, setForm] = useState(BOS);
  const [kayitId, setKayitId] = useState(null);

  useEffect(() => {
    let iptal = false;
    isyeriApi
      .liste()
      .then((liste) => {
        if (iptal || liste.length === 0) return;
        const i = liste[0];
        setKayitId(i.id);
        setForm({
          isletmeAdi: i.isletmeAdi || '',
          yetkili: i.yetkili || '',
          telefon: i.telefon || '',
          fax: i.fax || '',
          adres: i.adres || '',
        });
      })
      .catch((e) => showAlert(e.userMessage, 'danger'));
    return () => {
      iptal = true;
    };
  }, [showAlert]);

  const degistir = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const kaydet = async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    try {
      if (kayitId) {
        await isyeriApi.guncelle(kayitId, payload);
        showAlert('İşyeri bilgileri güncellendi.');
      } else {
        const kaydedilen = await isyeriApi.kaydet(payload);
        setKayitId(kaydedilen.id);
        showAlert('İşyeri kaydedildi.');
      }
    } catch (err) {
      showAlert(`İşyeri kaydedilemedi: ${err.userMessage}`, 'danger');
    }
  };

  return (
    <section className="content-section">
      <h2 className="mb-4">İşyeri Tanımı</h2>
      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={kaydet}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">İşletme Adı</label>
                <input className="form-control" name="isletmeAdi" value={form.isletmeAdi} onChange={degistir} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Yetkili Kişi</label>
                <input className="form-control" name="yetkili" value={form.yetkili} onChange={degistir} required />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Telefon</label>
                <input className="form-control" name="telefon" value={form.telefon} onChange={degistir} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Faks</label>
                <input className="form-control" name="fax" value={form.fax} onChange={degistir} />
              </div>
              <div className="col-md-12 mt-3">
                <label className="form-label">Adres</label>
                <textarea className="form-control" rows="2" name="adres" value={form.adres} onChange={degistir} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-save" /> Kaydet
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
