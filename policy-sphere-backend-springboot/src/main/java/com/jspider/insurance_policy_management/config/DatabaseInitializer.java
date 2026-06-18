package com.jspider.insurance_policy_management.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.jspider.insurance_policy_management.entity.*;
import com.jspider.insurance_policy_management.repository.*;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(UserRepository userRepository, 
                               PolicyRepository policyRepository, 
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.policyRepository = policyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Ensure a default admin user exists
        User admin = userRepository.findByEmail("admin@gmail.com").orElse(null);
        if (admin == null) {
            admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin = userRepository.save(admin);
            System.out.println("Initialized default admin user: admin@gmail.com / admin123");
        }

        // 2. Ensure default policies exist
        if (policyRepository.count() == 0) {
            Policy healthPolicy = new Policy();
            healthPolicy.setPolicyName("Gold Health Shield");
            healthPolicy.setPremiumAmount(5000.0);
            healthPolicy.setTenure(12);
            healthPolicy.setDuration(12);
            healthPolicy.setDescription("Comprehensive health insurance covering hospitalization and medical expenses.");
            healthPolicy.setCoverageType("HEALTH");
            healthPolicy.setTerms("Covers up to ₹5,00,000 per annum. Standard exclusions apply.");
            healthPolicy.setCreatedBy(admin);
            policyRepository.save(healthPolicy);

            Policy lifePolicy = new Policy();
            lifePolicy.setPolicyName("Term Life Secure");
            lifePolicy.setPremiumAmount(3000.0);
            lifePolicy.setTenure(24);
            lifePolicy.setDuration(24);
            lifePolicy.setDescription("Life insurance policy offering high coverage term assurance.");
            lifePolicy.setCoverageType("LIFE");
            lifePolicy.setTerms("Sum assured ₹50,000,000 on natural or accidental death.");
            lifePolicy.setCreatedBy(admin);
            policyRepository.save(lifePolicy);

            Policy vehiclePolicy = new Policy();
            vehiclePolicy.setPolicyName("Comprehensive Auto Guard");
            vehiclePolicy.setPremiumAmount(4000.0);
            vehiclePolicy.setTenure(12);
            vehiclePolicy.setDuration(12);
            vehiclePolicy.setDescription("Full coverage motor vehicle insurance against damage, theft, and third-party liability.");
            vehiclePolicy.setCoverageType("MOTOR");
            vehiclePolicy.setTerms("Includes zero depreciation and roadside assistance cover.");
            vehiclePolicy.setCreatedBy(admin);
            policyRepository.save(vehiclePolicy);

            System.out.println("Initialized default insurance policies in database.");
        }
    }
}
