import { useCallback, useEffect, useRef, useState } from 'react';
import { musteriApi } from '../api/services';
import { useAlert } from '../context/AlertContext.jsx';

const BOS = { ad: '', soyad: '', cepTelefonu: '', evTelefonu: '', email: '' };

export default function MusteriPage() {
  const showAlert = useAlert();
  const formRef = useRef(null);
  const [liste, setListe] = useState([]);
  const [form, setForm] = useState(BOS);
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  const yukle = useCallback(() => {
    musteriApi
      .liste()
      .then(setListe)
      .catch((e) => showAlert(e.userMessage, 'danger'));
  }, [showAlert]);

  useEffect(() => {
    yukle();
  }, [yukle]);

  const degistir = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const iptal = () => {
    setDuzenlenenId(null);
    setForm(BOS);
  };

  const duzenle = (m) => {
    setForm({
      ad: m.ad || '',
      soyad: m.soyad || '',
      cepTelefonu: m.cepTelefonu || '',
      evTelefonu: m.evTelefonu || '',
      email: m.email || '',
    });
    setDuzenlenenId(m.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sil = async (id) => {
    if (!window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;
    try {
      await musteriApi.sil(id);
      showAlert('Müşteri silindi.');
      if (duzenlenenId === id) iptal();
      yukle();
    } catch (err) {
      showAlert(`Müşteri silinemedi: ${err.userMessage}`, 'danger');
    }
  };

  const kaydet = async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    try {
      if (duzenlenenId) {
        await musteriApi.guncelle(duzenlenenId, payload);
        showAlert('Müşteri güncellendi.');
      } else {
        await musteriApi.kaydet(payload);
        showAlert('Müşteri kaydedildi.');
      }
      iptal();
      yukle();
    } catch (err) {
      showAlert(`Müşteri kaydedilemedi: ${err.userMessage}`, 'danger');
    }
  };

  return (
    <section className="content-section">
      <h2 className="mb-4">Müşteri Tanımı</h2>
      <div className="card shadow mb-4" ref={formRef}>
        <div className="card-body">
          <form onSubmit={kaydet}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Ad</label>
                <input className="form-control" name="ad" value={form.ad} onChange={degistir} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Soyad</label>
                <input className="form-control" name="soyad" value={form.soyad} onChange={degistir} required />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Cep Telefonu</label>
                <input className="form-control" name="cepTelefonu" value={form.cepTelefonu} onChange={degistir} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Ev Telefonu</label>
                <input className="form-control" name="evTelefonu" value={form.evTelefonu} onChange={degistir} />
              </div>
              <div className="col-md-4">
                <label className="form-label">E-Posta</label>
                <input type="email" className="form-control" name="email" value={form.email} onChange={degistir} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary me-2">
              {duzenlenenId ? (
                <>
                  <i className="fas fa-save" /> Güncelle
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus" /> Kaydet
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

      <h4 className="mb-3">Kayıtlı Müşteriler</h4>
      <div className="table-responsive bg-white shadow-sm p-3 rounded">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Ad Soyad</th>
              <th>Cep Telefonu</th>
              <th>E-Posta</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {liste.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Henüz müşteri kaydı yok.
                </td>
              </tr>
            ) : (
              liste.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>
                    {m.ad} {m.soyad}
                  </td>
                  <td>{m.cepTelefonu || '-'}</td>
                  <td>{m.email || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => duzenle(m)}>
                      <i className="fas fa-pen" /> Düzenle
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => sil(m.id)}>
                      <i className="fas fa-trash" /> Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
