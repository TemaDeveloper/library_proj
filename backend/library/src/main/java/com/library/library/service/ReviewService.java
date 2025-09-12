package com.library.library.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.library.domain.dto.ReviewDTO;
import com.library.library.domain.entity.Book;
import com.library.library.domain.entity.Review;
import com.library.library.repository.BookRepository;
import com.library.library.repository.ReviewRepository;

import jakarta.transaction.Transactional;

@Service
public class ReviewService {

    @Autowired
    private final BookRepository bookRepository;
    @Autowired
    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository, BookRepository bookRepository) {
        this.reviewRepository = reviewRepository;
        this.bookRepository = bookRepository;
    }

    public List<ReviewDTO> getAllReviews(Long id) {


        List<Review> reviews = reviewRepository.findAll()
        .stream()
        .filter(review -> review.getBook().getId() == id).toList();

        return reviews.stream()
                .map(review -> convertToReviewDTO(review))
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO saveReview(ReviewDTO reviewDTO) {

        Long bookId = reviewDTO.getBookId();
        if (bookId == null) {
            throw new IllegalArgumentException("Book ID must not be null");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with ID: " + bookId));

        Review review = new Review();
        review.setId(reviewDTO.getId());
        review.setName(reviewDTO.getName());
        review.setEmail(reviewDTO.getEmail());
        review.setContent(reviewDTO.getContent());

        review.setBook(book);

        Review savedReview = reviewRepository.save(review);
        return convertToReviewDTO(savedReview);

    }

    private ReviewDTO convertToReviewDTO(Review review) {
        return new ReviewDTO(
                review.getId(),
                review.getName(),
                review.getContent(),
                review.getEmail(),
                review.getBook().getId());
    }

}
