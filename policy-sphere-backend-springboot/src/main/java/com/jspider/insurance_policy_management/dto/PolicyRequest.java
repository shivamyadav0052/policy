package com.jspider.insurance_policy_management.dto;

public class PolicyRequest {

    private String policyName;
    private Double premiumAmount;
    private Integer duration;   // ✅ only one field (months)
    private String description;
    private String coverageType;
    private String terms;

    public PolicyRequest() {
    }

    public String getPolicyName() {
        return policyName;
    }

    public void setPolicyName(String policyName) {
        this.policyName = policyName;
    }

    public Double getPremiumAmount() {
        return premiumAmount;
    }

    public void setPremiumAmount(Double premiumAmount) {
        this.premiumAmount = premiumAmount;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCoverageType() {
        return coverageType;
    }

    public void setCoverageType(String coverageType) {
        this.coverageType = coverageType;
    }

    public String getTerms() {
        return terms;
    }

    public void setTerms(String terms) {
        this.terms = terms;
    }

    @Override
    public String toString() {
        return "PolicyRequest [policyName=" + policyName +
                ", premiumAmount=" + premiumAmount +
                ", duration=" + duration +
                ", description=" + description +
                ", coverageType=" + coverageType +
                ", terms=" + terms + "]";
    }
}