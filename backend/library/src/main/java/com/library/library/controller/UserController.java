package com.library.library.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.library.library.domain.dto.UserDTO;
import com.library.library.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@Controller
public class UserController {

    private final UserService userService; 
    
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("api/users/{username}")
    public ResponseEntity<UserDTO> findByFullName(@RequestParam String username) {
        var foundUser = userService.findByFullName(username);
        return new ResponseEntity<>(foundUser.orElse(null), HttpStatus.OK);
    }
    

    @PostMapping("api/users/addUser")
    public ResponseEntity<UserDTO> addUser(@RequestBody UserDTO user) {
        var addedUser = userService.addUser(user);
        return new ResponseEntity<>(addedUser, HttpStatus.CREATED);
    }
    
    
}
