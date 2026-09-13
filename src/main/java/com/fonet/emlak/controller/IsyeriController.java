package com.fonet.emlak.controller;

import com.fonet.emlak.model.Isyeri;
import com.fonet.emlak.service.IsyeriService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/isyeri")
@CrossOrigin(origins = "*") // Frontend'den gelecek istekler için CORS izni
public class IsyeriController {

    private final IsyeriService isyeriService;

    public IsyeriController(IsyeriService isyeriService) {
        this.isyeriService = isyeriService;
    }

    @GetMapping
    public List<Isyeri> getAll() {
        return isyeriService.tumIsyerleriniGetir();
    }

    @GetMapping("/{id}")
    public Isyeri getById(@PathVariable Long id) {
        return isyeriService.isyeriGetir(id);
    }

    @PostMapping
    public Isyeri create(@RequestBody Isyeri isyeri) {
        return isyeriService.isyeriKaydet(isyeri);
    }

    @PutMapping("/{id}")
    public Isyeri update(@PathVariable Long id, @RequestBody Isyeri isyeri) {
        return isyeriService.isyeriGuncelle(id, isyeri);
    }
}
