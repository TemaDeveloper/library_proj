package com.library.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.library.library.domain.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
}
