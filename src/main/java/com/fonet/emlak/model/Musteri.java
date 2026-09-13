package com.fonet.emlak.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Musteri {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String ad;
    private String soyad;
    private String evTelefonu;
    private String cepTelefonu;
    private String email;
    
    @OneToMany(mappedBy = "satici")
    @JsonIgnore
    private List<Emlak> emlaklar;
}
