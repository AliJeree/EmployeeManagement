package com.jeremy.emplmgtsystembackend.dto;

import java.util.List;

public class EmailRequest {
    private String subject;
    private String body;
    private List<String> jobTitles;

    public EmailRequest() {}

    public EmailRequest(String subject, String body, List<String> jobTitles) {
        this.subject = subject;
        this.body = body;
        this.jobTitles = jobTitles;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public List<String> getJobTitles() {
        return jobTitles;
    }

    public void setJobTitles(List<String> jobTitles) {
        this.jobTitles = jobTitles;
    }
}