# models.py

from django.db import models
# 보안을 위해서 abstract user를 사용
from django.contrib.auth.models import AbstractUser

# 사용자 정보 (나이, 성별, 신장, 체중)과 사용자 맞춤 건강 코칭을 저장하는 데이터베이스
class UserInfo(AbstractUser):
    age = models.IntegerField(blank = True, null = True)
    sex = models.CharField(choices = (('M', 'Male'), ('F', 'Female')), max_length = 1, blank = True, null = True)
    height = models.PositiveIntegerField(blank = True, null = True)
    weight = models.PositiveIntegerField(blank = True, null = True)
    description = models.TextField(blank = True, null = True)

    def __str__(self):
        return self.username