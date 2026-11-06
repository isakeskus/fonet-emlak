import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { dashboardApi } from '../api/services';
import { formatPrice } from '../utils/format';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatKart({ renk, ikon, baslik, deger, buyuk = true }) {
  return (
    <div className={`card text-white bg-${renk} mb-3 shadow`}>
      <div className="card-body">
        <h5 className="card-title">
          <i className={`fas ${ikon}`} /> {baslik}
        </h5>
        <p className={buyuk ? 'card-text display-4' : 'card-text h4 mt-3'}>{deger}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [hata, setHata] = useState('');

  useEffect(() => {
    let iptal = false;
    dashboardApi
      .istatistik()
      .then((d) => {
        if (!iptal) setStats(d);
      })
      .catch((e) => {
        if (!iptal) setHata(e.userMessage);
      });
    return () => {
      iptal = true;
    };
  }, []);

  if (hata) return <div className="alert alert-danger">{hata}</div>;
  if (!stats) return <p className="text-muted">Yükleniyor...</p>;

  const grafikVerisi = {
    labels: ['Kiralık', 'Satılık'],
    datasets: [
      {
        data: [stats.kiralikSayisi, stats.satilikSayisi],
        backgroundColor: ['#198754', '#0dcaf0'],
      },
    ],
  };

  return (
    <section className="content-section">
      <h2 className="mb-4">Kontrol Paneli</h2>
      <div className="row">
        <div className="col-md-4">
          <StatKart renk="success" ikon="fa-users" baslik="Toplam Müşteri" deger={stats.musteriSayisi} />
        </div>
        <div className="col-md-4">
          <StatKart renk="info" ikon="fa-building" baslik="Toplam Emlak" deger={stats.emlakSayisi} />
        </div>
        <div className="col-md-4">
          <StatKart
            renk="warning"
            ikon="fa-store"
            baslik="İşyeri Bilgisi"
            deger={stats.isyeriAdi || 'Kayıt Bekleniyor'}
            buyuk={false}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <StatKart
            renk="dark"
            ikon="fa-handshake"
            baslik="Tamamlanan İşlem (Satıldı/Kiralandı)"
            deger={stats.tamamlananIslemSayisi}
          />
        </div>
        <div className="col-md-6">
          <StatKart
            renk="danger"
            ikon="fa-sack-dollar"
            baslik="Toplam Komisyon Geliri"
            deger={formatPrice(stats.toplamKomisyonGeliri)}
          />
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-6 mx-auto">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-center mb-3">
                <i className="fas fa-chart-pie" /> Emlak Dağılımı
              </h5>
              <Doughnut
                data={grafikVerisi}
                options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
