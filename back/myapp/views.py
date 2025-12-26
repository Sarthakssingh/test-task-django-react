from django.shortcuts import render
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated ,AllowAny
from .models import Task, UserProfile,Company
from .serializers import TaskSerializer
from .service import assign_task
from .stats import user_performance, tree_performance
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User



# Create your views here.

class TaskViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        assigned_by_profile = request.user.profile
        assigned_to_profile = serializer.validated_data['assigned_to']
        title = serializer.validated_data['title']
        description = serializer.validated_data.get('description', '')
        deadline = serializer.validated_data['deadline']

        task = assign_task(
            assigned_by=assigned_by_profile,
            assigned_to=assigned_to_profile,
            title=title,
            description=description,
            deadline=deadline,
        )

        out = TaskSerializer(task)
        return Response(out.data, status=status.HTTP_201_CREATED)
    

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def my_juniors(request):
    me = request.user.profile
    juniors = me.all_junior()
    data = [
        {"id": u.id, "username": u.user.username, "role": u.role}
        for u in juniors
    ]
    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_performance(request):
    profile = request.user.profile
    data = user_performance(profile)
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_tree_performance(request):
    profile = request.user.profile
    data = tree_performance(profile)
    return Response(data)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"detail": "Username and password required"}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response({"detail": "Invalid credentials"}, status=400)

    login(request, user)  # creates session cookie
    return Response({"detail": "Logged in", "username": user.username})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({"detail": "Logged out"})


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):

    data = request.data
    username = data.get("username")
    password = data.get("password")
    company_id = data.get("company_id")
    role = data.get("role")
    manager_id = data.get("manager_id")

    if not username or not password or not company_id or not role:
        return Response({"detail": "username, password, company_id, role required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"detail": "Username already taken"}, status=400)

    try:
        company = Company.objects.get(pk=company_id)
    except Company.DoesNotExist:
        return Response({"detail": "Invalid company_id"}, status=400)

    manager_profile = None
    if manager_id is not None:
        try:
            manager_profile = UserProfile.objects.get(pk=manager_id)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Invalid manager_id"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    profile = UserProfile.objects.create(
        user=user,
        company=company,
        role=role,
        manager=manager_profile,
    )

    return Response(
        {
            "detail": "User registered",
            "user_id": user.id,
            "profile_id": profile.id,
            "username": user.username,
        },
        status=201,
    )

