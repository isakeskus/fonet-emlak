const API = '/api';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initForms();
    loadDashboard();
    loadMusteriler();
    loadIsyeri();
});

function initNavigation() {
    document.querySelectorAll('.navbar-nav .nav-link[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(link.dataset.section);
        });
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('d-none'));
    document.getElementById(sectionId)?.classList.remove('d-none');

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === sectionId);
    });

    // Başka bir sayfaya geçilince yarım kalan düzenleme modunu temizle
    // (aksi halde kullanıcı geri döndüğünde formda eski kaydın verileri kalır).
    if (sectionId !== 'musteri' && editingMusteriId) cancelMusteriEdit();
    if (sectionId !== 'emlak' && editingEmlakId) cancelEmlakEdit();

    if (sectionId === 'dashboard') loadDashboard();
    if (sectionId === 'musteri') loadMusteriler();
    if (sectionId === 'emlak') { loadMusteriSelect(); loadEmlaklar(); }
    if (sectionId === 'isyeri') loadIsyeri();
}

function initForms() {
    document.getElementById('isyeriForm').addEventListener('submit', saveIsyeri);
    document.getElementById('musteriForm').addEventListener('submit', saveMusteri);
    document.getElementById('emlakForm').addEventListener('submit', saveEmlak);
    document.getElementById('aramaForm').addEventListener('submit', searchEmlak);
}

async function apiFetch(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    if (!response.ok) {
        const text = await response.text();
        let message = text || 'İstek başarısız oldu.';
        // Backend hata gövdesi JSON ise (ör. {"message":"..."} ya da {"hata":"..."}),
        // kullanıcıya ham JSON yerine sadece anlaşılır mesajı göster.
        try {
            const data = JSON.parse(text);
            message = data.hata || data.message || message;
        } catch (parseErr) {
            // JSON değilse ham metni kullanmaya devam et
        }
        throw new Error(message);
    }
    if (response.status === 204) return null;
    return response.json();
}

// Sayı input'larını int'e çevirir; boş bırakılırsa null döner.
// parseInt(deger) || null kalıbı 0 gibi geçerli değerleri de null'a çevirdiği için kullanılmaz
// (ör. "Bulunduğu Kat" alanında zemin kat = 0 çok yaygındır).
function parseIntOrNull(value) {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

function showAlert(message, type = 'success') {
    const existing = document.querySelector('.toast-alert');
    if (existing) existing.remove();

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show toast-alert position-fixed top-0 end-0 m-3`;
    alert.style.zIndex = '9999';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 4000);
}

// --- Dashboard ---

async function loadDashboard() {
    try {
        const stats = await apiFetch(`${API}/dashboard/stats`);
        document.getElementById('statMusteri').textContent = stats.musteriSayisi;
        document.getElementById('statEmlak').textContent = stats.emlakSayisi;
        document.getElementById('statIsyeri').textContent = stats.isyeriAdi;
        document.getElementById('statTamamlanan').textContent = stats.tamamlananIslemSayisi;
        document.getElementById('statKomisyon').textContent = formatPrice(stats.toplamKomisyonGeliri);

        renderChart(stats.kiralikSayisi, stats.satilikSayisi);
    } catch (err) {
        console.error('Dashboard yüklenemedi:', err);
    }
}

function renderChart(kiralik, satilik) {
    const canvas = document.getElementById('emlakChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (window.emlakChartInstance) {
        window.emlakChartInstance.destroy();
    }

    window.emlakChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Kiralık', 'Satılık'],
            datasets: [{
                data: [kiralik, satilik],
                backgroundColor: ['#198754', '#0dcaf0']
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

// --- İşyeri ---

let currentIsyeriId = null;

async function loadIsyeri() {
    try {
        const list = await apiFetch(`${API}/isyeri`);
        if (list.length > 0) {
            const isyeri = list[0];
            currentIsyeriId = isyeri.id;
            document.getElementById('isletmeAdi').value = isyeri.isletmeAdi || '';
            document.getElementById('yetkili').value = isyeri.yetkili || '';
            document.getElementById('isyeriTel').value = isyeri.telefon || '';
            document.getElementById('isyeriFax').value = isyeri.fax || '';
            document.getElementById('isyeriAdres').value = isyeri.adres || '';
        }
    } catch (err) {
        console.error('İşyeri yüklenemedi:', err);
    }
}

async function saveIsyeri(e) {
    e.preventDefault();
    const payload = {
        isletmeAdi: document.getElementById('isletmeAdi').value.trim(),
        yetkili: document.getElementById('yetkili').value.trim(),
        telefon: document.getElementById('isyeriTel').value.trim(),
        fax: document.getElementById('isyeriFax').value.trim(),
        adres: document.getElementById('isyeriAdres').value.trim()
    };

    try {
        if (currentIsyeriId) {
            await apiFetch(`${API}/isyeri/${currentIsyeriId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            showAlert('İşyeri bilgileri güncellendi.');
        } else {
            const saved = await apiFetch(`${API}/isyeri`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            currentIsyeriId = saved.id;
            showAlert('İşyeri kaydedildi.');
        }
        loadDashboard();
    } catch (err) {
        showAlert('İşyeri kaydedilemedi: ' + err.message, 'danger');
    }
}

// --- Müşteri ---

let musteriListCache = [];
let editingMusteriId = null;

async function loadMusteriler() {
    try {
        const list = await apiFetch(`${API}/musteri`);
        musteriListCache = list;
        const tbody = document.getElementById('musteriTableBody');
        tbody.innerHTML = '';

        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Henüz müşteri kaydı yok.</td></tr>';
            return;
        }

        list.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${m.id}</td>
                <td>${m.ad} ${m.soyad}</td>
                <td>${m.cepTelefonu || '-'}</td>
                <td>${m.email || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editMusteri(${m.id})">
                        <i class="fas fa-pen"></i> Düzenle
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteMusteri(${m.id})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        loadMusteriSelect(list);
    } catch (err) {
        console.error('Müşteriler yüklenemedi:', err);
    }
}

function editMusteri(id) {
    const musteri = musteriListCache.find(m => m.id === id);
    if (!musteri) return;

    document.getElementById('musteriAd').value = musteri.ad || '';
    document.getElementById('musteriSoyad').value = musteri.soyad || '';
    document.getElementById('musteriCep').value = musteri.cepTelefonu || '';
    document.getElementById('musteriEv').value = musteri.evTelefonu || '';
    document.getElementById('musteriEmail').value = musteri.email || '';

    editingMusteriId = id;
    document.getElementById('musteriSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Güncelle';
    document.getElementById('musteriIptalBtn').classList.remove('d-none');
    document.getElementById('musteriForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelMusteriEdit() {
    editingMusteriId = null;
    document.getElementById('musteriForm').reset();
    document.getElementById('musteriSubmitBtn').innerHTML = '<i class="fas fa-user-plus"></i> Kaydet';
    document.getElementById('musteriIptalBtn').classList.add('d-none');
}

async function deleteMusteri(id) {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;

    try {
        await apiFetch(`${API}/musteri/${id}`, { method: 'DELETE' });
        showAlert('Müşteri silindi.');
        if (editingMusteriId === id) cancelMusteriEdit();
        loadMusteriler();
        loadDashboard();
    } catch (err) {
        showAlert('Müşteri silinemedi: ' + err.message, 'danger');
    }
}

async function loadMusteriSelect(cachedList) {
    const select = document.getElementById('emlakMusteri');
    if (!select) return;

    const list = cachedList || await apiFetch(`${API}/musteri`);
    select.innerHTML = '<option value="">Seçiniz...</option>';
    list.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.ad} ${m.soyad}`;
        select.appendChild(opt);
    });
}

async function saveMusteri(e) {
    e.preventDefault();
    const payload = {
        ad: document.getElementById('musteriAd').value.trim(),
        soyad: document.getElementById('musteriSoyad').value.trim(),
        cepTelefonu: document.getElementById('musteriCep').value.trim(),
        evTelefonu: document.getElementById('musteriEv').value.trim(),
        email: document.getElementById('musteriEmail').value.trim()
    };

    try {
        if (editingMusteriId) {
            await apiFetch(`${API}/musteri/${editingMusteriId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            showAlert('Müşteri güncellendi.');
            cancelMusteriEdit();
        } else {
            await apiFetch(`${API}/musteri`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            showAlert('Müşteri kaydedildi.');
            document.getElementById('musteriForm').reset();
        }
        loadMusteriler();
        loadDashboard();
    } catch (err) {
        showAlert('Müşteri kaydedilemedi: ' + err.message, 'danger');
    }
}

// --- Emlak ---

let emlakListCache = [];
let editingEmlakId = null;
let emlakSayfa = 0;
const SAYFA_BOYUTU = 20;

function emlakSayfaDegistir(delta) {
    emlakSayfa = Math.max(0, emlakSayfa + delta);
    loadEmlaklar();
}

function durumBadge(durum) {
    return durum === 'TAMAMLANDI'
        ? '<span class="badge bg-dark">Tamamlandı</span>'
        : '<span class="badge bg-success">Aktif</span>';
}

async function loadEmlaklar() {
    try {
        const sayfa = await apiFetch(`${API}/emlak?page=${emlakSayfa}&size=${SAYFA_BOYUTU}`);
        const list = sayfa.content;
        emlakListCache = list;
        const tbody = document.getElementById('emlakTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">Henüz emlak kaydı yok.</td></tr>';
        } else {
            list.forEach(e => {
                const musteri = e.musteriAd ? `${e.musteriAd} ${e.musteriSoyad}` : '-';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${e.id}</td>
                    <td>${e.islemTuru}</td>
                    <td>${e.emlakTuru}</td>
                    <td>${e.metrekare ?? '-'}</td>
                    <td>${e.odaSayisi ?? '-'}</td>
                    <td>${formatPrice(e.fiyat)}</td>
                    <td>${formatPrice(e.komisyonTutari)}</td>
                    <td>${durumBadge(e.durum)}</td>
                    <td>${musteri}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editEmlak(${e.id})">
                            <i class="fas fa-pen"></i> Düzenle
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteEmlak(${e.id})">
                            <i class="fas fa-trash"></i> Sil
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        document.getElementById('emlakSayfaBilgi').textContent =
            `Sayfa ${sayfa.number + 1} / ${Math.max(sayfa.totalPages, 1)} — Toplam ${sayfa.totalElements} kayıt`;
        document.getElementById('emlakOncekiBtn').disabled = sayfa.first;
        document.getElementById('emlakSonrakiBtn').disabled = sayfa.last;
    } catch (err) {
        console.error('Emlaklar yüklenemedi:', err);
    }
}

async function editEmlak(id) {
    const emlak = emlakListCache.find(e => e.id === id);
    if (!emlak) return;

    // Müşteri seçim kutusunun dolu olduğundan emin ol, sonra kaydın müşterisini seç.
    await loadMusteriSelect();

    document.getElementById('emlakMusteri').value = emlak.musteriId ?? '';
    document.getElementById('emlakIslem').value = emlak.islemTuru || 'KİRALIK';
    document.getElementById('emlakTuru').value = emlak.emlakTuru || 'DAİRE';
    document.getElementById('emlakM2').value = emlak.metrekare ?? '';
    document.getElementById('emlakOda').value = emlak.odaSayisi ?? '';
    document.getElementById('emlakSalon').value = emlak.salonSayisi ?? '';
    document.getElementById('emlakBulunduguKat').value = emlak.bulunduguKat ?? '';
    document.getElementById('emlakBinaKati').value = emlak.binaKati ?? '';
    document.getElementById('emlakIsinma').value = emlak.isinmaTuru || '';
    document.getElementById('emlakFiyat').value = emlak.fiyat ?? '';
    document.getElementById('emlakKomisyon').value = emlak.komisyonOrani ?? 2;
    document.getElementById('emlakDurum').value = emlak.durum || 'AKTİF';

    editingEmlakId = id;
    document.getElementById('emlakSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Güncelle';
    document.getElementById('emlakIptalBtn').classList.remove('d-none');
    document.getElementById('emlakForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelEmlakEdit() {
    editingEmlakId = null;
    document.getElementById('emlakForm').reset();
    document.getElementById('emlakSubmitBtn').innerHTML = '<i class="fas fa-plus"></i> Emlak Kaydet';
    document.getElementById('emlakIptalBtn').classList.add('d-none');
}

async function deleteEmlak(id) {
    if (!confirm('Bu emlak kaydını silmek istediğinize emin misiniz?')) return;

    try {
        await apiFetch(`${API}/emlak/${id}`, { method: 'DELETE' });
        showAlert('Emlak kaydı silindi.');
        if (editingEmlakId === id) cancelEmlakEdit();
        loadEmlaklar();
        loadDashboard();
    } catch (err) {
        showAlert('Emlak silinemedi: ' + err.message, 'danger');
    }
}

async function saveEmlak(e) {
    e.preventDefault();
    const payload = {
        musteriId: parseInt(document.getElementById('emlakMusteri').value),
        islemTuru: document.getElementById('emlakIslem').value,
        emlakTuru: document.getElementById('emlakTuru').value,
        metrekare: parseInt(document.getElementById('emlakM2').value),
        odaSayisi: parseIntOrNull(document.getElementById('emlakOda').value),
        salonSayisi: parseIntOrNull(document.getElementById('emlakSalon').value),
        bulunduguKat: parseIntOrNull(document.getElementById('emlakBulunduguKat').value),
        binaKati: parseIntOrNull(document.getElementById('emlakBinaKati').value),
        isinmaTuru: document.getElementById('emlakIsinma').value || null,
        fiyat: parseFloat(document.getElementById('emlakFiyat').value),
        komisyonOrani: parseFloat(document.getElementById('emlakKomisyon').value) || 2,
        durum: document.getElementById('emlakDurum').value
    };

    try {
        if (editingEmlakId) {
            await apiFetch(`${API}/emlak/${editingEmlakId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            showAlert('Emlak kaydı güncellendi.');
            cancelEmlakEdit();
        } else {
            await apiFetch(`${API}/emlak`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            showAlert('Emlak kaydedildi.');
            document.getElementById('emlakForm').reset();
        }
        loadDashboard();
        loadEmlaklar();
    } catch (err) {
        showAlert('Emlak kaydedilemedi: ' + err.message, 'danger');
    }
}

// --- Arama ---

let aramaSayfa = 0;

function aramaSayfaDegistir(delta) {
    aramaSayfa = Math.max(0, aramaSayfa + delta);
    searchEmlak();
}

function aramaParams() {
    const params = new URLSearchParams();
    params.append('islemTuru', document.getElementById('araIslemTuru').value);

    const emlakTuru = document.getElementById('araEmlakTuru').value;
    if (emlakTuru) params.append('emlakTuru', emlakTuru);

    const minM2 = document.getElementById('araMinM2').value;
    const maxM2 = document.getElementById('araMaxM2').value;
    const minOda = document.getElementById('araMinOda').value;
    const maxOda = document.getElementById('araMaxOda').value;
    const isinma = document.getElementById('araIsinma').value;
    const maxFiyat = document.getElementById('araMaxFiyat').value;
    const durum = document.getElementById('araDurum').value;

    if (minM2) params.append('minMetrekare', minM2);
    if (maxM2) params.append('maxMetrekare', maxM2);
    if (minOda) params.append('minOdaSayisi', minOda);
    if (maxOda) params.append('maxOdaSayisi', maxOda);
    if (isinma) params.append('isinmaTuru', isinma);
    if (maxFiyat) params.append('maxFiyat', maxFiyat);
    if (durum) params.append('durum', durum);
    return params;
}

async function searchEmlak(e) {
    // Formdan (submit event ile) çağrıldıysa yeni bir arama demektir, sayfayı başa al.
    // aramaSayfaDegistir() üzerinden (event olmadan) çağrıldıysa mevcut sayfa numarası korunur.
    if (e) {
        e.preventDefault();
        aramaSayfa = 0;
    }

    const params = aramaParams();
    params.append('page', aramaSayfa);
    params.append('size', SAYFA_BOYUTU);

    try {
        const sayfa = await apiFetch(`${API}/emlak/ara?${params.toString()}`);
        renderSearchResults(sayfa);
    } catch (err) {
        showAlert('Arama yapılamadı: ' + err.message, 'danger');
    }
}

function renderSearchResults(sayfa) {
    const results = sayfa.content;
    const tbody = document.getElementById('aramaTableBody');
    tbody.innerHTML = '';

    if (results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center text-muted">Kriterlere uygun emlak bulunamadı.</td></tr>';
    } else {
        results.forEach(e => {
            const musteri = e.musteriAd ? `${e.musteriAd} ${e.musteriSoyad}` : '-';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${e.islemTuru}</td>
                <td>${e.emlakTuru}</td>
                <td>${e.metrekare ?? '-'}</td>
                <td>${e.odaSayisi ?? '-'}</td>
                <td>${e.bulunduguKat ?? '-'}</td>
                <td>${e.binaKati ?? '-'}</td>
                <td>${e.isinmaTuru ?? '-'}</td>
                <td>${formatPrice(e.fiyat)}</td>
                <td>${formatPrice(e.komisyonTutari)}</td>
                <td>${durumBadge(e.durum)}</td>
                <td>${musteri}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('aramaSayfaBilgi').textContent =
        `Sayfa ${sayfa.number + 1} / ${Math.max(sayfa.totalPages, 1)} — Toplam ${sayfa.totalElements} kayıt`;
    document.getElementById('aramaOncekiBtn').disabled = sayfa.first;
    document.getElementById('aramaSonrakiBtn').disabled = sayfa.last;
}

function formatPrice(price) {
    if (price == null) return '-';
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
}
