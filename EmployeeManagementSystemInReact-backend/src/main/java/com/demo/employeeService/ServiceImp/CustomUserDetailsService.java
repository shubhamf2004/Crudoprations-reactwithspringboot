package com.demo.employeeService.ServiceImp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.demo.employeeRepository.UserRepository;
import com.demo.entity.User;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = repo.findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("User Not Found with email: " + email);
        }

        String role = user.getRole();
        if (role == null || role.isEmpty()) {
            role = "ROLE_USER";
        } else {
            role = role.trim().toUpperCase();
            if (!role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(role))
        );
    }
}
