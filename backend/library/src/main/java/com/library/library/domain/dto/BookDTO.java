package com.library.library.domain.dto;

import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

public class BookDTO {
    private Long id;
    private String title;
    private String isbn;
    private String category;
    private int publicationYear;
    private int pages;
    private double rating;
    private String authorName;
    private String authorBiography;
    private String authorUrl;
    private String description;
    private String bookCoverUrl;
    private String libraryName;
    private String createdAt;
    private String updatedAt;

    public BookDTO() {
    }

    public BookDTO(String title, String authorName, String authorBiography, String authorUrl, String description,
            String bookCoverUrl, String libraryName) {
        this.title = title;
        this.authorName = authorName;
        this.authorBiography = authorBiography;
        this.authorUrl = authorUrl;
        this.description = description;
        this.bookCoverUrl = bookCoverUrl;
        this.libraryName = libraryName;
    }

    public BookDTO(Long id, String title, String isbn, String category, int publicationYear, int pages, double rating,
            String authorName, String authorBiography, String authorUrl, String description, String bookCoverUrl,
            String libraryName, String createdAt, String updatedAt) {
        this.id = id;
        this.title = title;
        this.isbn = isbn;
        this.category = category;
        this.publicationYear = publicationYear;
        this.pages = pages;
        this.rating = rating;
        this.authorName = authorName;
        this.authorBiography = authorBiography;
        this.authorUrl = authorUrl;
        this.description = description;
        this.bookCoverUrl = bookCoverUrl;
        this.libraryName = libraryName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(int publicationYear) {
        this.publicationYear = publicationYear;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getAuthorBiography() {
        return authorBiography;
    }

    public String getAuthorUrl() {
        return authorUrl;
    }

    public String getTitle() {
        return title;
    }

    public String getBookCoverUrl() {
        return bookCoverUrl;
    }

    public String getDescription() {
        return description;
    }

    public String getLibraryName() {
        return libraryName;
    }

    public void setAuthorBiography(String authorBiography) {
        this.authorBiography = authorBiography;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public void setAuthorUrl(String authorUrl) {
        this.authorUrl = authorUrl;
    }

    public void setBookCoverUrl(String bookCoverUrl) {
        this.bookCoverUrl = bookCoverUrl;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLibraryName(String libraryName) {
        this.libraryName = libraryName;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
