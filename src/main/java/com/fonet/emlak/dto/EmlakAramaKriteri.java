package com.fonet.emlak.dto;

import lombok.Data;

@Data
public class EmlakAramaKriteri {

    private String islemTuru;
    private String emlakTuru;
    private Integer minMetrekare;
    private Integer maxMetrekare;
    private Integer minOdaSayisi;
    private Integer maxOdaSayisi;
    private String isinmaTuru;
    private Double maxFiyat;
    private String durum;
}
