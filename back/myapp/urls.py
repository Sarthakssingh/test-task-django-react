from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet , my_juniors, my_performance, my_tree_performance,login_view,logout_view,register_view

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path('my-juniors/', my_juniors),
    path('me/performance/', my_performance),
    path('me/tree-performance/', my_tree_performance),
    path('auth/login/', login_view),
    path('auth/logout/', logout_view),
    path('auth/register/', register_view),
]
