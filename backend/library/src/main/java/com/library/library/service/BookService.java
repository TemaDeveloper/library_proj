package com.library.library.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.management.relation.RelationNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.library.library.domain.dto.BookDTO;
import com.library.library.domain.entity.Author;
import com.library.library.domain.entity.Book;
import com.library.library.domain.entity.Library;
import com.library.library.repository.BookRepository;
import com.library.library.repository.LibraryRepository;

import jakarta.transaction.Transactional;

@Service
public class BookService {

    @Value("${library.api.base}")
    private String baseUrl;

    private String uploadDir = "/tmp/images";
    private Path filePath;
    private String uniqueFilename;
    String createdAt = java.time.Instant.now().toString();

    @Autowired
    private final BookRepository bookRepository;
    @Autowired
    private final LibraryRepository libraryRepository;

    public BookService(BookRepository bookRepository, LibraryRepository libraryRepository) {
        this.bookRepository = bookRepository;
        this.libraryRepository = libraryRepository;
    }

    public void deleteBookById(Long id) {
        bookRepository.deleteById(id);
    }

    public void deleteAllBooks() {
        bookRepository.deleteAll();
    }

    public BookDTO findByBookId(Long id) {
        Book book = bookRepository.findById(id).orElse(null);
        return convertToBookDTO(book);
    }

    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream().map(this::convertToBookDTO).toList();
    }

    public BookDTO findByBookTitle(String title) {
        Book book = bookRepository.findByTitle(title);
        return convertToBookDTO(book);
    }

    @Transactional
    public BookDTO updateBook(Long id, Map<String, Object> updates, MultipartFile image) throws IOException {

        Optional<Book> existingBook = bookRepository.findById(id);

        updates.forEach((key, value) -> {
            switch (key) {
                case "title":
                    existingBook.get().setTitle((String) value);
                    break;
                case "description":
                    existingBook.get().setDescription((String) value);
                    break;
                case "isbn":
                    existingBook.get().setIsbn((String) value);
                    break;
                case "category":
                    existingBook.get().setCategory((String) value);
                    break;
                case "publicationYear":
                    existingBook.get().setPublicationYear(Integer.parseInt(value.toString()));
                    break;
                case "pages":
                    existingBook.get().setPages(Integer.parseInt(value.toString()));
                    break;
                case "rating":
                    existingBook.get().setRating(Double.parseDouble(value.toString()));
                    break;
                case "authorName":
                    String authorName = (String) value;
                    if (authorName != null && !authorName.isEmpty()) {
                        Author author = decomposeNameParts(authorName);
                        existingBook.get().setAuthor(author);
                    }
                    break;
                case "libraryName":
                    Long libraryId = Long.parseLong(value.toString());
                    Library newLibrary = libraryRepository.findById(libraryId).get();                    existingBook.get().setLibrary(newLibrary);
                    break;
            }
        });

        if (image != null && !image.isEmpty()) {
            String newBookCoverUrl = uploadImage(image);
            existingBook.get().setBookCoverUrl(newBookCoverUrl);
        }

        existingBook.get().setUpdatedAt(new Date().toString());

        Book updatedBook = bookRepository.save(existingBook.get());

        return convertToBookDTO(updatedBook);
    }

    @Transactional
    public BookDTO addBook(BookDTO bookDTO, MultipartFile image) throws IOException {

        String bookCoverUrl = uploadImage(image);

        String authorName = bookDTO.getAuthorName();
        Author author = decomposeNameParts(authorName);

        Library library = libraryRepository.findByLibraryName(bookDTO.getLibraryName());

        Book book = new Book(
                bookDTO.getId(),
                bookDTO.getTitle(),
                bookDTO.getIsbn(),
                bookDTO.getCategory(),
                bookDTO.getPublicationYear(),
                bookDTO.getPages(),
                bookDTO.getRating(),
                author,
                bookDTO.getDescription(),
                bookCoverUrl,
                bookDTO.getLibraryName() != null ? library : null,
                createdAt,
                createdAt);

        bookRepository.save(book);

        return convertToBookDTO(book);
    }

    private Author decomposeNameParts(String authorName) {
        String firstName = null;
        String lastName = null;

        if (authorName != null && !authorName.isEmpty()) {
            String[] nameParts = authorName.split(" ", 2);
            firstName = nameParts[0];
            if (nameParts.length > 1) {
                lastName = nameParts[1];
            }
        }

        Author author = new Author(
                firstName,
                lastName,
                null,
                null);
        return author;
    }

    private String uploadImage(MultipartFile image) throws IOException {

        uniqueFilename = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        filePath = Paths.get(uploadDir, uniqueFilename);

        Files.createDirectories(filePath.getParent());
        Files.copy(image.getInputStream(), filePath);

        String bookCoverUrl = "http://localhost:8080" + "/images/" + uniqueFilename;

        return bookCoverUrl;

    }

    private BookDTO convertToBookDTO(Book book) {
        String authorName = "";
        String libraryName = "";

        if (book.getAuthor() != null) {
            String firstName = book.getAuthor().getFirstName();
            String lastName = book.getAuthor().getLastName();

            if (firstName != null) {
                authorName += firstName;
            }
            if (lastName != null) {
                if (!authorName.isEmpty()) {
                    authorName += " ";
                }
                authorName += lastName;
            }
        }

        if (book.getLibrary() != null) {
            libraryName = book.getLibrary().getLibraryName();
        }

        return new BookDTO(
                book.getId(),
                book.getTitle(),
                book.getIsbn(),
                book.getCategory(),
                book.getPublicationYear(),
                book.getPages(),
                book.getRating(),
                authorName,
                book.getAuthor() != null ? book.getAuthor().getBiography() : null,
                book.getAuthor() != null ? book.getAuthor().getAuthorAvatarUrl() : null,
                book.getDescription(),
                book.getBookCoverUrl(),
                libraryName,
                book.getCreatedAt(),
                book.getUpdatedAt());

    }

}
