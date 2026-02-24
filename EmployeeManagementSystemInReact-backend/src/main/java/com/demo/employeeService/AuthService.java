package com.demo.employeeService;

import com.demo.entity.User;

public interface AuthService {

    String register(User user);

    String login(String email, String password);
    
}
