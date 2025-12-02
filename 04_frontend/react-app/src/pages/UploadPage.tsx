import type { FormEvent } from 'react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

type Props = {
  username: string | null
}

type NutritionData = {
  calories: number
  carbs: number
  protein: number
  fat: number
  advice: string
}

function parseNutrition(text: string): NutritionData {
  const caloriesMatch = text.match(/칼로리:\s*(\d+)/)
  const carbsMatch = text.match(/탄수화물:\s*(\d+)/)
  const proteinMatch = text.match(/단백질:\s*(\d+)/)
  const fatMatch = text.match(/지방:\s*(\d+)/)
  const adviceMatch = text.match(/조언:\s*(.*)/)

  return {
    calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 0,
    carbs: carbsMatch ? parseInt(carbsMatch[1]) : 0,
    protein: proteinMatch ? parseInt(proteinMatch[1]) : 0,
    fat: fatMatch ? parseInt(fatMatch[1]) : 0,
    advice: adviceMatch ? adviceMatch[1] : text,
  }
}

function NutritionCard({ data }: { data: NutritionData }) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const getWidth = (val: number, max: number) => {
    return animate ? `${Math.min((val / max) * 100, 100)}%` : '0%'
  }

  return (
    <div className="nutrition-card">
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--slate-900)' }}>
        영양 분석 결과
      </h3>

      <div className="nutrition-item">
        <div className="nutrition-header">
          <span>칼로리</span>
          <span>{data.calories} kcal</span>
        </div>
        <div className="nutrition-bar-bg">
          <div className="nutrition-bar-fill bar-calories" style={{ width: getWidth(data.calories, 800) }} />
        </div>
      </div>

      <div className="nutrition-item">
        <div className="nutrition-header">
          <span>탄수화물</span>
          <span>{data.carbs} g</span>
        </div>
        <div className="nutrition-bar-bg">
          <div className="nutrition-bar-fill bar-carbs" style={{ width: getWidth(data.carbs, 100) }} />
        </div>
      </div>

      <div className="nutrition-item">
        <div className="nutrition-header">
          <span>단백질</span>
          <span>{data.protein} g</span>
        </div>
        <div className="nutrition-bar-bg">
          <div className="nutrition-bar-fill bar-protein" style={{ width: getWidth(data.protein, 40) }} />
        </div>
      </div>

      <div className="nutrition-item">
        <div className="nutrition-header">
          <span>지방</span>
          <span>{data.fat} g</span>
        </div>
        <div className="nutrition-bar-bg">
          <div className="nutrition-bar-fill bar-fat" style={{ width: getWidth(data.fat, 30) }} />
        </div>
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--slate-200)' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--slate-800)' }}>AI 코칭</h4>
        <p className="coaching">{data.advice}</p>
      </div>
    </div>
  )
}

export function UploadPage({ username }: Props) {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<{ food: string; coaching: string } | null>(null)
  const [nutrition, setNutrition] = useState<NutritionData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setResult(null)
      setNutrition(null)
      setError('')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!file) {
      setError('분석할 이미지를 선택해주세요.')
      return
    }
    setLoading(true)
    try {
      const res = await api.upload(file)
      setResult({ food: res.food, coaching: res.coaching })
      setNutrition(parseNutrition(res.coaching))
    } catch (err: any) {
      if (err?.message?.includes('로그인')) {
        navigate('/')
      }
      setError(err?.message || '업로드 실패')
    } finally {
      setLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="upload-container">
      <div className={`upload-layout ${nutrition ? 'split' : ''}`}>
        <div className="card" style={{ width: '100%', transition: 'all 0.5s' }}>
          <h2>음식 분석</h2>
          <p className="muted">
            {username ? `${username}님, ` : ''}오늘 드신 음식 사진을 올려주세요.<br />
            AI가 영양 성분을 분석하고 코칭해드립니다.
          </p>

          <form onSubmit={handleSubmit} className="form">
            <div
              onClick={triggerFileInput}
              style={{
                border: '2px dashed var(--slate-300)',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: preview ? `url(${preview}) center/cover no-repeat` : 'var(--slate-50)',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-400)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--slate-300)'}
            >
              {preview && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
                >
                  <span style={{ color: 'white', fontWeight: 600 }}>사진 변경하기</span>
                </div>
              )}

              {!preview && (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--slate-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span style={{ color: 'var(--slate-500)', fontWeight: 500 }}>
                    클릭하여 사진 업로드
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </div>

            {error && (
              <div className="alert error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}

            <button className="primary" type="submit" disabled={loading || !file}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  </svg>
                  AI 분석 중...
                </span>
              ) : (
                '분석하기'
              )}
            </button>
          </form>

          {result && !nutrition && (
            <div className="result" style={{ animation: 'slideUp 0.5s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <span style={{
                  background: 'var(--primary-100)',
                  color: 'var(--primary-700)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>
                  분석 결과
                </span>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--slate-800)' }}>{result.food || '음식명 미확인'}</h3>
              </div>
              <div className="coaching">
                {result.coaching.split('\n').map((line, i) => (
                  <p key={i} style={{ marginBottom: '0.5rem' }}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {nutrition && <NutritionCard data={nutrition} />}
      </div>
    </div>
  )
}
