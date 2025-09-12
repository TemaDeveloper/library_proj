package com.library.library.domain.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class Library {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String libraryName;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    private String libraryCoverUrl;

    @OneToMany(mappedBy = "library", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Book> books;

    public Library() {
    }

    public Library(String libraryName, User user, List<Book> books, String libraryCoverUrl) {
        this.libraryName = libraryName;
        this.user = user;
        this.books = books;
        this.libraryCoverUrl = libraryCoverUrl;
    }

    public String getLibraryCoverUrl() {
        return libraryCoverUrl;
    }

    public void setLibraryCoverUrl(String libraryCoverUrl) {
        this.libraryCoverUrl = libraryCoverUrl;
    }

    public Long getId() {
        return id;
    }

    public String getLibraryName() {
        return libraryName;
    }

    public List<Book> getBooks() {
        return books;
    }
    public User getUser() {
        return user;
    }
    public void setBooks(List<Book> books) {
        this.books = books;
    }
    public void setUser(User user) {
        this.user = user;
    }

}
