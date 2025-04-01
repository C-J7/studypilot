package com.studypilot.controller;

import com.studypilot.model.PDF;
import com.studypilot.service.PDFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "http://localhost:3000") // replace with frontend URL
public class PDFController {

    @Autowired
    private PDFService pdfService;

    @PostMapping("/upload")
    public ResponseEntity<PDF> uploadPDF(@RequestParam("file") MultipartFile file) {
        try {
            PDF pdf = pdfService.savePDF(file);
            return ResponseEntity.ok(pdf);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 