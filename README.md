# AI Persnal Finace Tracker (v1.0)

자연어로 간편하게 지출을 기록하고 관리하는 AI 기반 개인 재무 관리 서비스입니다.

---

## 기술 스택(Tech Stack)

### Framework and Language

- **Next.js 16(App Router)**
- **TypeScript**
- **React 19**

### Database and ORM

- **SQLite**
- **Prisma 7**

### Authentication and UI

- **Custom Auth System(Session-based)**
- **Tailwind CSS**
- **Zod**

### AI and Infrastructure

- **Ollama(Local LLM Container)**
- **Docker**(Environment Setup)
- **Linux(pop-os)**

---

## ✨ 핵심 기능 (v1.0)

1. **사용자 인증 (Authentication)**
   - 세션 기반 로그인 및 보호된 라우트(`AuthenticatedLayout`) 적용

2. **자연어 기반 지출 입력**
   - "오늘 점심 국밥 9000원" 같은 자연어 문장을 Local LLM(Ollama)이 파싱하여 자동 데이터화

3. **지출 내역 관리**
   - Prisma ORM을 통한 유저별 지출 내역 CRUD 및 최신순 조회

4. **주간 지출 리포트 (Weekly Overview)**
   - 유저 맞춤형 주간 지출 내역 모달 및 풀페이지 뷰 지원
   -

## 🚀 향후 발전 방향 (v2.0 Roadmap)

- [ ] **데이터 시각화 (Charts)**: `recharts`를 활용한 카테고리별/기간별(주간·월간·연간) 지출 파이·막대 차트 구현
- [ ] **데이터 내보내기 (CSV Export)**: Browser `Blob` 기반 지출 내역 로컬 CSV 다운로드 기능
- [ ] **지출 분석 AI 피드백**: 소비 패턴 분석 및 절약 팁 자동 제안 기능 강화

---

> **Note**: v1.0 개발 완료 후, 차기 프로젝트로 **AI 비전 API 기반 옷장 관리 시스템** 개발 진행 예정.
