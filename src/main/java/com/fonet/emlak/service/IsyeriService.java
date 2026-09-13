package com.fonet.emlak.service;

import com.fonet.emlak.model.Isyeri;
import com.fonet.emlak.repository.IsyeriRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IsyeriService {

    private final IsyeriRepository isyeriRepository;

    public IsyeriService(IsyeriRepository isyeriRepository) {
        this.isyeriRepository = isyeriRepository;
    }

    public Isyeri isyeriKaydet(Isyeri isyeri) {
        return isyeriRepository.save(isyeri);
    }

    public List<Isyeri> tumIsyerleriniGetir() {
        return isyeriRepository.findAll();
    }

    public Isyeri isyeriGetir(Long id) {
        return isyeriRepository.findById(id).orElse(null);
    }

    public Isyeri isyeriGuncelle(Long id, Isyeri guncel) {
        Isyeri mevcut = isyeriRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("İşyeri bulunamadı: " + id));
        mevcut.setIsletmeAdi(guncel.getIsletmeAdi());
        mevcut.setYetkili(guncel.getYetkili());
        mevcut.setAdres(guncel.getAdres());
        mevcut.setTelefon(guncel.getTelefon());
        mevcut.setFax(guncel.getFax());
        return isyeriRepository.save(mevcut);
    }
}
