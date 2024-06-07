package com.jeremy.emplmgtsystembackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.jeremy.emplmgtsystembackend.entity.OurUsers;
import com.jeremy.emplmgtsystembackend.repository.UsersRepo;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserEmailService {

    @Autowired
    private UsersRepo userRepo;

    @Autowired
    private SendGridEmailService emailService;

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    public List<String> sendEmailToAllUsers(String subject, String body) {
        List<OurUsers> users = userRepo.findAll();
        Email from = new Email("jimadeguetta@gmail.com");
        Content content = new Content("text/plain", body);

        List<String> unsentEmails = new ArrayList<>();
        
        for (OurUsers user : users) {
            Email to = new Email(user.getEmail());
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            try {
                request.setMethod(Method.POST);
                request.setEndpoint("mail/send");
                request.setBody(mail.build());
                Response response = sg.api(request);
                if (response.getStatusCode() != 202) {
                    unsentEmails.add(user.getEmail());
                }
            } catch (IOException ex) {
                unsentEmails.add(user.getEmail());
                System.out.println("Error sending email to " + user.getEmail() + ": " + ex.getMessage());
            }
        }
        return unsentEmails;
    }
}
