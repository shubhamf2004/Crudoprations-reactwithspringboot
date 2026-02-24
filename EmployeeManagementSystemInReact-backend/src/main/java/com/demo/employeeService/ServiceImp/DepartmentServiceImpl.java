package com.demo.employeeService.ServiceImp;

import com.demo.employeeRepository.DepartmentRepository;
import com.demo.employeeService.DepartmentService;
import com.demo.entity.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepo;

    @Override
    public Department createDepartment(Department department) {
        return departmentRepo.save(department);
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepo.findAll();
    }

    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepo.findById(id).orElse(null);
    }

    @Override
    public Department updateDepartment(Long id, Department department) {
        Department existing = departmentRepo.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(department.getName());
            existing.setDescription(department.getDescription());
            return departmentRepo.save(existing);
        }
        return null;
    }

    @Override
    public void deleteDepartment(Long id) {
        departmentRepo.deleteById(id);
    }
}
