package com.library.library.domain.dto;

import java.util.List;

public class LibraryDTO {
    
    private Long id;
    private String libraryName;
    private UserDTO user;
    private String libraryCoverUrl;
    private List<BookDTO> books;

    public LibraryDTO() {}

    public LibraryDTO(String libraryName, UserDTO user, List<BookDTO> books, String libraryCoverUrl) {
        this.libraryName = libraryName;
        this.user = user;
        this.books = books;
        this.libraryCoverUrl = libraryCoverUrl;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getLibraryName() {
        return libraryName;
    }
    public UserDTO getUser() {
        return user;
    }
    public List<BookDTO> getBooks() {
        return books;
    }
    public String getLibraryCoverUrl() {
        return libraryCoverUrl;
    }
    public void setBooks(List<BookDTO> books) {
        this.books = books;
    }
    public void setLibraryCoverUrl(String libraryCoverUrl) {
        this.libraryCoverUrl = libraryCoverUrl;
    }
    public void setLibraryName(String libraryName) {
        this.libraryName = libraryName;
    }
    public void setUser(UserDTO user) {
        this.user = user;
    }

}
