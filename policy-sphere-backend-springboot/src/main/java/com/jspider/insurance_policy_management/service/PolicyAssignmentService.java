package com.jspider.insurance_policy_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jspider.insurance_policy_management.entity.PolicyAssignment;
import com.jspider.insurance_policy_management.repository.PolicyAssignmentRepository;

@Service
public class PolicyAssignmentService {

	@Autowired
	private PolicyAssignmentRepository assignmentRepository;

	public PolicyAssignment getPolicyAssignmentByIdService(Long assignmentId) {

		return assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new RuntimeException("Assignment not found"));
	}

}
