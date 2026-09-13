package com.fonet.emlak.controller;

import com.fonet.emlak.dto.EmlakAramaKriteri;
import com.fonet.emlak.dto.EmlakResponse;
import com.fonet.emlak.model.Emlak;
import com.fonet.emlak.model.Musteri;
import com.fonet.emlak.service.EmlakService;
import com.fonet.emlak.service.MusteriService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/emlak")
@CrossOrigin(origins = "*")
public class EmlakController {

    private final EmlakService emlakService;
    private final MusteriService musteriService;

    public EmlakController(EmlakService emlakService, MusteriService musteriService) {
        this.emlakService = emlakService;
        this.musteriService = musteriService;
    }

    @GetMapping
    public Page<EmlakResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return emlakService.tumEmlaklariGetir(sayfalama(page, size));
    }

    @GetMapping("/ara")
    public Page<EmlakResponse> ara(
            @RequestParam String islemTuru,
            @RequestParam(required = false) String emlakTuru,
            @RequestParam(required = false) Integer minMetrekare,
            @RequestParam(required = false) Integer maxMetrekare,
            @RequestParam(required = false) Integer minOdaSayisi,
            @RequestParam(required = false) Integer maxOdaSayisi,
            @RequestParam(required = false) String isinmaTuru,
            @RequestParam(required = false) Double maxFiyat,
            @RequestParam(required = false) String durum,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        EmlakAramaKriteri kriter = new EmlakAramaKriteri();
        kriter.setIslemTuru(islemTuru);
        kriter.setEmlakTuru(emlakTuru);
        kriter.setMinMetrekare(minMetrekare);
        kriter.setMaxMetrekare(maxMetrekare);
        kriter.setMinOdaSayisi(minOdaSayisi);
        kriter.setMaxOdaSayisi(maxOdaSayisi);
        kriter.setIsinmaTuru(isinmaTuru);
        kriter.setMaxFiyat(maxFiyat);
        kriter.setDurum(durum);

        return emlakService.emlakAra(kriter, sayfalama(page, size));
    }

    // Sayfa boyutunu makul bir üst sınırla (100) sınırlar; kötü niyetli/hatalı
    // isteklerin tüm tabloyu tek seferde çekmesini engeller.
    private Pageable sayfalama(int page, int size) {
        int guvenliSize = Math.min(Math.max(size, 1), 100);
        return PageRequest.of(Math.max(page, 0), guvenliSize, Sort.by(Sort.Direction.DESC, "id"));
    }

    @PostMapping
    public EmlakResponse create(@RequestBody EmlakRequest request) {
        Musteri musteri = musteriZorunluVeGecerli(request.getMusteriId());
        Emlak emlak = requestToEmlak(request, musteri);
        return EmlakResponse.from(emlakService.emlakKaydet(emlak));
    }

    @PutMapping("/{id}")
    public EmlakResponse update(@PathVariable Long id, @RequestBody EmlakRequest request) {
        Musteri musteri = musteriZorunluVeGecerli(request.getMusteriId());
        Emlak guncelVeri = requestToEmlak(request, musteri);
        return EmlakResponse.from(emlakService.emlakGuncelle(id, guncelVeri));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        emlakService.emlakSil(id);
        return ResponseEntity.noContent().build();
    }

    // Müşteri seçimi zorunlu; seçilen müşteri gerçekten var mı diye de kontrol eder.
    // create() ve update() ikisi de aynı kuralı uyguladığı için ortak metoda çıkarıldı.
    private Musteri musteriZorunluVeGecerli(Long musteriId) {
        if (musteriId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Müşteri seçimi zorunludur.");
        }
        Musteri musteri = musteriService.musteriGetir(musteriId);
        if (musteri == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Seçilen müşteri bulunamadı.");
        }
        return musteri;
    }

    private Emlak requestToEmlak(EmlakRequest request, Musteri musteri) {
        Emlak emlak = new Emlak();
        emlak.setIslemTuru(request.getIslemTuru());
        emlak.setEmlakTuru(request.getEmlakTuru());
        emlak.setMetrekare(request.getMetrekare());
        emlak.setOdaSayisi(request.getOdaSayisi());
        emlak.setSalonSayisi(request.getSalonSayisi());
        emlak.setBulunduguKat(request.getBulunduguKat());
        emlak.setBinaKati(request.getBinaKati());
        emlak.setIsinmaTuru(request.getIsinmaTuru());
        emlak.setFiyat(request.getFiyat());
        emlak.setKomisyonOrani(request.getKomisyonOrani() != null ? request.getKomisyonOrani() : 2.0);
        emlak.setDurum(request.getDurum() != null && !request.getDurum().isBlank() ? request.getDurum() : "AKTİF");
        emlak.setSatici(musteri);
        return emlak;
    }

    // DTO Sınıfı
    public static class EmlakRequest {
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
        private String durum;
        private Long musteriId;

        // Getter & Setters
        public String getIslemTuru() { return islemTuru; }
        public void setIslemTuru(String islemTuru) { this.islemTuru = islemTuru; }
        public String getEmlakTuru() { return emlakTuru; }
        public void setEmlakTuru(String emlakTuru) { this.emlakTuru = emlakTuru; }
        public Integer getMetrekare() { return metrekare; }
        public void setMetrekare(Integer metrekare) { this.metrekare = metrekare; }
        public Integer getOdaSayisi() { return odaSayisi; }
        public void setOdaSayisi(Integer odaSayisi) { this.odaSayisi = odaSayisi; }
        public Integer getSalonSayisi() { return salonSayisi; }
        public void setSalonSayisi(Integer salonSayisi) { this.salonSayisi = salonSayisi; }
        public Integer getBulunduguKat() { return bulunduguKat; }
        public void setBulunduguKat(Integer bulunduguKat) { this.bulunduguKat = bulunduguKat; }
        public Integer getBinaKati() { return binaKati; }
        public void setBinaKati(Integer binaKati) { this.binaKati = binaKati; }
        public String getIsinmaTuru() { return isinmaTuru; }
        public void setIsinmaTuru(String isinmaTuru) { this.isinmaTuru = isinmaTuru; }
        public Double getFiyat() { return fiyat; }
        public void setFiyat(Double fiyat) { this.fiyat = fiyat; }
        public Double getKomisyonOrani() { return komisyonOrani; }
        public void setKomisyonOrani(Double komisyonOrani) { this.komisyonOrani = komisyonOrani; }
        public String getDurum() { return durum; }
        public void setDurum(String durum) { this.durum = durum; }
        public Long getMusteriId() { return musteriId; }
        public void setMusteriId(Long musteriId) { this.musteriId = musteriId; }
    }
}
