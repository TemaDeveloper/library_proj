package com.library.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.library.library.domain.entity.Book;

/*
 * now there is no need to implement the own DAO 
 * because JpaRepository implements all the CRUD operations
 * 
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long>{
    
    Book findByTitle(String title);

}
