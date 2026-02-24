package com.demo.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.demo.employeeService.ServiceImp.CustomUserDetailsService;
import com.demo.util.JwtTokenProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	
	@Autowired
	private JwtTokenProvider jwtProvider;
	
	@Autowired
    private CustomUserDetailsService userService;
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		if (request.getMethod().equals("OPTIONS")) {
            response.setStatus(HttpServletResponse.SC_OK);
            filterChain.doFilter(request, response);
            return;
        }
		  String header = request.getHeader("Authorization");
		  
		  String token = null;
	        String email = null;
	        
	        if (header != null && header.startsWith("Bearer ")) {
	            token = header.substring(7);
	            try {
	                email = jwtProvider.extractUsername(token);
	                System.out.println("JWT Filter: Extracted email: " + email + " from token");
	            } catch (Exception e) {
	                System.err.println("JWT Filter: Failed to extract email from token: " + e.getMessage());
	            }
	        } else {
	            System.out.println("JWT Filter: No valid Bearer header found for " + request.getRequestURI());
	        }


	        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

	            UserDetails userDetails = userService.loadUserByUsername(email);

	            if (jwtProvider.validateToken(token, userDetails)) {
	                System.out.println("JWT Filter: Token validated for " + email);
	                UsernamePasswordAuthenticationToken auth =
	                        new UsernamePasswordAuthenticationToken(
	                                userDetails,
	                                null,
	                                userDetails.getAuthorities()
	                        );

	                SecurityContextHolder.getContext().setAuthentication(auth);
	            } else {
	                System.out.println("JWT Filter: Token validation FAILED for " + email);
	            }
	        }

	        filterChain.doFilter(request, response);
	    }
		
	}


