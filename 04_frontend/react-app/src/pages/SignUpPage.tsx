import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import type { SignupPayload } from '../api'

export function SignUpPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<SignupPayload>({
    username: '',
    password1: '',
    password2: '',
    age: '',
    sex: '',
    height: '',
    weight: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (key: keyof SignupPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await api.signUp(form)
      setSuccess('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.')
      setTimeout(() => navigate('/'), 1500)
    } catch (err: any) {
      setError(err?.message || '회원가입 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>회원가입</h2>
      <p className="muted">기본 정보를 입력하면 맞춤 영양 코칭을 받을 수 있습니다.</p>

      <form onSubmit={handleSubmit} className="form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label style={{ gridColumn: '1 / -1' }}>
            아이디
            <input
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="사용할 아이디를 입력하세요"
              required
              autoFocus
            />
          </label>

          <label>
            비밀번호
            <input
              type="password"
              value={form.password1}
              onChange={(e) => handleChange('password1', e.target.value)}
              placeholder="비밀번호"
              required
            />
          </label>

          <label>
            비밀번호 확인
            <input
              type="password"
              value={form.password2}
              onChange={(e) => handleChange('password2', e.target.value)}
              placeholder="비밀번호 재입력"
              required
            />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label>
            나이
            <input
              type="number"
              value={form.age}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="예: 29"
              required
            />
          </label>

          <label>
            성별
            <select value={form.sex} onChange={(e) => handleChange('sex', e.target.value)} required>
              <option value="">선택하세요</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </label>

          <label>
            키 (cm)
            <input
              type="number"
              value={form.height}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder="예: 170"
              required
            />
          </label>

          <label>
            몸무게 (kg)
            <input
              type="number"
              value={form.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="예: 65"
              required
            />
          </label>
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

        {success && (
          <div className="alert success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {success}
          </div>
        )}

        <button className="primary" type="submit" disabled={loading}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              가입 처리 중...
            </span>
          ) : (
            '가입하기'
          )}
        </button>
      </form>

      <div className="helper">
        이미 계정이 있으신가요?{' '}
        <button type="button" className="link" onClick={() => navigate('/')}>
          로그인하기
        </button>
      </div>
    </div>
  )
}
