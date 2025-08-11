package com.demo.employeeService;
import java.util.List;
import java.util.Optional;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.demo.employeeRepository.EmployeeRepository;
import com.demo.entity.Employee;
import jakarta.persistence.EntityNotFoundException;


@Service
public class EmployeeService {
	@Autowired
	EmployeeRepository repo;

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
	
	public Employee getEmployee(long id) {
		return repo.findById(id).orElse(null);
	}

  public Employee updateEmployee(Employee employee,Long id ) {
	
	Optional<Employee> optionlEmployee=repo.findById(id);
	 
	if(optionlEmployee.isPresent()) {
		Employee existingEmployee =optionlEmployee.get();
		existingEmployee.setId(employee.getId());
		existingEmployee.setName(employee.getName());
		existingEmployee.setEmail(employee.getEmail());
		existingEmployee.setPhone(employee.getPhone());
		existingEmployee.setDepartment(employee.getDepartment());
		
		return repo.save(existingEmployee);
	}
	
		return null;
}
}
