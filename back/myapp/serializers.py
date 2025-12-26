from rest_framework import serializers
from .models import Task, UserProfile


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all())

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'assigned_to',
                  'status', 'deadline_at', 'assigned_by']
        read_only_fields = ['id', 'assigned_by', 'status']
