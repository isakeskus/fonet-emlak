package com.fonet.emlak.repository;

import com.fonet.emlak.model.Isyeri;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IsyeriRepository extends JpaRepository<Isyeri, Long> {
}
