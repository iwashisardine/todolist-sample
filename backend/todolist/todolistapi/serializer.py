from rest_framework import serializers

from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task # Taskモデルを指定
        fields = ('id', 'title', 'is_completed') # JSONで返却する項目を指定
