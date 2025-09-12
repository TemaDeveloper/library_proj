package com.library.library.domain.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Book {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "author_id")
    private Author author;

    private String description;
    private String bookCoverUrl;
    private String isbn;
    private String category;
    private int publicationYear;
    private int pages;
    private double rating;
    private String createdAt;
    private String updatedAt;
    

    @ManyToOne
    @JoinColumn(name = "library_id")
    private Library library;

    public Book() {}
    public Book(String title, Author author, String description, String bookCoverUrl, Library library) {
        this.title = title;
        this.author = author;
        this.description = description;
        this.bookCoverUrl = bookCoverUrl;
        this.library = library;
    }

    public Book(Long id, String title, String isbn, String category, int publicationYear, int pages, double rating,
            Author author, String description, String bookCoverUrl, Library library, String createdAt, String updatedAt) {
        this.id = id;
        this.title = title;
        this.isbn = isbn;
        this.category = category;
        this.publicationYear = publicationYear;
        this.pages = pages;
        this.rating = rating;
        this.author = author;
        this.description = description;
        this.bookCoverUrl = bookCoverUrl;
        this.library = library;
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

    public String getBookCoverUrl() {
        return bookCoverUrl;
    }

    public void setBookCoverUrl(String bookCoverUrl) {
        this.bookCoverUrl = bookCoverUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public Author getAuthor() {
        return author;
    }

    public String getTitle() {
        return title;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setLibrary(Library library) {
        this.library = library;
    }

    public Library getLibrary() {
        return library;
    }

}
