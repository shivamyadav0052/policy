package com.jspider.insurance_policy_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jspider.insurance_policy_management.entity.Policy;
import com.jspider.insurance_policy_management.repository.PolicyRepository;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;

    public PolicyService(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    // ✅ CREATE / UPDATE (same method works for both)
    public Policy createPolicy(Policy policy) {
        return policyRepository.save(policy); // save is enough
    }

    // ✅ GET ALL
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    // ✅ GET BY ID (IMPORTANT for update)
    public Optional<Policy> getPolicyById(Long id) {
        return policyRepository.findById(id);
    }

    // ✅ DELETE
    public void deletePolicy(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new RuntimeException("Policy not found with id: " + id);
        }
        policyRepository.deleteById(id);
    }
}