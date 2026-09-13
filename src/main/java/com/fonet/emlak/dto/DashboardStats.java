package com.fonet.emlak.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {

    private long musteriSayisi;
    private long emlakSayisi;
    private long kiralikSayisi;
    private long satilikSayisi;
    private long tamamlananIslemSayisi;
    private double toplamKomisyonGeliri;
    private String isyeriAdi;
}
