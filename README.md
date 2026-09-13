# Fonet Emlak İşletmeleri Projesi

Fonet Bilgi Teknolojileri A.Ş. Java Yazılım Geliştirme Aday Projesi (BT-KL-1) kapsamında geliştirilmiş emlak yönetim uygulaması.

## Teknolojiler

- **Backend:** Java 17, Spring Boot 3.1, Spring Data JPA
- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5, Chart.js
- **Veritabanı:** H2 (geliştirme), PostgreSQL (prod - docker-compose hazır)

## Modüller

| Modül | Açıklama |
|-------|----------|
| İşyeri Tanımı | Emlak işletmesi bilgileri (ad, yetkili, adres, telefon, fax) |
| Müşteri Tanımı | Alıcı/satıcı/kiracı müşteri kayıtları |
| Emlak Tanımı | Kiralık/satılık emlak kayıtları ve özellikleri |
| Emlak Arama | Kriterlere göre arama ve yazdırılabilir sonuç listesi |
| Dashboard | İstatistikler ve emlak dağılım grafiği |

## Çalıştırma

### Gereksinimler

- JDK 17+
- Maven 3.8+

### Uygulamayı Başlatma (H2 - varsayılan)

```bash
mvn spring-boot:run
```

Tarayıcıda: http://localhost:8080

H2 Console: http://localhost:8080/h2-console  
JDBC URL: `jdbc:h2:mem:emlak_db` | Kullanıcı: `sa` | Şifre: `password`

### PostgreSQL ile Çalıştırma

```bash
docker-compose up -d
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```

> PostgreSQL JDBC sürücüsü `pom.xml`'e eklenmiş ve `postgres` profili (`application-postgres.properties`) kullanıma hazır durumdadır.

## Senaryo Testi

1. **İşyeri Tanımı** → Emlak işletmesi bilgilerini kaydedin
2. **Müşteri Tanımı** → Birinci müşteriyi (ev sahibi) kaydedin
3. **Emlak Tanımı** → Bu müşteriye kiralık bir daire ekleyin
4. **Müşteri Tanımı** → İkinci müşteriyi (alıcı) kaydedin
5. **Emlak Arama** → Kiralık + kriterler ile arama yapın, sonuçları yazdırın

## API Endpoints

| Method | URL | Açıklama |
|--------|-----|----------|
| GET | `/api/isyeri` | Tüm işyerleri |
| POST | `/api/isyeri` | İşyeri kaydet |
| PUT | `/api/isyeri/{id}` | İşyeri güncelle |
| GET | `/api/musteri` | Tüm müşteriler |
| POST | `/api/musteri` | Müşteri kaydet |
| PUT | `/api/musteri/{id}` | Müşteri güncelle |
| DELETE | `/api/musteri/{id}` | Müşteri sil (bağlı emlak kaydı varsa 409 döner) |
| GET | `/api/emlak` | Tüm emlaklar |
| POST | `/api/emlak` | Emlak kaydet |
| PUT | `/api/emlak/{id}` | Emlak güncelle |
| DELETE | `/api/emlak/{id}` | Emlak sil |
| GET | `/api/emlak/ara` | Emlak arama |
| GET | `/api/dashboard/stats` | Dashboard istatistikleri |

## Proje Yapısı

```
src/main/java/com/fonet/emlak/
├── controller/    REST API katmanı
├── service/       İş mantığı
├── repository/    JPA repository ve specification
├── model/         Entity sınıfları
└── dto/           API response ve arama kriterleri

src/main/resources/static/
├── index.html     Ana arayüz
├── css/style.css
└── js/app.js      Frontend mantığı
```
