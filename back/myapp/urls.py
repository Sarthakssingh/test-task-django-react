from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet , my_juniors, my_performance, my_tree_performance,login_view,logout_view,register_view,tasks_view
from . import views

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path('my-juniors/', my_juniors),
    path('performance/', my_performance),
    path('tree-performance/', my_tree_performance),
    path('login/', login_view),
    path('logout/', logout_view),
    path('register/', register_view),
    # path('tasks/', tasks_view),
    path('tasks/', views.tasks_view, name='task-create'),
]

