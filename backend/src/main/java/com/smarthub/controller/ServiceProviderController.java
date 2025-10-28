package com.smarthub.controller;

import com.smarthub.entity.ServiceProvider;
import com.smarthub.entity.Review;
import com.smarthub.repository.ReviewRepository;
import com.smarthub.service.ServiceProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceProviderController {
    
    @Autowired
    private ServiceProviderService serviceProviderService;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @GetMapping("/profile/{id}")
    public ResponseEntity<ServiceProvider> getProfile(@PathVariable Integer id) {
        return ResponseEntity.ok(serviceProviderService.getProfile(id));
    }
    
    @PutMapping("/profile/{id}")
    public ResponseEntity<ServiceProvider> updateProfile(
        @PathVariable Integer id, 
        @RequestBody ServiceProvider provider
    ) {
        return ResponseEntity.ok(serviceProviderService.updateProfile(id, provider));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ServiceProvider>> searchProviders(
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String location
    ) {
        return ResponseEntity.ok(serviceProviderService.searchProviders(type, location));
    }
    
    @GetMapping("/reviews/{id}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable Integer id) {
        return ResponseEntity.ok(reviewRepository.findByProviderId(id));
    }
}
