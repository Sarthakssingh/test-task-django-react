from django.db.models import F, Q
from .models import Task, UserProfile


def user_performance(user_profile: UserProfile) -> dict:
    qs = Task.objects.filter(assigned_to=user_profile)

    total = qs.count()
    on_time = qs.filter(
        status="COMPLETED",
        completed_at__isnull=False,
        completed_at__lte=F("created"),
    ).count()

    pct_on_time = (on_time * 100 / total) if total > 0 else 0

    return {
        "user_id": user_profile.id,
        "username": user_profile.user.username,
        "total_tasks": total,
        "completed_on_time": on_time,
        "percent_completed_on_time": pct_on_time,
    }

def tree_performance(top_profile: UserProfile) -> dict:

    juniors_qs = top_profile.all_junior()
    users_qs = juniors_qs | UserProfile.objects.filter(pk=top_profile.pk)

    qs = Task.objects.filter(assigned_to__in=users_qs)

    total = qs.count()
    on_time = qs.filter(
        status="COMPLETED",
        completed_at__isnull=False,
        completed_at__lte=F("created"),
    ).count()

    pct_on_time = (on_time * 100 / total) if total > 0 else 0

    return {
        "top_user_id": top_profile.id,
        "top_username": top_profile.user.username,
        "total_tasks": total,
        "completed_on_time": on_time,
        "percent_completed_on_time": pct_on_time,
    }
