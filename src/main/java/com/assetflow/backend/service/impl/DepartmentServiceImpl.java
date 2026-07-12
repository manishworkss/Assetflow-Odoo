package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.DepartmentDto;
import com.assetflow.backend.entity.Department;
import com.assetflow.backend.entity.User;
import com.assetflow.backend.exception.ResourceNotFoundException;
import com.assetflow.backend.repository.DepartmentRepository;
import com.assetflow.backend.repository.UserRepository;
import com.assetflow.backend.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return mapToDto(department);
    }

    @Override
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = new Department();
        department.setName(departmentDto.getName());
        department.setDescription(departmentDto.getDescription());
        if (departmentDto.getHeadId() != null) {
            User head = userRepository.findById(departmentDto.getHeadId())
                    .orElse(null);
            department.setHead(head);
        }
        Department saved = departmentRepository.save(department);
        return mapToDto(saved);
    }

    @Override
    public DepartmentDto updateDepartment(Long id, DepartmentDto departmentDto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        department.setName(departmentDto.getName());
        department.setDescription(departmentDto.getDescription());
        if (departmentDto.getHeadId() != null) {
            User head = userRepository.findById(departmentDto.getHeadId())
                    .orElse(null);
            department.setHead(head);
        } else {
            department.setHead(null);
        }
        Department updated = departmentRepository.save(department);
        return mapToDto(updated);
    }

    @Override
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found with ID: " + id);
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentDto mapToDto(Department department) {
        return DepartmentDto.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .headId(department.getHead() != null ? department.getHead().getId() : null)
                .headName(department.getHead() != null ? department.getHead().getName() : null)
                .createdAt(department.getCreatedAt())
                .updatedAt(department.getUpdatedAt())
                .build();
    }
}
