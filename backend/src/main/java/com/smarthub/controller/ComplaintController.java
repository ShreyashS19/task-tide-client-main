package com.smarthub.controller;

import com.smarthub.dto.ComplaintRequest;
import com.smarthub.entity.Complaint;
import com.smarthub.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:3000")
public class ComplaintController {
    
    @Autowired
    private ComplaintService complaintService;
    
    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@Valid @RequestBody ComplaintRequest request) {
        return ResponseEntity.ok(complaintService.createComplaint(request));
    }
}
