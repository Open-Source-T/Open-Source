import logging
from django.conf import settings

try:
    from google import genai
except ImportError as exc:
    genai = None
    _IMPORT_ERROR = exc
else:
    _IMPORT_ERROR = None

logger = logging.getLogger(__name__)

DEFAULT_MODEL_ID = getattr(settings, "GEMINI_MODEL_ID", "gemini-2.5-flash-lite")
DEFAULT_TEMPERATURE = getattr(settings, "GEMINI_TEMPERATURE", 0.2)
DEFAULT_MAX_TOKENS = getattr(settings, "GEMINI_MAX_OUTPUT_TOKENS", 5000)

_client = None


class GeminiClientError(Exception):
    """Gemini 호출 중 발생한 오류."""


def _cast_value(value, caster, default):
    try:
        return caster(value)
    except (TypeError, ValueError):
        return default


def _get_client():
    global _client
    if _client is not None:
        return _client

    if genai is None:
        raise GeminiClientError(
            "google-genai 패키지가 설치되어 있지 않습니다. `pip install -U google-genai` 후 다시 시도하세요."
        ) from _IMPORT_ERROR

    api_key = getattr(settings, "GEMINI_API_KEY", "") or ""
    if not api_key:
        raise GeminiClientError("GEMINI_API_KEY 환경 변수가 설정되어 있지 않습니다.")

    _client = genai.Client(api_key=api_key)
    return _client


def _extract_text(response):
    if hasattr(response, "text") and response.text:
        return response.text

    candidates = getattr(response, "candidates", None) or []
    for candidate in candidates:
        content = getattr(candidate, "content", None)
        parts = getattr(content, "parts", None) if content is not None else None
        if not parts:
            continue

        for part in parts:
            text = getattr(part, "text", None)
            if text:
                return text

    return ""


def _build_prompt(age, sex, height, weight, food):
    sex_label = {"M": "male", "F": "female"}.get(str(sex).upper(), sex or "unknown sex")
    food_label = food if food else "an unknown meal"
    return (
        "당신은 영양 코치입니다. 사용자의 나이, 성별, 키, 몸무게와 사용자가 섭취할 음식을 종합적으로 고려하여 헬스 코칭합니다.\n"
        f"사용자 정보: 나이 {age}세, 성별 {sex_label}, 키 {height}cm, 몸무게 {weight}kg.\n"
        f"사용자가 섭취한 음식: {food_label}.\n"
        "아래 형식을 정확히 한 줄로 출력하세요(앞뒤에 불릿/인사말/따옴표 추가 금지): "
        "'칼로리: <kcal>, 탄수화물: <g>, 단백질: <g>, 지방: <g>, 조언: <한국어로 상세한 조언>'"
    )


def generate_coaching_text(age, sex, height, weight, food):
    client = _get_client()

    prompt = _build_prompt(age, sex, height, weight, food)
    model_id = getattr(settings, "GEMINI_MODEL_ID", DEFAULT_MODEL_ID) or DEFAULT_MODEL_ID
    temperature = _cast_value(
        getattr(settings, "GEMINI_TEMPERATURE", DEFAULT_TEMPERATURE),
        float,
        float(DEFAULT_TEMPERATURE),
    )
    max_tokens = _cast_value(
        getattr(settings, "GEMINI_MAX_OUTPUT_TOKENS", DEFAULT_MAX_TOKENS),
        int,
        int(DEFAULT_MAX_TOKENS),
    )

    try:
        response = client.models.generate_content(
            model=model_id,
            contents=prompt,
            config={
                "temperature": float(temperature),
                "max_output_tokens": int(max_tokens),
            },
        )
    except Exception as exc:
        logger.exception("Gemini API 호출 실패")
        err_txt = str(exc)
        if "503" in err_txt or "overloaded" in err_txt.lower():
            raise GeminiClientError("Gemini 모델이 과부하 상태입니다. 잠시 후 다시 시도해주세요.") from exc
        raise GeminiClientError(f"Gemini API 호출 중 오류가 발생했습니다: {err_txt}") from exc

    text = _extract_text(response)
    if not text:
        raise GeminiClientError("Gemini 응답이 비어 있습니다.")

    return text.strip()
