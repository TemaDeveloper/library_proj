package com.library.library.domain.dto;

public class ReviewDTO {
    private Long id; 
    private String name;
    private String content;
    private String email;
    private Long bookId;

    public ReviewDTO() {}

    public ReviewDTO(Long id, String name, String content, String email, Long bookId) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.email = email;
        this.bookId = bookId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

}
