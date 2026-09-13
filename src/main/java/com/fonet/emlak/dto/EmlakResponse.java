package com.fonet.emlak.dto;

import com.fonet.emlak.model.Emlak;
import com.fonet.emlak.model.Musteri;
import lombok.Data;

@Data
public class EmlakResponse {

    private Long id;
    private String islemTuru;
    private String emlakTuru;
    private Integer metrekare;
    private Integer odaSayisi;
    private Integer salonSayisi;
    private Integer bulunduguKat;
    private Integer binaKati;
    private String isinmaTuru;
    private Double fiyat;
    private Double komisyonOrani;
    private Double komisyonTutari;
    private String durum;
    private Long musteriId;
    private String musteriAd;
    private String musteriSoyad;

    public static EmlakResponse from(Emlak emlak) {
        EmlakResponse response = new EmlakResponse();
        response.setId(emlak.getId());
        response.setIslemTuru(emlak.getIslemTuru());
        response.setEmlakTuru(emlak.getEmlakTuru());
        response.setMetrekare(emlak.getMetrekare());
        response.setOdaSayisi(emlak.getOdaSayisi());
        response.setSalonSayisi(emlak.getSalonSayisi());
        response.setBulunduguKat(emlak.getBulunduguKat());
        response.setBinaKati(emlak.getBinaKati());
        response.setIsinmaTuru(emlak.getIsinmaTuru());
        response.setFiyat(emlak.getFiyat());
        response.setKomisyonOrani(emlak.getKomisyonOrani());
        response.setDurum(emlak.getDurum());
        if (emlak.getFiyat() != null && emlak.getKomisyonOrani() != null) {
            response.setKomisyonTutari(emlak.getFiyat() * emlak.getKomisyonOrani() / 100.0);
        }

        Musteri satici = emlak.getSatici();
        if (satici != null) {
            response.setMusteriId(satici.getId());
            response.setMusteriAd(satici.getAd());
            response.setMusteriSoyad(satici.getSoyad());
        }
        return response;
    }
}
