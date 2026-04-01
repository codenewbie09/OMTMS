package com.omtms.dto;

public class ReportDTO {
    private String reportType;
    private Object data;
    private String generatedAt;

    public ReportDTO() {}

    public ReportDTO(String reportType, Object data) {
        this.reportType = reportType;
        this.data = data;
        this.generatedAt = java.time.LocalDateTime.now().toString();
    }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
    public String getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(String generatedAt) { this.generatedAt = generatedAt; }
}
