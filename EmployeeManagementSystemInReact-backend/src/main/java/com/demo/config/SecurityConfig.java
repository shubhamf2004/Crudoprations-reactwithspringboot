package com.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

	 @Autowired
	private JwtAuthenticationEntryPoint entryPoint;
	 
	 @Autowired
	 private JwtAuthenticationFilter jwtFilter;
	 
	 @Bean
	  public PasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }
	 
	  @Bean
	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		  http
		  	.cors(Customizer.withDefaults()) 
	        .csrf(csrf -> csrf.disable())
	        .authorizeHttpRequests(auth -> auth
	        	.requestMatchers("/api/auth/**").permitAll()
	        	.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
	        	
	        	// Admin & HR: POST, DELETE, PATCH
	        	.requestMatchers(HttpMethod.POST, "/api/employee", "/api/employee/**").hasAnyRole("ADMIN", "HR")
	        	.requestMatchers(HttpMethod.DELETE, "/api/employee/**").hasAnyRole("ADMIN", "HR")
	        	.requestMatchers(HttpMethod.PATCH, "/api/employee/**").hasAnyRole("ADMIN", "HR")
	        	
	        	// Admin, HR & User: GET
	        	.requestMatchers(HttpMethod.GET, "/api/getEmployee", "/api/getEmployee/**", "/api/employee/**").hasAnyRole("ADMIN", "HR", "USER")
	        	
	        	.anyRequest().authenticated()
	        )
	        .exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint))
	        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

	        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

	        return http.build();
	    }

	  @Bean
	  public CorsConfigurationSource corsConfigurationSource() {
	      CorsConfiguration configuration = new CorsConfiguration();
	      configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"));
	      configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
	      configuration.setAllowedHeaders(List.of("*"));
	      configuration.setExposedHeaders(List.of("Authorization"));
	      configuration.setAllowCredentials(true);
	      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	      source.registerCorsConfiguration("/**", configuration);
	      return source;
	  }
}
