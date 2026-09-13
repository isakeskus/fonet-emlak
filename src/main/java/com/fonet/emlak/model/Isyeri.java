package com.fonet.emlak.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Isyeri {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String isletmeAdi;
    private String yetkili;
    private String adres;
    private String telefon;
    private String fax;
}
