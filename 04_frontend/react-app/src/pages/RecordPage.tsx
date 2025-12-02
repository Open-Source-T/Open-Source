import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export function RecordPage() {
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await api.getRecord()
        setDescription(res.description || '')
      } catch (err: any) {
        if (err?.message?.includes('로그인')) {
          navigate('/')
        }
        setError(err?.message || '기록을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchRecord()
  }, [navigate])

  return (
    <div className="card">
      <h2>분석 기록</h2>
      <p className="muted">최근 분석된 결과를 확인하세요.</p>
      {loading && <div className="alert">불러오는 중...</div>}
      {error && <div className="alert error">{error}</div>}
      {!loading && !error && (
        <div className="result">
          {description ? <div className="coaching">{description}</div> : <div className="muted">기록이 없습니다.</div>}
        </div>
      )}
    </div>
  )
}
