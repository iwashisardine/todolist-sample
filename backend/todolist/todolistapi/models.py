from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200) # タスクの名前
    is_completed = models.BooleanField(default=False) # タスクが完了したか
