from django.db import models
from django.conf import settings
from django.utils import timezone

class Company(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
class UserProfile(models.Model):
    role_choice = (
        ('CEO','CEO'),
        ('MANAGER','Manager'),
        ('TL','Team lead'),
        ('EMP','Employee',)
    )
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='profile')

    company = models.ForeignKey(Company,on_delete=models.CASCADE,related_name='users')

    role = models.CharField(max_length=20,choices=role_choice)

    manager = models.ForeignKey('self',null=True,blank=True,
                                on_delete=models.SET_NULL,related_name='juniors')
    
    def __str__(self):
        return f"{self.user.username} {self.role}"
    
    def is_top(self,others: "UserProfile"):
        curr = others.manager
        while curr is not None:
            if curr.pk == self.pk:
                return True
            curr = curr.manager
        return False
    def is_bott(self,others:"UserProfile"):
        return others.is_top(self)
    def all_junior(self):
        ids = []
        stack = list(self.juniors.all())
        while stack:
            node = stack.pop()
            ids.append(node.pk)
            stack.extend(list(node.juniors.all()))
        from .models import UserProfile
        return UserProfile.objects.filter(pk__in=ids)
    
    def can_assign_to(self,target:"UserProfile"):
        if self.company_id != target.company_id:
            return False
        if self.pk == target.pk:
            return False
        if target.is_top(self):
            return False
        if not target.is_bott(self):
            return False
        return True


class Task(models.Model):
    status_choice = (
        ('PENDING','Pending'),
        ('IN_PROGRESS','In Progress'),
        ('COMPLETED','completed'),
        ('CANCELLED','Cancelled')
    )  
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    assigned_to = models.ForeignKey(
        UserProfile,on_delete=models.CASCADE,related_name='task_received'
    )
    assigned_by = models.ForeignKey(UserProfile,on_delete=models.CASCADE,related_name='task_assigned')
    status = models.CharField(max_length=20,choices=status_choice, default='PENDING')
    deadline = models.DateTimeField()
    completed_at = models.DateTimeField(null=True,blank=True)
    created = models.DateTimeField(auto_now=True)

    def mark_completed(self):
        self.status = 'COMPLETED'
        self.completed_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.title} ({self.status})"
