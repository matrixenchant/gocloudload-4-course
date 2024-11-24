from celery import shared_task
from .models import UserProfile

@shared_task
def update_user_profile(user_id, new_data):
    profile = UserProfile.objects.get(id=user_id)
    profile.update(new_data)
    profile.save()