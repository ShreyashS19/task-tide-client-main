package com.smarthub.service;

import com.smarthub.dto.BookingRequest;
import com.smarthub.entity.Booking;
import com.smarthub.exception.ResourceNotFoundException;
import com.smarthub.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    public Booking createBooking(BookingRequest request) {
        Booking booking = new Booking();
        booking.setUserId(request.getUserId());
        booking.setProviderId(request.getProviderId());
        booking.setServiceType(request.getServiceType());
        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setStatus(Booking.BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getUserBookings(Integer userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    public List<Booking> getProviderBookings(Integer providerId) {
        return bookingRepository.findByProviderId(providerId);
    }
    
    public Booking updateBookingStatus(Integer bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.valueOf(status.toUpperCase()));
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
