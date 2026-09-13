package com.fonet.emlak.service;

import com.fonet.emlak.model.Musteri;
import com.fonet.emlak.repository.EmlakRepository;
import com.fonet.emlak.repository.MusteriRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MusteriService {

    private final MusteriRepository musteriRepository;
    private final EmlakRepository emlakRepository;

    public MusteriService(MusteriRepository musteriRepository, EmlakRepository emlakRepository) {
        this.musteriRepository = musteriRepository;
        this.emlakRepository = emlakRepository;
    }

    public Musteri musteriKaydet(Musteri musteri) {
        return musteriRepository.save(musteri);
    }

    public List<Musteri> tumMusterileriGetir() {
        return musteriRepository.findAll();
    }

    public Musteri musteriGetir(Long id) {
        return musteriRepository.findById(id).orElse(null);
    }

    public Musteri musteriGuncelle(Long id, Musteri guncel) {
        Musteri mevcut = musteriRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Müşteri bulunamadı: " + id));
        mevcut.setAd(guncel.getAd());
        mevcut.setSoyad(guncel.getSoyad());
        mevcut.setEvTelefonu(guncel.getEvTelefonu());
        mevcut.setCepTelefonu(guncel.getCepTelefonu());
        mevcut.setEmail(guncel.getEmail());
        return musteriRepository.save(mevcut);
    }

    public void musteriSil(Long id) {
        if (!musteriRepository.existsById(id)) {
            throw new IllegalArgumentException("Müşteri bulunamadı: " + id);
        }
        long baglıEmlakSayisi = emlakRepository.countBySatici_Id(id);
        if (baglıEmlakSayisi > 0) {
            throw new IllegalStateException(
                    "Bu müşteriye ait " + baglıEmlakSayisi + " emlak kaydı olduğu için silinemez. "
                            + "Önce ilgili emlak kayıtlarını silin.");
        }
        musteriRepository.deleteById(id);
    }
}
