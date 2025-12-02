import { useState } from 'react'
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { UploadPage } from './pages/UploadPage'
import { RecordPage } from './pages/RecordPage'
import { api } from './api'
import './App.css'

function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await api.logout()
      setUser(null)
      navigate('/')
    } catch {
      // 로그인 세션이 없더라도 조용히 무시
      setUser(null)
      navigate('/')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" onClick={() => navigate('/')}>
          AI Health Coach
        </div>
        <nav>
          {!user && (
            <>
              <NavLink to="/" end>
                로그인
              </NavLink>
              <NavLink to="/sign-up">회원가입</NavLink>
            </>
          )}
          {user && (
            <>
              <NavLink to="/upload">업로드</NavLink>
              <NavLink to="/record">기록</NavLink>
            </>
          )}
        </nav>
        <div className="user-actions">
          {user && <span className="pill">안녕하세요, {user}님</span>}
          {user && (
            <button className="ghost" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? '로그아웃 중...' : '로그아웃'}
            </button>
          )}
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/upload" replace /> : <LoginPage onLogin={setUser} />} />
          <Route path="/sign-up" element={user ? <Navigate to="/upload" replace /> : <SignUpPage />} />
          <Route path="/upload" element={user ? <UploadPage username={user} /> : <Navigate to="/" replace />} />
          <Route path="/record" element={user ? <RecordPage /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
