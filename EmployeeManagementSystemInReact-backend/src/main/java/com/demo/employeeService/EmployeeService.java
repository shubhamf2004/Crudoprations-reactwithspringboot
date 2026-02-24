package com.demo.employeeService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.demo.employeeRepository.EmployeeRepository;
import com.demo.entity.Employee;
import jakarta.persistence.EntityNotFoundException;


@Service
public class EmployeeService {
	@Autowired
	private EmployeeRepository repo;

	@Autowired
	private com.demo.employeeRepository.UserRepository userRepo;

	public Employee postEmployee(Employee employee) {
		return repo.save(employee);	
	}
	
	public List<Employee> getAllEmployee(){
		 return repo.findAll();
	}
	
	public void deleteEmployee(Long id) {
		if(!repo.existsById(id)) {
			throw new EntityNotFoundException("Employee with ID"+id+"not foud");
		}
		repo.deleteById(id);
	}

	private Employee resolveEmployee(Long id) {
		// 1. Try finding by ID directly (works for existing Employee IDs)
		Employee emp = repo.findById(id).orElse(null);
		if (emp != null) return emp;

		// 2. Try as a User ID (for fresh logins/sidebar links)
		com.demo.entity.User user = userRepo.findById(id).orElse(null);
		if (user != null) {
			return repo.findByEmail(user.getEmail()).orElseGet(() -> {
				// Auto-create missing profile
				Employee newEmp = new Employee();
				newEmp.setName(user.getUsername());
				newEmp.setEmail(user.getEmail());
				newEmp.setStatus("ACTIVE");
				newEmp.setJoiningDate(java.time.LocalDate.now());
				newEmp.setDepartment("General");
				newEmp.setDesignation("Employee");
				return repo.save(newEmp);
			});
		}
		return null;
	}

	public Employee getEmployee(long id) {
		return resolveEmployee(id);
	}

  public Employee updateEmployee(Employee employee,Long id ) {
	Employee existingEmployee = resolveEmployee(id);
	 
	if(existingEmployee != null) {
		existingEmployee.setName(employee.getName());
		existingEmployee.setEmail(employee.getEmail());
		existingEmployee.setPhone(employee.getPhone());
		existingEmployee.setDepartment(employee.getDepartment());
		existingEmployee.setDesignation(employee.getDesignation());
		existingEmployee.setSalary(employee.getSalary());
		existingEmployee.setJoiningDate(employee.getJoiningDate());
		existingEmployee.setStatus(employee.getStatus());
		existingEmployee.setGender(employee.getGender());
		existingEmployee.setDob(employee.getDob());
		existingEmployee.setAddress(employee.getAddress());
		existingEmployee.setCity(employee.getCity());
		existingEmployee.setExperience(employee.getExperience());

		// New Professional Fields Mapping
		existingEmployee.setEmployeeId(employee.getEmployeeId());
		existingEmployee.setEmploymentType(employee.getEmploymentType());
		existingEmployee.setWorkModel(employee.getWorkModel());
		existingEmployee.setLinkedin(employee.getLinkedin());
		existingEmployee.setTwitter(employee.getTwitter());
		existingEmployee.setInstagram(employee.getInstagram());
		existingEmployee.setTransportationAllowance(employee.getTransportationAllowance());
		existingEmployee.setMealAllowance(employee.getMealAllowance());
		existingEmployee.setInternetAllowance(employee.getInternetAllowance());
		existingEmployee.setHealthInsurance(employee.getHealthInsurance());
		existingEmployee.setLifeInsurance(employee.getLifeInsurance());
		existingEmployee.setTrainingProgram(employee.getTrainingProgram());
		existingEmployee.setFitnessMembership(employee.getFitnessMembership());
		
		return repo.save(existingEmployee);
	}
	
		return null;
}
}
