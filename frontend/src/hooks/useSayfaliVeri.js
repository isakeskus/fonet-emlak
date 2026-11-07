import { useCallback, useEffect, useState } from 'react';

// Sayfalı liste çeken özel hook.
// getir(sayfaNo) bir Promise<Page> döndürmelidir (Spring'in Page yapısı).
// getir değişirse (ör. arama kriteri) liste yeniden yüklenir.
export default function useSayfaliVeri(getir, { aktif = true } = {}) {
  const [sayfa, setSayfa] = useState(0);
  const [veri, setVeri] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [yenileSayac, setYenileSayac] = useState(0);

  useEffect(() => {
    if (!aktif) return undefined;
    let iptal = false;
    setYukleniyor(true);
    setHata('');

    getir(sayfa)
      .then((d) => {
        if (iptal) return;
        // Son sayfadaki kayıtlar silindiyse sayfa sayısı azalır; son geçerli sayfaya dön.
        if (d.totalPages > 0 && sayfa >= d.totalPages) {
          setSayfa(d.totalPages - 1);
          return;
        }
        setVeri(d);
      })
      .catch((e) => {
        if (!iptal) setHata(e.userMessage || 'Veri alınamadı.');
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });

    // Bileşen kapanırsa ya da bağımlılık değişirse eski cevabı yok say.
    return () => {
      iptal = true;
    };
  }, [getir, sayfa, aktif, yenileSayac]);

  const yenile = useCallback(() => setYenileSayac((n) => n + 1), []);

  return { veri, sayfa, setSayfa, yukleniyor, hata, yenile };
}
