package com.fonet.emlak.service;

import com.fonet.emlak.dto.EmlakAramaKriteri;
import com.fonet.emlak.dto.EmlakResponse;
import com.fonet.emlak.model.Emlak;
import com.fonet.emlak.repository.EmlakRepository;
import com.fonet.emlak.repository.EmlakSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class EmlakService {

    private final EmlakRepository emlakRepository;

    public EmlakService(EmlakRepository emlakRepository) {
        this.emlakRepository = emlakRepository;
    }

    public Emlak emlakKaydet(Emlak emlak) {
        return emlakRepository.save(emlak);
    }

    // Sayfalama: yüzlerce/binlerce kayıtta tüm listeyi tek seferde çekmemek için.
    public Page<EmlakResponse> tumEmlaklariGetir(Pageable pageable) {
        return emlakRepository.findAll(pageable).map(EmlakResponse::from);
    }

    public Page<EmlakResponse> emlakAra(EmlakAramaKriteri kriter, Pageable pageable) {
        return emlakRepository.findAll(EmlakSpecification.aramaKriterlerineGore(kriter), pageable)
                .map(EmlakResponse::from);
    }

    public Emlak emlakGuncelle(Long id, Emlak guncel) {
        Emlak mevcut = emlakRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Emlak bulunamadı: " + id));
        mevcut.setIslemTuru(guncel.getIslemTuru());
        mevcut.setEmlakTuru(guncel.getEmlakTuru());
        mevcut.setMetrekare(guncel.getMetrekare());
        mevcut.setOdaSayisi(guncel.getOdaSayisi());
        mevcut.setSalonSayisi(guncel.getSalonSayisi());
        mevcut.setBulunduguKat(guncel.getBulunduguKat());
        mevcut.setBinaKati(guncel.getBinaKati());
        mevcut.setIsinmaTuru(guncel.getIsinmaTuru());
        mevcut.setFiyat(guncel.getFiyat());
        mevcut.setKomisyonOrani(guncel.getKomisyonOrani());
        mevcut.setDurum(guncel.getDurum());
        mevcut.setSatici(guncel.getSatici());
        return emlakRepository.save(mevcut);
    }

    public void emlakSil(Long id) {
        if (!emlakRepository.existsById(id)) {
            throw new IllegalArgumentException("Emlak bulunamadı: " + id);
        }
        emlakRepository.deleteById(id);
    }
}
