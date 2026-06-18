package com.jspider.insurance_policy_management.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jspider.insurance_policy_management.entity.Claim;
import com.jspider.insurance_policy_management.entity.PolicyAssignment;
import com.jspider.insurance_policy_management.entity.User;
import com.jspider.insurance_policy_management.repository.ClaimRepository;
import com.jspider.insurance_policy_management.repository.UserRepository;
import com.jspider.insurance_policy_management.service.ClaimService;
import com.jspider.insurance_policy_management.service.PolicyAssignmentService;

@RestController
@RequestMapping("/claim")
@CrossOrigin(origins = "http://localhost:3000")
public class ClaimController {

	private final ClaimService claimService;
	private final UserRepository userRepository;
	private final ClaimRepository claimRepository;
	private final PolicyAssignmentService assignmentService;

	public ClaimController(ClaimService claimService, UserRepository userRepository, ClaimRepository claimRepository,
			PolicyAssignmentService assignmentService) {
		super();
		this.claimService = claimService;
		this.userRepository = userRepository;
		this.claimRepository = claimRepository;
		this.assignmentService = assignmentService;
	}

	// Get customer's claims
	@PreAuthorize("hasRole('CUSTOMER')")
	@GetMapping("/my-claims")
	public List<Claim> getCustomerClaims(Authentication authentication) {
		String email = authentication.getName();
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		return claimService.getCustomerClaims(user);
	}

	// Get pending claims for agent
	@PreAuthorize("hasRole('AGENT')")
	@GetMapping("/pending")
	public List<Claim> getPendingClaims(Authentication authentication) {
		String email = authentication.getName();
		User agent = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Agent not found"));
		return claimService.getPendingClaimsForAgent(agent.getId());
	}

	// Approve a claim (agent)
	@PreAuthorize("hasRole('AGENT')")
	@PostMapping("/approve/{claimId}")
	public Claim approveClaim(@PathVariable Long claimId, Authentication authentication) {
		String email = authentication.getName();
		User agent = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Agent not found"));
		return claimService.approveClaim(claimId, agent);
	}

	// Reject a claim (agent)
	@PreAuthorize("hasRole('AGENT')")
	@PostMapping("/reject/{claimId}")
	public Claim rejectClaim(@PathVariable Long claimId, Authentication authentication) {
		String email = authentication.getName();
		User agent = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Agent not found"));
		return claimService.rejectClaim(claimId, agent);
	}

	// Ask for more documents (agent)
	@PreAuthorize("hasRole('AGENT')")
	@PostMapping("/request-docs/{claimId}")
	public Claim requestMoreDocs(@PathVariable Long claimId, Authentication authentication) {
		String email = authentication.getName();
		User agent = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Agent not found"));
		return claimService.requestMoreDocs(claimId, agent);
	}

	@PreAuthorize("hasRole('CUSTOMER')")
	@PostMapping(value = "/submit", consumes = "multipart/form-data")
	public ResponseEntity<?> submitClaim(@RequestParam Long assignmentId, @RequestParam String bankAccountNumber,
			@RequestParam String bankIfscCode, @RequestParam String bankAccountHolder,
			@RequestParam("files") List<MultipartFile> files, Authentication authentication) {

		try {
			
			Claim existingClaim = claimRepository.findByPolicyAssignmentId(assignmentId).orElse(null);

			if (existingClaim != null && !"REJECTED".equals(existingClaim.getStatus())) {
			    return ResponseEntity.badRequest().body("Claim already exists");
			}

			String email = authentication.getName();

			User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

			PolicyAssignment assignment = assignmentService.getPolicyAssignmentByIdService(assignmentId);

			List<String> fileNames = new ArrayList<>();

			String uploadDir = System.getProperty("user.dir") + "/uploads/";
			File dir = new File(uploadDir);
			if (!dir.exists())
				dir.mkdirs();

			for (MultipartFile file : files) {
				if (file.isEmpty())
					continue;

				String cleanName = file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

				String fileName = System.currentTimeMillis() + "_" + java.util.UUID.randomUUID() + "_" + cleanName;

				file.transferTo(new File(uploadDir + fileName));

				fileNames.add(fileName);
			}

			Claim claim = new Claim();
			claim.setPolicyAssignment(assignment);
			claim.setCustomer(user); // ✅🔥 THIS FIX
			claim.setBankAccountNumber(bankAccountNumber);
			claim.setBankIfscCode(bankIfscCode);
			claim.setBankAccountHolder(bankAccountHolder);
			claim.setDocumentPath(String.join(",", fileNames));
			claim.setStatus("PENDING");

			claimRepository.save(claim);

			return ResponseEntity.ok(claim);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error uploading files");
		}
	}
	/*
	 * @GetMapping("/files/{filename}") public ResponseEntity<Resource>
	 * getFile(@PathVariable String filename) throws IOException {
	 * 
	 * Path filePath = Paths.get("uploads").resolve(filename).normalize(); Resource
	 * resource = new UrlResource(filePath.toUri());
	 * 
	 * if (!resource.exists()) { return ResponseEntity.notFound().build(); }
	 * 
	 * return ResponseEntity.ok() .header(HttpHeaders.CONTENT_DISPOSITION,
	 * "inline; filename=\"" + resource.getFilename() + "\"") .body(resource); }
	 */
}