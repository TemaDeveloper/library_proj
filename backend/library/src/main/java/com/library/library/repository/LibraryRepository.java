package com.library.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.library.library.domain.entity.Library;

@Repository
public interface LibraryRepository extends JpaRepository<Library, Long>{
    Library findByLibraryName(String libraryName);
}
