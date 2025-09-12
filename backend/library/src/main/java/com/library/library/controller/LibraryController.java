package com.library.library.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.library.library.domain.dto.LibraryDTO;
import com.library.library.service.LibraryService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@Controller
public class LibraryController {
    
    private final LibraryService libraryService;
    
    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @PostMapping("api/libraries/addLibrary")
    public ResponseEntity<LibraryDTO> addLibrary(@RequestBody LibraryDTO libraryDTO) {
        var addedLibrary = libraryService.addLibrary(libraryDTO);        
        return new ResponseEntity<>(addedLibrary, HttpStatus.CREATED);
    }
    
    
}
