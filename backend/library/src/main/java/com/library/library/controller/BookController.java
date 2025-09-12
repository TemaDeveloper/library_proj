package com.library.library.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.library.library.domain.dto.BookDTO;
import com.library.library.service.BookService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/api")
public class BookController {

    private final BookService bookService;

    BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping(path = "/books/addBook", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<BookDTO> addBook(@RequestPart("book") BookDTO bookDTO,
            @RequestPart("image") MultipartFile bookCoverFile) throws IOException {

        BookDTO addedBookDTO = bookService.addBook(bookDTO, bookCoverFile);
        return new ResponseEntity<>(addedBookDTO, HttpStatus.CREATED);
    }

    @PatchMapping("/books/updateBook/{id}")
    public ResponseEntity<BookDTO> updateBook(@PathVariable Long id, @RequestPart("book") String updatesJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> updates = objectMapper.readValue(updatesJson, new TypeReference<Map<String, Object>>() {
        });

        BookDTO updatedBookDTO = bookService.updateBook(id, updates, image);

        return new ResponseEntity<>(updatedBookDTO, HttpStatus.OK);
    }

    @GetMapping("/books/")
    public ResponseEntity<BookDTO> findByBookTitle(@RequestParam String title) {
        BookDTO bookDTO = bookService.findByBookTitle(title);
        return new ResponseEntity<>(bookDTO, HttpStatus.OK);
    }

    @GetMapping("/books/all")
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        List<BookDTO> books = bookService.getAllBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
        BookDTO bookDTO = bookService.findByBookId(id);
        return new ResponseEntity<>(bookDTO, HttpStatus.OK);
    }

    @DeleteMapping("/books/all")
    public ResponseEntity<Void> deleteAllBooks() {
        bookService.deleteAllBooks();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBookById(@PathVariable Long id) {
        bookService.deleteBookById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
