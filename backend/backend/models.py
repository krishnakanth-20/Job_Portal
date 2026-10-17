from django.db import models
from django.contrib.auth.models import User

class Job(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    salary_range = models.CharField(max_length=50, blank=True)
    posted_date = models.DateTimeField(auto_now_add=True)
    created_at = models.ForeignKey(User, on_delete=models.CASCADE)
    
class Application(models.Model):
    status_choices = (
        ('applied', 'Applied'),
        ('interview', 'Interview'),
        ('offered', 'Offered'),
        ('rejected', 'Rejected'),)
        
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20,choices=status_choices, default='applied')
    application_date = models.DateTimeField(auto_now_add=True) 