import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

type Props = {
  username: string | null
}

export function UploadPage({ username }: Props) {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<{ food: string; coaching: string } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!file) {
      setError('분석할 이미지를 선택하세요.')
      return
    }
    setLoading(true)
    try {
      const res = await api.upload(file)
      setResult({ food: res.food, coaching: res.coaching })
    } catch (err: any) {
      if (err?.message?.includes('로그인')) {
        navigate('/')
      }
      setError(err?.message || '업로드 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>음식 사진 업로드</h2>
      <p className="muted">
        YOLO로 음식명을 감지하고 Gemini로 영양 코칭을 생성합니다. {username ? `(${username}님 환영합니다)` : ''}
      </p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          음식 사진 선택
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        {error && <div className="alert error">{error}</div>}
        <button className="primary" type="submit" disabled={loading}>
          {loading ? '분석 중...' : '분석하기'}
        </button>
      </form>

      {result && (
        <div className="result">
          <div className="pill">감지된 음식: {result.food || '미확인'}</div>
          <div className="coaching">{result.coaching}</div>
        </div>
      )}
    </div>
  )
}
