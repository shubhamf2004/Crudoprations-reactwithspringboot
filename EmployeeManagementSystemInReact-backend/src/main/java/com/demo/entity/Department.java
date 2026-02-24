package com.demo.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "departments")
public class Department {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true,nullable = false)
	private String name;
	
	private String description;
	
	 @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
	    @JsonIgnore   // Prevent infinite loop in JSON
	    private List<Employee> employees;


	 


	public Department(Long id, String name, String description) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
	}
	
	public Department() {
		
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	
	
	
	
}
