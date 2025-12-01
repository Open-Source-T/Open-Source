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
├── 00_README.md
├── 01_LICENSE
├── 02_Document            # 이 디렉토리는 제안서와 보고서 디렉토리입니다.
│ ├── Team Project AI Health Care 제안서.pdf
│ ├── Team Project AI Health Care 보고서.pdf
│ ├── Team Project AI Health Care 개인 보고서 (유준혁).pdf
│ ├── Team Project AI Health Care 개인 보고서 (김화완).pdf
│ ├── Team Project AI Health Care 개인 보고서 (박경빈).pdf
│ ├── Team Project AI Health Care 개인 보고서 (정승일).pdf
│ └── Team Project AI Health Care 발표자료.pdf
├── 03_ai_model/           # 이 디렉토리는 인공지능 모델 관련 디렉토리입니다.
│ ├── 00_dataset/          # 이 디렉토리는 데이터셋 디렉토리입니다.
│ ├── 01_model_train_code/ # 이 디렉토리는 모델 학습 코드 디렉토리입니다.
│ └── 02_model/            # 이 디렉토리는 모델 디렉토리입니다.
├── 04_frontend/           # 이 디렉토리는 프론트엔드 관련 디렉토리입니다.
│ ├── 00_HTML/             # 이 디렉토리는 HTML 파일 디렉토리입니다.
│ │ ├── index.html
│ │ ├── sign_up.html
│ │ ├── upload.html
│ │ └── record.html
│ └── 01_CSS/              # 이 디렉토리는 CSS 파일 디렉토리입니다.
│   └── style.css
└── 05_backend/project     # 이 디렉토리는 백엔드 관련 디렉토리입니다.
  ├── manage.py
  ├── db.sqlite3
  ├── project
  │ ├── settings.py
  │ ├── urls.py
  │ ├── asgi.py
  │ └── wsgi.py
  └── ai_helath_care
    ├── models.py
    ├── views.py
    ├── admin.py
    ├── apps.py
	├── tests.py
    └── migrations
```

## Installation
1. Clone the repository
	```
	gh repo clone Open-Source-T/Open-Source
	```

2. Navigate to the project directory
	```
	cd Open-Source
	```

3. Install dependencies
	```
	pip install django
	```

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
Email: @gmail.com
- Park, K. B. ([Park, K. B.](https://github.com/BiNdellx))
Email: @gmail.com
- Jung, S. I. ([Jung, S. I.](https://github.com/DNUBI))
Email: @gmail.com