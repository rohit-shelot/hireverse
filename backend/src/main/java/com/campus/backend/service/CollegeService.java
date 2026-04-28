package com.campus.backend.service;

import com.campus.backend.model.College;
import com.campus.backend.repository.CollegeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CollegeService {

    @Autowired
    private CollegeRepository collegeRepository;

    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    public College addCollege(College college) {
        if (college.getId() == null || college.getId().isEmpty()) {
            college.setId(UUID.randomUUID().toString());
        }
        return collegeRepository.save(college);
    }

    public void deleteCollege(String id) {
        collegeRepository.deleteById(id);
    }

    public College getCollegeById(String id) {
        return collegeRepository.findById(id).orElse(null);
    }
}
