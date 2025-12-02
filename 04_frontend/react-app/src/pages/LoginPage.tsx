import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

type Props = {
  onLogin: (username: string) => void
}

export function LoginPage({ onLogin }: Props) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.login(username, password)
      onLogin(res.username)
      navigate('/upload')
    } catch (err: any) {
      setError(err?.message || '로그인 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>로그인</h2>
      <p className="muted">가입한 아이디와 비밀번호로 로그인하세요.</p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          아이디
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디를 입력"
            required
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력"
            required
          />
        </label>
        {error && <div className="alert error">{error}</div>}
        <button className="primary" type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <div className="helper">
        아직 계정이 없다면{' '}
        <button type="button" className="link" onClick={() => navigate('/sign-up')}>
          회원가입
        </button>
      </div>
    </div>
  )
}
