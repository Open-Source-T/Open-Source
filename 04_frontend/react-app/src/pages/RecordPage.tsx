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
    <div className="card" style={{ width: 'min(800px, 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>분석 기록</h2>
        <span className="pill">최근 분석 결과</span>
      </div>

      <p className="muted">AI가 분석한 최근 식단 기록입니다.</p>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-600)' }}>
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span style={{ fontWeight: 600 }}>기록을 불러오는 중입니다...</span>
          </div>
        </div>
      )}

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

      {!loading && !error && (
        <div className="result" style={{ minHeight: '200px' }}>
          {description ? (
            <div className="coaching">
              {description.split('\n').map((line, i) => (
                <p key={i} style={{ marginBottom: '0.8rem' }}>{line}</p>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--slate-400)'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>아직 분석된 기록이 없습니다.</p>
              <button className="primary" onClick={() => navigate('/upload')} style={{ marginTop: '1.5rem' }}>
                첫 분석 시작하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
