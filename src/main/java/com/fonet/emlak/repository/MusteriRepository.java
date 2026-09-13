package com.fonet.emlak.repository;

import com.fonet.emlak.model.Musteri;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MusteriRepository extends JpaRepository<Musteri, Long> {
}
