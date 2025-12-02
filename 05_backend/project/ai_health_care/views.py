# views.py

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pathlib import Path
from ultralytics import YOLO
from .services.gemini_client import GeminiClientError, generate_coaching_text
from .models import UserInfo

# 음식 사진 분석 모델 불러오기
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
MODEL_PATH = BASE_DIR / '03_ai_model/02_model/best.pt'
YOLO_MODEL = YOLO(MODEL_PATH)


# ---------- API (JSON) ----------

def _json_response(success=True, data=None, error=None, status=200):
    payload = {'success': success}
    if data is not None:
        payload['data'] = data
    if error is not None:
        payload['error'] = error
    return JsonResponse(payload, status=status)


@csrf_exempt
def api_sign_up(request):
    if request.method != 'POST':
        return _json_response(False, error='POST로 요청하세요.', status=405)

    username = request.POST.get('username')
    password1 = request.POST.get('password1')
    password2 = request.POST.get('password2')
    age = request.POST.get('age')
    sex = request.POST.get('sex')
    height = request.POST.get('height')
    weight = request.POST.get('weight')

    if not username or not password1 or not password2:
        return _json_response(False, error='아이디와 비밀번호를 입력해야 합니다.', status=400)
    if UserInfo.objects.filter(username=username).exists():
        return _json_response(False, error='이미 존재하는 아이디입니다.', status=400)
    if password1 != password2:
        return _json_response(False, error='비밀번호가 일치하지 않습니다.', status=400)
    if not age or not sex or not height or not weight:
        return _json_response(False, error='나이, 성별, 신장, 체중을 입력해야 합니다.', status=400)

    try:
        user = UserInfo.objects.create_user(
            username=username,
            password=password1,
            age=int(age),
            sex=sex,
            height=int(height),
            weight=int(weight),
            description='',
        )
    except ValueError:
        return _json_response(False, error='나이, 신장, 체중은 숫자여야 합니다.', status=400)
    user.save()
    return _json_response(True, data={'username': user.username})


@csrf_exempt
def api_login(request):
    if request.method != 'POST':
        return _json_response(False, error='POST로 요청하세요.', status=405)

    username = request.POST.get('username')
    password = request.POST.get('password')
    user = authenticate(request, username=username, password=password)

    if user is None:
        return _json_response(False, error='아이디 또는 비밀번호가 일치하지 않습니다.', status=401)

    login(request, user)
    return _json_response(True, data={'username': user.username})


@csrf_exempt
def api_logout(request):
    if request.method != 'POST':
        return _json_response(False, error='POST로 요청하세요.', status=405)

    logout(request)
    return _json_response(True, data={'message': '로그아웃 되었습니다.'})


@csrf_exempt
def api_upload(request):
    if not request.user.is_authenticated:
        return _json_response(False, error='로그인이 필요합니다.', status=401)

    if request.method != 'POST' or not request.FILES.get('food_image'):
        return _json_response(False, error='food_image 파일을 포함한 POST 요청이 필요합니다.', status=400)

    image = request.FILES['food_image']
    fs = FileSystemStorage()
    file_path = fs.save(image.name, image)
    file_url = fs.path(file_path)

    result = YOLO_MODEL(file_url)
    if result:
        df_polars = result[0].to_df()
        foods = df_polars['name'].to_list() if len(df_polars) > 0 else []
        food = foods[0] if foods else ''
    else:
        foods = []
        food = None

    fs.delete(file_path)

    user = request.user

    try:
        coaching = generate_coaching_text(user.age, user.sex, user.height, user.weight, food)
    except GeminiClientError as exc:
        return _json_response(False, error=f'AI 분석 중 문제가 발생했습니다: {exc}', status=500)

    user.description = coaching
    user.save()

    return _json_response(True, data={'food': food, 'foods': foods, 'coaching': coaching})


@csrf_exempt
def api_record(request):
    if not request.user.is_authenticated:
        return _json_response(False, error='로그인이 필요합니다.', status=401)

    if request.method != 'GET':
        return _json_response(False, error='GET으로 요청하세요.', status=405)

    user = request.user
    return _json_response(True, data={'description': user.description or ''})
