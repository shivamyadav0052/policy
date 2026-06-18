package com.jspider.insurance_policy_management.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.jspider.insurance_policy_management.dto.PolicyRequest;
import com.jspider.insurance_policy_management.entity.Policy;
import com.jspider.insurance_policy_management.entity.User;
import com.jspider.insurance_policy_management.repository.UserRepository;
import com.jspider.insurance_policy_management.service.PolicyService;

@RestController
@RequestMapping("/policy")
public class PolicyController {

    private final PolicyService policyService;
    private final UserRepository userRepository;

    public PolicyController(PolicyService policyService, UserRepository userRepository) {
        this.policyService = policyService;
        this.userRepository = userRepository;
    }

    // ✅ CREATE POLICY
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/create")
    public Policy createPolicyController(@RequestBody PolicyRequest request, Authentication authentication) {

        System.out.println("Received PolicyRequest: " + request);

        // Get logged-in user
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not logged in"));

        // Convert DTO -> Entity
        Policy policy = new Policy();
        policy.setPolicyName(request.getPolicyName());
        policy.setPremiumAmount(request.getPremiumAmount());
        policy.setDescription(request.getDescription());
        policy.setCoverageType(request.getCoverageType());
        policy.setDuration(request.getDuration());   // ✅ Integer
        policy.setTenure(request.getDuration());     // ✅ direct set (no parsing)
        policy.setTerms(request.getTerms());
        policy.setCreatedBy(user);

        return policyService.createPolicy(policy);
    }

    // ✅ GET ALL POLICIES (ADMIN)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/admin/policies")
    public List<Policy> getAllPoliciesForAdmin() {
        return policyService.getAllPolicies();
    }

    // ✅ UPDATE POLICY
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/admin/policies/{id}")
    public Policy updatePolicy(@PathVariable Long id,
                               @RequestBody PolicyRequest request,
                               Authentication authentication) {

        // Get logged-in admin
        String email = authentication.getName();
        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not logged in"));

        // Fetch existing policy (better approach)
        Policy existingPolicy = policyService.getPolicyById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        // Update fields
        existingPolicy.setPolicyName(request.getPolicyName());
        existingPolicy.setPremiumAmount(request.getPremiumAmount());
        existingPolicy.setDescription(request.getDescription());
        existingPolicy.setCoverageType(request.getCoverageType());
        existingPolicy.setDuration(request.getDuration());
        existingPolicy.setTenure(request.getDuration()); // ✅ no parsing
        existingPolicy.setTerms(request.getTerms());

        return policyService.createPolicy(existingPolicy);
    }

    // ✅ DELETE POLICY
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/admin/policies/{id}")
    public String deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return "Policy deleted successfully";
    }
}