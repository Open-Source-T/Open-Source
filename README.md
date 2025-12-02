# AI Health Care
본 프로젝트는 인공지능 기반 사용자 맞춤 건강 관리 서비스를 개발하는 프로젝트입니다. 사용자가 음식 사진을 업로드하면, 인공지능이 이를 분석하여 칼로리와 영양성분 정보를 제공하고, 사용자 맞춤 건강 코칭을 제공합니다.

## Feature
- 회원 가입, 로그인, 로그아웃 기능을 제공합니다.
- 사용자 정보 저장 기능을 제공합니다.
- 사용자가 음식 사진을 업로드하면 칼로리와 영양성분 정보를 시각화 하여 제공합니다.
- 사용자 정보, 칼로리와 영양성분 정보 기반 건강 코칭을 제공합니다.
- 분석 결과와 사용자 맞춤 건강 코칭을 저장하고 조회하는 기능을 제공합니다.

## Project Structure
```
Open-Source/
├── README.md
├── 01_LICENSE
├── 02_Document                # 제안서, 보고서, 발표자료
│   ├── Team Project AI Health Care 제안서.pdf
│   ├── Team Project AI Health Care 보고서.pdf
│   ├── Team Project AI Health Care 개인 보고서 (유준혁).pdf
│   ├── Team Project AI Health Care 개인 보고서 (김화완).pdf
│   ├── Team Project AI Health Care 개인 보고서 (박경빈).pdf
│   ├── Team Project AI Health Care 개인 보고서 (정승일).pdf
│   └── Team Project AI Health Care 발표자료.pdf
├── 03_ai_model/               # 인공지능 모델 관련 디렉토리
│   ├── 00_dataset/            # 데이터셋
│   ├── 01_model_train_code/   # 모델 학습 코드
│   └── 02_model/              # 학습 완료 모델 (YOLO 가중치 등)
├── 04_frontend/               # 프론트엔드 (React SPA)
│   └── react-app/             # React(TypeScript) 애플리케이션
│       ├── package.json
│       ├── vite.config.ts
│       └── src/
│           ├── App.tsx        # 메인 레이아웃 및 라우팅
│           ├── api.ts         # 백엔드 연동 API 래퍼
│           └── pages/         # 로그인/회원가입/업로드/기록 페이지
└── 05_backend/
    └── project/               # Django 백엔드 프로젝트 루트
        ├── manage.py
        ├── requirements.txt   # 백엔드 Python 의존성
        ├── project/
        │   ├── settings.py
        │   ├── urls.py
        │   ├── asgi.py
        │   └── wsgi.py
        └── ai_health_care/
            ├── models.py
            ├── views.py
            ├── services/      # Gemini API 클라이언트 등
            ├── admin.py
            ├── apps.py
            ├── tests.py
            └── migrations/
```

## Installation
### 1. 레포지토리 클론
```bash
gh repo clone Open-Source-T/Open-Source
cd Open-Source
```

### 2. 백엔드(Django) 의존성 설치
```bash
cd 05_backend/project

# (최초 1회) 가상환경 생성
python -m venv .venv

# 가상환경 활성화
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Python 의존성 설치
pip install -r requirements.txt
```

### 3. Gemini API 키 설정(.env)
`05_backend/project/.env` 파일을 생성하고 아래 형식으로 API 키를 설정합니다.

```bash
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 4. 데이터베이스 마이그레이션 및 서버 실행
```bash
cd 05_backend/project
source .venv/bin/activate
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 5. 프론트엔드(React) 의존성 설치 및 실행
새 터미널에서 다음을 실행합니다.

```bash
cd 04_frontend/react-app
npm install
npm run dev
```

Vite 개발 서버 주소(예: `http://localhost:5173`)로 접속하면 React 기반 UI를 통해 Django 백엔드 API(`/api/...`)와 연동된 서비스를 사용할 수 있습니다.

## Usage
1. 회원 가입을 하고 로그인합니다.
2. 음식 사진을 업로드합니다.
3. 음식의 칼로리와 영양성분 정보, 맞춤 건강 코칭을 확인, 저장, 조회합니다.

## Test
제안서의 요구사항 명세의 비기능적 요구사항의 각 항목을 테스트하였습니다.
- 서버의 응답 속도와 확장성을 테스트하였습니다.
- 데이터 보호와 접근 제어를 테스트하였습니다.
- 인공지능 모델의 정확성과 서비스의 안정성을 테스트하였습니다.
- UI/UX와 분석 결과의 시각화가 정상적으로 동작하는지 테스트하였습니다.

## Contributing
1. Create a new branch.
	```
	git checkout -b your_branch
	```

2. Commit your changes.
	```
	git add .
	git commit -m "Commit message"
	```

3. Push to the branch.
	```
	git push origin your_branch
	```

4. Open a pull request.

## License
This project is licensed under the MIT License.

## Authors ${\textsf{\color{#ff0000}// Email을 수정해주세요}}$
- Yoo, J. H. ([Yoo, J. H.](https://github.com/YooJunHyuk123))
Email: a01091040305@gmail.com
- Kim, H. W. ([Kim, H. W.](https://github.com/flecy0904))
Email: khw09040@dankook.ac.kr
- Park, K. B. ([Park, K. B.](https://github.com/BiNdellx))
Email: @gmail.com
- Jung, S. I. ([Jung, S. I.](https://github.com/DNUBI))
Email: @gmail.com
