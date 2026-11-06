import axios from 'axios';

// Tüm istekler için ortak ayar: adres, zaman aşımı, başlık.
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Backend hata gövdesi {"hata": "..."} biçiminde gelir (GlobalExceptionHandler).
// Mesajı tek yerde ayıklayıp err.userMessage olarak ekliyoruz.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data;
    let mesaj = 'Sunucuya ulaşılamadı.';
    if (typeof data === 'string' && data) {
      mesaj = data;
    } else if (data && (data.hata || data.message)) {
      mesaj = data.hata || data.message;
    } else if (err.response) {
      mesaj = 'İstek başarısız oldu.';
    }
    err.userMessage = mesaj;
    return Promise.reject(err);
  }
);

export default api;
