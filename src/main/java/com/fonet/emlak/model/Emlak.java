package com.fonet.emlak.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(indexes = {
        @Index(name = "idx_emlak_islem_turu", columnList = "islemTuru"),
        @Index(name = "idx_emlak_emlak_turu", columnList = "emlakTuru"),
        @Index(name = "idx_emlak_durum", columnList = "durum"),
        @Index(name = "idx_emlak_metrekare", columnList = "metrekare"),
        @Index(name = "idx_emlak_oda_sayisi", columnList = "odaSayisi"),
        @Index(name = "idx_emlak_isinma_turu", columnList = "isinmaTuru"),
        @Index(name = "idx_emlak_musteri_id", columnList = "musteri_id")
})
@Data
public class Emlak {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // SATILIK, KIRALIK vb.
    private String islemTuru;

    // DAIRE, VILLA, ARSA vb.
    private String emlakTuru;

    private Integer metrekare;
    private Integer odaSayisi;
    private Integer salonSayisi;
    private Integer bulunduguKat;
    private Integer binaKati;
    private String isinmaTuru;

    private Double fiyat;

    // Satış/kiralama komisyon oranı (%) - fiyat üzerinden komisyon tutarı hesaplanır
    private Double komisyonOrani;

    // AKTİF: hâlâ satılık/kiralık listede; TAMAMLANDI: satıldı/kiralandı
    private String durum;

    // İlgili satıcı/kiralayan müşteri
    @ManyToOne
    @JoinColumn(name = "musteri_id")
    @JsonIgnore // Sonsuz döngüyü önlemek için REST api dönerken müşteriyi gizle (ya da DTO kullanılabilir)
    private Musteri satici;
}
