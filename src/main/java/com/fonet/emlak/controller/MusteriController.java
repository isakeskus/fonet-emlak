package com.fonet.emlak.controller;

import com.fonet.emlak.model.Musteri;
import com.fonet.emlak.service.MusteriService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/musteri")
@CrossOrigin(origins = "*")
public class MusteriController {

    private final MusteriService musteriService;

    public MusteriController(MusteriService musteriService) {
        this.musteriService = musteriService;
    }

    @GetMapping
    public List<Musteri> getAll() {
        return musteriService.tumMusterileriGetir();
    }

    @PostMapping
    public Musteri create(@RequestBody Musteri musteri) {
        return musteriService.musteriKaydet(musteri);
    }

    @PutMapping("/{id}")
    public Musteri update(@PathVariable Long id, @RequestBody Musteri musteri) {
        return musteriService.musteriGuncelle(id, musteri);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        musteriService.musteriSil(id);
        return ResponseEntity.noContent().build();
    }
}
