package com.library.library.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.library.domain.dto.LibraryDTO;
import com.library.library.domain.dto.UserDTO;
import com.library.library.domain.entity.Book;
import com.library.library.domain.entity.Library;
import com.library.library.domain.entity.User;
import com.library.library.repository.BookRepository;
import com.library.library.repository.LibraryRepository;
import com.library.library.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class LibraryService {

    @Autowired
    private final LibraryRepository libraryRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final BookRepository bookRepository;
    
    public LibraryService(LibraryRepository libraryRepository, UserRepository userRepository, BookRepository bookRepository) {
        this.libraryRepository = libraryRepository; 
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional
    public LibraryDTO addLibrary(LibraryDTO libraryDTO) {

       String fullName = libraryDTO.getUser().getUsername();
        String[] nameParts = fullName.split(" ", 2); // Split only into two parts
        String firstName = nameParts.length > 0 ? nameParts[0] : "";
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        // Query the repository using the correct method signature with two arguments
        Optional<User> userOptional = userRepository.findByFirstNameAndLastName(firstName, lastName);

        // Use Optional to handle the case where the user is not found
        User user = userOptional.orElseThrow(() -> new RuntimeException("User with username '" + fullName + "' not found."));


        List<Book> books = bookRepository.findAll().stream()
                .filter(book -> libraryDTO.getBooks().stream()
                        .anyMatch(bookDTO -> bookDTO.getTitle().equals(book.getTitle())))
                .toList();

        Library library = new Library(
            libraryDTO.getLibraryName(),
            user,
            books,
            libraryDTO.getLibraryCoverUrl()
        );

        Library savedLibrary = libraryRepository.save(library);
        
        return convertToDTO(savedLibrary);
    }


    LibraryDTO convertToDTO(Library library) {
        User user = library.getUser();
        UserDTO userDTO = new UserDTO(user.getFirstName() + " " + user.getLastName(), user.getEmail(), user.getPassword());

        List<Book> books = library.getBooks();
        List<com.library.library.domain.dto.BookDTO> bookDTOs = books.stream()
                .map(book -> {
                    String authorName = book.getAuthor().getFirstName();
                    if (book.getAuthor().getLastName() != null) {
                        authorName += " " + book.getAuthor().getLastName();
                    }
                    return new com.library.library.domain.dto.BookDTO(
                            book.getTitle(),
                            authorName,
                            book.getAuthor().getBiography(),
                            book.getAuthor().getAuthorAvatarUrl(),
                            book.getDescription(),
                            book.getBookCoverUrl(),
                            library.getLibraryName()
                    );
                })
                .toList();

        LibraryDTO libraryDTO = new LibraryDTO(
                library.getLibraryName(),
                userDTO,
                bookDTOs,
                library.getLibraryCoverUrl()
        );
        libraryDTO.setId(library.getId());
        return libraryDTO;
    }
    



}
