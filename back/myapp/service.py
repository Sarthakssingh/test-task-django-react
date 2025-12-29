from django.core.exceptions import PermissionDenied
from .models import Task,UserProfile

def assign_task(*,assigned_by:UserProfile,assigned_to:UserProfile,title:str,description:str,):
    if not assigned_by.can_assign_to(assigned_to):
        raise PermissionDenied
    return Task.objects.create(
        title=title,
        description = description,
        assigned_by=assigned_by,
        assigned_to = assigned_to,
    )
