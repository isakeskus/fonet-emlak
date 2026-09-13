package com.fonet.emlak.controller;

import com.fonet.emlak.dto.DashboardStats;
import com.fonet.emlak.model.Isyeri;
import com.fonet.emlak.repository.EmlakRepository;
import com.fonet.emlak.repository.MusteriRepository;
import com.fonet.emlak.service.IsyeriService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final MusteriRepository musteriRepository;
    private final EmlakRepository emlakRepository;
    private final IsyeriService isyeriService;

    public DashboardController(MusteriRepository musteriRepository,
                               EmlakRepository emlakRepository,
                               IsyeriService isyeriService) {
        this.musteriRepository = musteriRepository;
        this.emlakRepository = emlakRepository;
        this.isyeriService = isyeriService;
    }

    @GetMapping("/stats")
    public DashboardStats getStats() {
        List<Isyeri> isyerleri = isyeriService.tumIsyerleriniGetir();
        String isyeriAdi = isyerleri.isEmpty()
                ? "Kayıt Bekleniyor"
                : isyerleri.get(0).getIsletmeAdi();

        return new DashboardStats(
                musteriRepository.count(),
                emlakRepository.count(),
                emlakRepository.countByIslemTuru("KİRALIK"),
                emlakRepository.countByIslemTuru("SATILIK"),
                emlakRepository.countByDurum("TAMAMLANDI"),
                emlakRepository.toplamKomisyonGeliri(),
                isyeriAdi
        );
    }
}
