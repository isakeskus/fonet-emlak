-- Fonet Emlak Isletmeleri - Veritabani Semasi
-- PostgreSQL / H2 uyumlu

CREATE TABLE IF NOT EXISTS isyeri (
    id           BIGSERIAL PRIMARY KEY,
    isletme_adi  VARCHAR(255),
    yetkili      VARCHAR(255),
    adres        VARCHAR(500),
    telefon      VARCHAR(50),
    fax          VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS musteri (
    id            BIGSERIAL PRIMARY KEY,
    ad            VARCHAR(100) NOT NULL,
    soyad         VARCHAR(100) NOT NULL,
    ev_telefonu   VARCHAR(50),
    cep_telefonu  VARCHAR(50),
    email         VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS emlak (
    id              BIGSERIAL PRIMARY KEY,
    islem_turu      VARCHAR(20)  NOT NULL,  -- KIRALIK, SATILIK
    emlak_turu      VARCHAR(50)  NOT NULL,  -- DAIRE, VILLA, ARSA, DUKKAN
    metrekare       INTEGER,
    oda_sayisi      INTEGER,
    salon_sayisi    INTEGER,
    bulundugu_kat   INTEGER,
    bina_kati       INTEGER,
    isinma_turu     VARCHAR(50),
    fiyat           DOUBLE PRECISION,
    musteri_id      BIGINT REFERENCES musteri(id)
);

CREATE INDEX IF NOT EXISTS idx_emlak_islem_turu ON emlak(islem_turu);
CREATE INDEX IF NOT EXISTS idx_emlak_emlak_turu ON emlak(emlak_turu);
CREATE INDEX IF NOT EXISTS idx_emlak_musteri ON emlak(musteri_id);
