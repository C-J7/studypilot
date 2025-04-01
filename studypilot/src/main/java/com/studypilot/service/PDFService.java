package com.studypilot.service;

import com.studypilot.model.PDF;
import com.studypilot.repository.PDFRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class PDFService {

    @Autowired
    private PDFRepository pdfRepository;

    public PDF savePDF(MultipartFile file) throws IOException {
        PDDocument document = PDDocument.load(file.getInputStream());
        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);
        
        PDF pdf = new PDF();
        pdf.setName(file.getOriginalFilename());
        pdf.setSize(String.format("%.2f KB", file.getSize() / 1024.0));
        pdf.setPages(document.getNumberOfPages());
        pdf.setContent(text);
        pdf.setUploadedAt(LocalDateTime.now().toString());

        document.close();
        return pdfRepository.save(pdf);
    }
} 