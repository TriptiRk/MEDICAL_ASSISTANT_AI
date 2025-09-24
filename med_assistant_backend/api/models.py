
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return f"{self.username} ({self.role})"
    
class UserHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="history")
    symptoms = models.TextField()
    predicted_disease = models.TextField()
    recommended_doctor= models.CharField(max_length=255, default="General Physician")
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.predicted_disease} ({self.created_at})"
    
class Feedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # link to user
    is_correct = models.BooleanField()  # Was the model prediction correct?
    comments = models.TextField(blank=True, null=True)  # Optional comments
    submitted_at = models.DateTimeField(auto_now_add=True)  # auto timestamp

    def __str__(self):
        return f"Feedback {self.feedback_id} by {self.user.username}"