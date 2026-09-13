package com.fonet.emlak.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Servis katmanının fırlattığı ama hiçbir controller'da yakalanmayan hataları
 * (ör. IsyeriService.isyeriGuncelle içindeki "bulunamadı" durumu) düzgün bir
 * JSON yanıtına çevirir. Bu olmadan Spring, varsayılan Whitelabel Error
 * sayfasıyla 500 döndürüyordu.
 *
 * ResponseStatusException (ör. EmlakController) Spring tarafından zaten
 * otomatik olarak doğru status koduna çevrildiği için burada ayrıca ele
 * alınmasına gerek yok.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("hata", ex.getMessage()));
    }

    // Örn. bağlı emlak kaydı olan bir müşteri silinmeye çalışıldığında
    // (bkz. MusteriService.musteriSil) 409 Conflict ile anlaşılır bir mesaj döner.
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("hata", ex.getMessage()));
    }
}
