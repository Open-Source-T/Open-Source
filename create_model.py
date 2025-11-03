# YOLO 불러오기
!pip install ultralytics
import ultralytics
from ultralytics import YOLO

# 데이터셋 마운트
from google.colab import drive
drive.mount('/content/drive')

# YOLOv8 모델 불러오기 (l, m, n, s, x 중에 n이 가장 가볍기 때문에 n으로 함)
model = YOLO('yolov8n.pt')

# 모델 학습 (epochs = 학습 횟수, imgsz = 이미지 크기, batch = 한 번에 학습하는 이미지의 개수)
model.train(
    data='/content/drive/MyDrive/Dataset/data.yaml',
    epochs=50,
    imgsz=640,
    batch=16,
)

# 모델 학습 결과 확인
# box_loss, cls_loss, dfl_loss = 손실값 변화
# mAP@0.5, mAP@0.5:0.95: 모델의 정확도(mAP)
# Precision, Recall: 정밀도, 재현율 변화
from IPython.display import Image
Image(filename='runs/detect/train/results.png', width=600)

# 테스트
results = model.predict(
    source='/content/drive/MyDrive/Dataset/valid/images',
    conf=0.5
)
