import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.static("."));
app.use(express.json());

// ✅ 로그인 요청 (POST /api/login)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "이메일과 비밀번호를 입력하세요." });

  fs.readFile("records.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "데이터베이스 읽기 실패" });

    const db = JSON.parse(data);
    const user = db.users.find(u => u.email === email && u.password === password);

    if (!user) return res.status(401).json({ error: "로그인 실패: 사용자 정보를 확인하세요." });

    // ✅ 사용자 기본 정보 포함
    res.json({
      message: "로그인 성공",
      userId: user.id,
      email: user.email,
      gender: user.gender,
      height: user.height,
      weight: user.weight
    });
  });
});


// ✅ 사용자별 기록 조회 (GET /api/records?userId=user123)
app.get("/api/records", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId가 필요합니다." });

  fs.readFile("records.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "데이터를 읽을 수 없습니다." });

    const db = JSON.parse(data);
    const user = db.users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ error: "해당 사용자를 찾을 수 없습니다." });

    res.json(user.records);
  });
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
