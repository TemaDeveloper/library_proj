package com.library.library.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.library.library.domain.entity.Author;
import com.library.library.domain.entity.Book;
import com.library.library.domain.entity.Library;
import com.library.library.domain.entity.User;

@DataJpaTest
public class BookRepositoryTest {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private TestEntityManager entityManager;

    private Book setupBook(String title) {
        Author author = new Author("First Name", "Last Name", "Bio", "url.com/author.jpg");
        User user = new User();
        User savedUser = entityManager.persist(user); 
        Library library = new Library("Test Library", savedUser, null, "lib cover");
        
        Author savedAuthor = entityManager.persist(author);
        Library savedLibrary = entityManager.persist(library);
        
        Book book = new Book();
        book.setTitle(title);
        book.setIsbn("123-4567890123");
        book.setAuthor(savedAuthor);
        book.setLibrary(savedLibrary);
        book.setCategory("Fiction");
        book.setPublicationYear(2024);
        book.setPages(100);
        book.setRating(4.5);
        
        return book;
    }

    @Test
    @DisplayName("Find Book by Title Test")
    void findBookByTitleTest() {
        Book book = setupBook("Unique Title");
        entityManager.persistAndFlush(book);

        Book foundBook = bookRepository.findByTitle("Unique Title");

        assertNotNull(foundBook);
        assertEquals("Unique Title", foundBook.getTitle());
    }

    
    
}
