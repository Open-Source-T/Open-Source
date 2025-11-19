from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.templating import _TemplateResponse
import uvicorn
import os

# 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_DIR = os.path.join(BASE_DIR, 'HTML')
CSS_DIR = os.path.join(BASE_DIR, 'CSS')

app = FastAPI()

# 1. HTML 템플릿을 위한 설정
# Jinja2Template이 './HTML' 폴더에서 HTML 파일을 찾습니다.
templates = Jinja2Templates(directory=HTML_DIR)

# 2. 정적 파일(CSS)을 위한 설정
# URL 경로 '/static'으로 접근하면 실제 파일은 './CSS' 폴더에서 찾습니다.
app.mount('/static', StaticFiles(directory=CSS_DIR), name='static')

# 3. 루트 URL ("/") 접속 시 로그인 페이지 HTML 렌더링
@app.get('/', response_class=_TemplateResponse)
async def login_page(request: Request):
    '''
    사용자가 접속했을 때 login.html 파일을 렌더링하고, 
    애플리케이션 이름을 context로 전달합니다.
    '''
    context = {'request': request, 'app_name': 'AI Health Care'}
    return templates.TemplateResponse('login.html', context)
