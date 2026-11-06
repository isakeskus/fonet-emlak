import api from './client';

const veri = (res) => res.data;

export const dashboardApi = {
  istatistik: () => api.get('/dashboard/stats').then(veri),
};

export const isyeriApi = {
  liste: () => api.get('/isyeri').then(veri),
  kaydet: (payload) => api.post('/isyeri', payload).then(veri),
  guncelle: (id, payload) => api.put(`/isyeri/${id}`, payload).then(veri),
};

export const musteriApi = {
  liste: () => api.get('/musteri').then(veri),
  kaydet: (payload) => api.post('/musteri', payload).then(veri),
  guncelle: (id, payload) => api.put(`/musteri/${id}`, payload).then(veri),
  sil: (id) => api.delete(`/musteri/${id}`),
};

export const emlakApi = {
  liste: (page, size) => api.get('/emlak', { params: { page, size } }).then(veri),
  ara: (kriter, page, size) =>
    api.get('/emlak/ara', { params: { ...kriter, page, size } }).then(veri),
  kaydet: (payload) => api.post('/emlak', payload).then(veri),
  guncelle: (id, payload) => api.put(`/emlak/${id}`, payload).then(veri),
  sil: (id) => api.delete(`/emlak/${id}`),
};
