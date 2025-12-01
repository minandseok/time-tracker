# Time Tracker ⏱️

시간을 기록하고 관리하는 웹 애플리케이션

<div align="center">

![Made with Cursor](https://img.shields.io/badge/Made%20with-Cursor-05122A?style=flat&logo=cursor&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

</div>

> 🤖 **AI-Powered Development**: 이 프로젝트는 [Cursor AI](https://cursor.sh)를 활용하여 개발되었습니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **상태 관리**: Zustand
- **데이터 저장**: localStorage
- **개발 도구**: Cursor AI

## 주요 기능

- ⏱️ 타이머 시작, 일시정지, 재개, 정지
- 📝 프로젝트별 시간 기록
- 📊 총 프로젝트 시간 및 기록 개수 표시
- 🗑️ 개별 기록 삭제
- 🔄 전체 기록 초기화
- 💾 localStorage를 통한 데이터 영구 저장
- 📱 반응형 디자인 (모바일/데스크톱)

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm start
```

## 프로젝트 구조

```
time-tracker/
├── app/                      # Next.js App Router
│   ├── globals.css          # 전역 스타일
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx             # 홈 페이지
├── components/              # React 컴포넌트
│   ├── Header.tsx          # 헤더 컴포넌트
│   ├── TimeTrackerApp.tsx  # 메인 앱 컴포넌트
│   ├── Timer/              # 타이머 관련 컴포넌트
│   │   ├── ActivityInput.tsx
│   │   ├── TimerDisplay.tsx
│   │   ├── TimerControls.tsx
│   │   └── TimerSection.tsx
│   ├── Records/            # 기록 관련 컴포넌트
│   │   ├── TotalTimeCard.tsx
│   │   ├── RecordItem.tsx
│   │   ├── RecordsList.tsx
│   │   └── RecordsSection.tsx
│   └── Modal/              # 모달 컴포넌트
│       ├── Modal.tsx
│       ├── DeleteModal.tsx
│       └── ClearAllModal.tsx
├── store/                   # Zustand 상태 관리
│   └── useTimerStore.ts
├── types/                   # TypeScript 타입 정의
│   └── index.ts
├── utils/                   # 유틸리티 함수
│   ├── timeFormat.ts
│   └── storage.ts
└── package.json

```

## 주요 컴포넌트 설명

### TimerSection
타이머 기능을 담당하는 섹션으로, 프로젝트 입력, 시간 표시, 컨트롤 버튼을 포함합니다.

### RecordsSection
저장된 프로젝트 기록들을 표시하고 관리하는 섹션입니다.

### Zustand Store
전역 상태 관리를 담당하며, 타이머 상태와 기록 데이터를 관리합니다.

## 키보드 단축키

- **Enter**: 프로젝트 이름 입력 후 타이머 시작
- **ESC**: 열려있는 모달 닫기

## 개발 스토리

이 프로젝트는 바닐라 JavaScript에서 시작하여 **Cursor AI**의 도움으로 Next.js + React + TypeScript로 완전히 리팩토링되었습니다.

### 주요 전환 과정:
- 📝 바닐라 JS → React 컴포넌트 기반 아키텍처
- 🎨 CSS → Tailwind CSS v4
- 📊 단일 파일 → 모듈화된 구조
- 🔧 JavaScript → TypeScript (타입 안정성)
- 📱 표 형태 UI 및 마크다운 내보내기 기능 추가

### 개발 환경:
- **IDE**: [Cursor](https://cursor.sh) - AI-powered code editor
- **AI Model**: Claude Sonnet 4.5
- **개발 시간**: ~2시간 (AI 페어 프로그래밍)

---

## 라이센스

MIT

---

<div align="center">

**Made with ❤️ and 🤖 using [Cursor AI](https://cursor.sh)**

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!

</div>
