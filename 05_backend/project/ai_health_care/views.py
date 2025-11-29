# views.py

from django.shortcuts import redirect, render
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.files.storage import FileSystemStorage
from .models import UserInfo

# 회원 가입
def sign_up(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        age = request.POST.get('age')
        sex = request.POST.get('sex')
        height = request.POST.get('height')
        weight = request.POST.get('weight')

        # 아이디 또는 비밀번호 입력이 없는 경우
        if not username or not password1 or not password2:
            messages.error(request, '아이디와 비밀번호를 입력해야 합니다.')
            return redirect('sign_up')
        
        # 아이디가 이미 존재하는 경우
        if UserInfo.objects.filter(username = username).exists():
            messages.error(request, '이미 존재하는 아이디입니다.')
            return redirect('sign_up')

        # 비밀번호가 잘못된 경우
        if password1 != password2:
            messages.error(request, '비밀번호가 일치하지 않습니다.')
            return redirect('sign_up')

        # 나이, 성별, 신장, 체중 입력이 없는 경우
        if not age or not sex or not height or not weight:
            messages.error(request, '나이, 성별, 신장, 체중을 입력해야 합니다.')
            return redirect('sign_up')
        
        # 사용자 계정 생성
        user = UserInfo.objects.create_user(
            username = username,
            password = password1,
            age = age,
            sex = sex,
            height = height,
            weight = weight,
            description = ''
        )

        user.save()
        messages.success(request, '회원 가입에 성공하였습니다.')
        return redirect('index')
    
    return render(request, 'sign_up.html')

# 로그인
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username = username, password = password)

        # 아이디 또는 비밀번호가 일치하지 않는 경우
        if user is None:
            messages.error(request, '아이디 또는 비밀번호가 일치하지 않습니다.')
            return redirect('index')
        else:
            login(request, user)
            return redirect('upload')
    
    return render(request, 'index.html')

# 로그아웃
def logout_view(request):
    logout(request)
    return redirect('index')

# 음식 사진 업로드와 분석
@login_required
def upload(request):
    if request.method == 'POST' and request.FILES.get('food_image'):
        # 용량을 고려하여 음식 사진은 분석할 때만 사용하고 저장하지는 않음
        image = request.FILES['food_image']
        fs = FileSystemStorage()
        file_path = fs.save(image.name, image)

        # TODO: 음식 사진 분석하기, 현재 임시 데이터 사용
        food = 'chicken'
        calories = 100
        carbohydrate = 100
        protein = 100
        fat = 100
        coaching = f'{food}은 {calories}kcal, {carbohydrate}탄수화물, {protein}단백질, {fat}지방입니다. 운동 좀 하세요.\n'

        # 사용자 맞춤 건강 코칭을 models.py의 description에 누적해서 저장
        user = request.user
        user.description += coaching
        user.save()
        
        return redirect('record')
    
    return render(request, 'upload.html')

# 기록 조회
@login_required
def record(request):
    # models.py의 description을 불러오기
    user = request.user
    description = {'description': user.description}

    return render(request, 'record.html', description)