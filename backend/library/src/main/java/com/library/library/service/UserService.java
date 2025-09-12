package com.library.library.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.library.library.domain.dto.UserDTO;
import com.library.library.domain.entity.User;
import com.library.library.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<UserDTO> findByFullName(String username) {
        String[] nameParts = username.split(" ", 2); 
        String firstName = nameParts.length > 0 ? nameParts[0] : "";
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        return userRepository.findByFirstNameAndLastName(firstName, lastName)
                             .map(this::convertToDto);
    }

    public UserDTO addUser(UserDTO userDTO){
        User user = new User(
            userDTO.getUsername().split(" ")[0],
            userDTO.getUsername().split(" ")[1],
            userDTO.getEmail(),
            userDTO.getPassword()
        );
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    private UserDTO convertToDto(User user){
        return new UserDTO(
            user.getFirstName() + " " + user.getLastName(),
            user.getEmail(),
            user.getPassword()
        );
    }

}
