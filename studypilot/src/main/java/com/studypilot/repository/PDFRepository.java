package com.studypilot.repository;

import com.studypilot.model.PDF;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PDFRepository extends JpaRepository<PDF, Long> {
} 