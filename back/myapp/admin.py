from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Company,UserProfile, Task

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name']

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    extra = 0

class CustomUserAdmin(UserAdmin):
    inlines = [UserProfileInline]

admin.site.unregister(User)
admin.site.register(User,CustomUserAdmin)

@admin.register(UserProfile)
class UserprofileAdmin(admin.ModelAdmin):
    list_display = ['user','company','role','manager']
    list_filter = ['role','company']
    raw_id_fields = ['user','manager']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title','assigned_by','assigned_to','status']
    list_filter = ['status','assigned_by','assigned_to']


