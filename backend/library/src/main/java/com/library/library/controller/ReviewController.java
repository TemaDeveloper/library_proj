package com.library.library.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.library.library.domain.dto.ReviewDTO;
import com.library.library.service.ReviewService;

@Controller
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }
    
    @PostMapping(path="/addReview")
    public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewDTO review){
        ReviewDTO createdReview = reviewService.saveReview(review);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ReviewDTO>> getAllReviews(@PathVariable Long bookId) {
        List<ReviewDTO> reviews = reviewService.getAllReviews(bookId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    

}
