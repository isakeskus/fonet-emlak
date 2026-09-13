package com.fonet.emlak.repository;

import com.fonet.emlak.dto.EmlakAramaKriteri;
import com.fonet.emlak.model.Emlak;
import org.springframework.data.jpa.domain.Specification;

public final class EmlakSpecification {

    private EmlakSpecification() {
    }

    public static Specification<Emlak> aramaKriterlerineGore(EmlakAramaKriteri kriter) {
        return Specification
                .where(islemTuruEsit(kriter.getIslemTuru()))
                .and(emlakTuruEsit(kriter.getEmlakTuru()))
                .and(minMetrekare(kriter.getMinMetrekare()))
                .and(maxMetrekare(kriter.getMaxMetrekare()))
                .and(minOdaSayisi(kriter.getMinOdaSayisi()))
                .and(maxOdaSayisi(kriter.getMaxOdaSayisi()))
                .and(isinmaTuruEsit(kriter.getIsinmaTuru()))
                .and(maxFiyat(kriter.getMaxFiyat()))
                .and(durumEsit(kriter.getDurum()));
    }

    private static Specification<Emlak> islemTuruEsit(String islemTuru) {
        return (root, query, cb) ->
                islemTuru == null || islemTuru.isBlank()
                        ? cb.conjunction()
                        : cb.equal(root.get("islemTuru"), islemTuru);
    }

    private static Specification<Emlak> emlakTuruEsit(String emlakTuru) {
        return (root, query, cb) ->
                emlakTuru == null || emlakTuru.isBlank()
                        ? cb.conjunction()
                        : cb.equal(root.get("emlakTuru"), emlakTuru);
    }

    private static Specification<Emlak> minMetrekare(Integer minMetrekare) {
        return (root, query, cb) ->
                minMetrekare == null
                        ? cb.conjunction()
                        : cb.greaterThanOrEqualTo(root.get("metrekare"), minMetrekare);
    }

    private static Specification<Emlak> maxMetrekare(Integer maxMetrekare) {
        return (root, query, cb) ->
                maxMetrekare == null
                        ? cb.conjunction()
                        : cb.lessThanOrEqualTo(root.get("metrekare"), maxMetrekare);
    }

    private static Specification<Emlak> minOdaSayisi(Integer minOdaSayisi) {
        return (root, query, cb) ->
                minOdaSayisi == null
                        ? cb.conjunction()
                        : cb.greaterThanOrEqualTo(root.get("odaSayisi"), minOdaSayisi);
    }

    private static Specification<Emlak> maxOdaSayisi(Integer maxOdaSayisi) {
        return (root, query, cb) ->
                maxOdaSayisi == null
                        ? cb.conjunction()
                        : cb.lessThanOrEqualTo(root.get("odaSayisi"), maxOdaSayisi);
    }

    private static Specification<Emlak> isinmaTuruEsit(String isinmaTuru) {
        return (root, query, cb) ->
                isinmaTuru == null || isinmaTuru.isBlank()
                        ? cb.conjunction()
                        : cb.equal(root.get("isinmaTuru"), isinmaTuru);
    }

    private static Specification<Emlak> maxFiyat(Double maxFiyat) {
        return (root, query, cb) ->
                maxFiyat == null
                        ? cb.conjunction()
                        : cb.lessThanOrEqualTo(root.get("fiyat"), maxFiyat);
    }

    private static Specification<Emlak> durumEsit(String durum) {
        return (root, query, cb) ->
                durum == null || durum.isBlank()
                        ? cb.conjunction()
                        : cb.equal(root.get("durum"), durum);
    }
}
