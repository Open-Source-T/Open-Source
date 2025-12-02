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
      setSuccess('회원가입이 완료되었습니다. 로그인하세요.')
      setTimeout(() => navigate('/'), 700)
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
      <form onSubmit={handleSubmit} className="form grid">
        <label>
          아이디
          <input
            value={form.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="아이디"
            required
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
            <option value="">선택</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </label>
        <label>
          키(cm)
          <input
            type="number"
            value={form.height}
            onChange={(e) => handleChange('height', e.target.value)}
            placeholder="예: 170"
            required
          />
        </label>
        <label>
          몸무게(kg)
          <input
            type="number"
            value={form.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            placeholder="예: 65"
            required
          />
        </label>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        <button className="primary" type="submit" disabled={loading}>
          {loading ? '가입 중...' : '가입하기'}
        </button>
      </form>
      <div className="helper">
        이미 계정이 있다면{' '}
        <button type="button" className="link" onClick={() => navigate('/')}>
          로그인
        </button>
      </div>
    </div>
  )
}
