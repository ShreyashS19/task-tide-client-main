package com.smarthub.service;

import com.smarthub.entity.ServiceProvider;
import com.smarthub.exception.ResourceNotFoundException;
import com.smarthub.repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceProviderService {
    
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;
    
    public ServiceProvider getProfile(Integer id) {
        return serviceProviderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
    }
    
    public ServiceProvider updateProfile(Integer id, ServiceProvider updatedProvider) {
        ServiceProvider provider = getProfile(id);
        provider.setFullName(updatedProvider.getFullName());
        provider.setEmail(updatedProvider.getEmail());
        provider.setMobile(updatedProvider.getMobile());
        provider.setServiceType(updatedProvider.getServiceType());
        provider.setExperience(updatedProvider.getExperience());
        provider.setPrice(updatedProvider.getPrice());
        provider.setAvailability(updatedProvider.getAvailability());
        provider.setLocation(updatedProvider.getLocation());
        return serviceProviderRepository.save(provider);
    }
    
    public List<ServiceProvider> searchProviders(String type, String location) {
        if (type != null && location != null) {
            return serviceProviderRepository
                .findByServiceTypeContainingIgnoreCaseAndLocationContainingIgnoreCase(type, location);
        } else if (type != null) {
            return serviceProviderRepository.findByServiceTypeContainingIgnoreCase(type);
        } else if (location != null) {
            return serviceProviderRepository.findByLocationContainingIgnoreCase(location);
        }
        return serviceProviderRepository.findAll();
    }

    public Object getProviderReviews(Integer providerId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getProviderReviews'");
    }
}
