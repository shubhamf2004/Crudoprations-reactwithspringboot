package com.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Employee {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String name;
	private String email;
	private String phone;
	private String department;
	private String designation;
	private Double salary;
	private java.time.LocalDate joiningDate;
	private String status; // ACTIVE, INACTIVE
	
	// Professional Attributes (TeamHub Style)
	private String employeeId; // Custom ID like EMP-0289
	private String employmentType; // Full-Time, Part-Time, Contract
	private String workModel; // Remote, Hybrid, Office
	
	// Social Links
	private String linkedin;
	private String twitter;
	private String instagram;

	// Payroll Detail Components
	private Double transportationAllowance;
	private Double mealAllowance;
	private Double internetAllowance;
	private Double healthInsurance;
	private Double lifeInsurance;
	private Double trainingProgram;
	private Double fitnessMembership;

	// Extended Info
	private String gender;
	private java.time.LocalDate dob;
	private String address;
	private String city;
	private String experience;

	public Employee() {}

	// Getters and Setters
	public long getId() { return id; }
	public void setId(long id) { this.id = id; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
	public String getPhone() { return phone; }
	public void setPhone(String phone) { this.phone = phone; }
	public String getDepartment() { return department; }
	public void setDepartment(String department) { this.department = department; }
	public String getDesignation() { return designation; }
	public void setDesignation(String designation) { this.designation = designation; }
	public Double getSalary() { return salary; }
	public void setSalary(Double salary) { this.salary = salary; }
	public java.time.LocalDate getJoiningDate() { return joiningDate; }
	public void setJoiningDate(java.time.LocalDate joiningDate) { this.joiningDate = joiningDate; }
	public String getStatus() { return status; }
	public void setStatus(String status) { this.status = status; }
	public String getEmployeeId() { return employeeId; }
	public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
	public String getEmploymentType() { return employmentType; }
	public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
	public String getWorkModel() { return workModel; }
	public void setWorkModel(String workModel) { this.workModel = workModel; }
	public String getLinkedin() { return linkedin; }
	public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
	public String getTwitter() { return twitter; }
	public void setTwitter(String twitter) { this.twitter = twitter; }
	public String getInstagram() { return instagram; }
	public void setInstagram(String instagram) { this.instagram = instagram; }
	public Double getTransportationAllowance() { return transportationAllowance; }
	public void setTransportationAllowance(Double transportationAllowance) { this.transportationAllowance = transportationAllowance; }
	public Double getMealAllowance() { return mealAllowance; }
	public void setMealAllowance(Double mealAllowance) { this.mealAllowance = mealAllowance; }
	public Double getInternetAllowance() { return internetAllowance; }
	public void setInternetAllowance(Double internetAllowance) { this.internetAllowance = internetAllowance; }
	public Double getHealthInsurance() { return healthInsurance; }
	public void setHealthInsurance(Double healthInsurance) { this.healthInsurance = healthInsurance; }
	public Double getLifeInsurance() { return lifeInsurance; }
	public void setLifeInsurance(Double lifeInsurance) { this.lifeInsurance = lifeInsurance; }
	public Double getTrainingProgram() { return trainingProgram; }
	public void setTrainingProgram(Double trainingProgram) { this.trainingProgram = trainingProgram; }
	public Double getFitnessMembership() { return fitnessMembership; }
	public void setFitnessMembership(Double fitnessMembership) { this.fitnessMembership = fitnessMembership; }
	public String getGender() { return gender; }
	public void setGender(String gender) { this.gender = gender; }
	public java.time.LocalDate getDob() { return dob; }
	public void setDob(java.time.LocalDate dob) { this.dob = dob; }
	public String getAddress() { return address; }
	public void setAddress(String address) { this.address = address; }
	public String getCity() { return city; }
	public void setCity(String city) { this.city = city; }
	public String getExperience() { return experience; }
	public void setExperience(String experience) { this.experience = experience; }
}
