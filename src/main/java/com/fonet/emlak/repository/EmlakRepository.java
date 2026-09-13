package com.fonet.emlak.repository;

import com.fonet.emlak.model.Emlak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EmlakRepository extends JpaRepository<Emlak, Long>, JpaSpecificationExecutor<Emlak> {

    long countByIslemTuru(String islemTuru);

    long countByDurum(String durum);

    // Bir müşteriye (satıcı/kiralayan) bağlı kaç emlak kaydı olduğunu bulur.
    // Müşteri silinmeden önce bu kontrol yapılır (bkz. MusteriService.musteriSil).
    long countBySatici_Id(Long musteriId);

    // Tamamlanan (satılan/kiralanan) işlemlerden elde edilen toplam komisyon geliri.
    @Query("SELECT COALESCE(SUM(e.fiyat * e.komisyonOrani / 100.0), 0) FROM Emlak e " +
           "WHERE e.durum = 'TAMAMLANDI' AND e.fiyat IS NOT NULL AND e.komisyonOrani IS NOT NULL")
    double toplamKomisyonGeliri();
}
