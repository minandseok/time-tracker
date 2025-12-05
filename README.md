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
- **차트 라이브러리**: Recharts
- **데이터 저장**: localStorage
- **개발 도구**: Cursor AI

## 주요 기능

### 타이머 기능
- ⏱️ 타이머 시작, 일시정지, 재개, 기록
  - 일시정지 시 해당 시점까지 활동 기록 후 잡동사니 시간 시작
  - 재개 시 잡동사니 시간 기록 후 새로운 활동 기록 시작
- 🔀 활동 교체 (진행 중인 활동 자동 기록 + 새 활동 시작)
- 🧹 잡동사니 시간 추적 (집중하지 못한 시간 자동 기록)
- 🎯 자동완성 (이전 활동 이름 자동 제안)

### 기록 관리
- 📝 활동별 시간 기록
- 🗑️ 개별 기록 삭제
- 🔄 전체 기록 초기화
- 📋 마크다운 표 형식 복사 (Obsidian 호환)
- 📊 시간 통계 표시 (전체 시간, 집중 시간, 잡동사니 시간)

### 통계 및 시각화
- 📊 활동별 시간 분포 (바 차트 + 활동 리스트)
  - 총 활동 수 및 전체 시간 표시
  - 각 활동별 시간, 기록 수, 비율 상세 정보
- ⏰ 시간 흐름 타임라인 (GitHub 스타일 정사각형 그리드)
  - 1초 단위 정밀 시간 표시
  - 블록 채도 시스템 (1시간, 30분, 15분, 1분, 30초, 15초, 1초)
  - 활동 선택 및 하이라이트 기능
  - 시작 시간 ~ 종료 시간 범위 표시
- 🎨 활동별 일관된 색상 표시

### 기타
- 💾 localStorage를 통한 데이터 영구 저장
- 📱 반응형 디자인 (모바일/데스크톱)
- ♿ 접근성 고려 (키보드 단축키, 툴팁)

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
│   │   ├── ActivityInput.tsx    # 활동 입력 (자동완성 포함)
│   │   ├── TimerDisplay.tsx     # 시간 표시
│   │   ├── TimerControls.tsx    # 컨트롤 버튼
│   │   └── TimerSection.tsx     # 타이머 섹션 통합
│   ├── Records/            # 기록 관련 컴포넌트
│   │   ├── RecordsList.tsx      # 기록 목록 (표 형태)
│   │   └── RecordsSection.tsx   # 기록 섹션
│   ├── Charts/             # 차트 관련 컴포넌트
│   │   ├── ChartsView.tsx       # 활동별 시간 분포 (바 차트)
│   │   └── TimelineView.tsx     # 시간 흐름 타임라인
│   └── Modal/              # 모달 컴포넌트
│       ├── Modal.tsx            # 기본 모달
│       ├── DeleteModal.tsx      # 삭제 확인
│       ├── ClearAllModal.tsx    # 전체 초기화 확인
│       ├── SwitchActivityModal.tsx  # 활동 교체
│       └── MiscStopConfirmModal.tsx # 잡동사니 종료 확인
├── store/                   # Zustand 상태 관리
│   └── useTimerStore.ts
├── types/                   # TypeScript 타입 정의
│   └── index.ts
├── utils/                   # 유틸리티 함수
│   ├── timeFormat.ts       # 시간 포맷팅
│   ├── storage.ts          # localStorage 헬퍼
│   ├── colorUtils.ts       # 활동별 색상 관리
│   └── statistics.ts       # 통계 계산 유틸리티
└── package.json

```

## 주요 컴포넌트 설명

### TimerSection
타이머 기능을 담당하는 섹션으로, 활동 입력(자동완성 포함), 시간 표시, 컨트롤 버튼, 잡동사니 시간 관리를 포함합니다.

### RecordsSection
저장된 활동 기록들을 표 형태로 표시하고, 개별 삭제, 전체 초기화, 마크다운 복사 기능을 제공합니다. 전체 시간, 집중 시간, 잡동사니 시간 통계를 표시합니다.

### ChartsView
Recharts를 사용하여 활동별 시간 분포를 바 차트로 시각화합니다. 총 활동 수와 전체 시간을 헤더에 표시하며, 각 활동별 시간, 기록 수, 비율 정보를 리스트로 제공합니다.

### TimelineView
GitHub 스타일의 정사각형 그리드로 시간 흐름에 따라 모든 활동을 시각화합니다. 1초 단위 정밀 표시와 함께 블록 채도 시스템을 통해 활동 지속 시간을 직관적으로 표현합니다. 활동 선택 시 해당 활동의 모든 블록이 하이라이트되며, 시작 시간부터 종료 시간까지의 범위를 표시합니다.

### Zustand Store
전역 상태 관리를 담당하며, 타이머 상태, 기록 데이터, 잡동사니 모드, 모달 상태 등을 관리합니다.

## 키보드 단축키

- **Enter**: 활동 이름 입력 후 타이머 시작 (자동완성에서 선택 항목 확정)
- **↑/↓**: 자동완성 목록 탐색
- **ESC**: 열려있는 모달 닫기 또는 자동완성 닫기

## 개발 스토리

이 프로젝트는 바닐라 JavaScript에서 시작하여 **Cursor AI**의 도움으로 Next.js + React + TypeScript로 완전히 리팩토링되었습니다.

### 주요 전환 및 개발 과정:
- 📝 바닐라 JS → React 컴포넌트 기반 아키텍처
- 🎨 CSS → Tailwind CSS v4
- 📊 단일 파일 → 모듈화된 구조
- 🔧 JavaScript → TypeScript (타입 안정성)
- 📱 표 형태 UI 및 마크다운 내보내기 기능 추가
- 🧹 잡동사니 시간 추적 시스템 개발
- 🔀 활동 교체 및 자동완성 기능 추가
- 📈 Recharts를 활용한 통계 시각화
- ⏰ GitHub 스타일 시간 흐름 타임라인 구현 (1초 단위, 블록 채도 시스템)
- 🎨 활동별 일관된 색상 시스템 (해시 기반)
- 🔧 통계 계산 로직 리팩토링 (utils/statistics.ts)
- 📊 활동별 시간 분포 차트 개선 (활동 리스트 추가)

### 개발 환경:
- **IDE**: [Cursor](https://cursor.sh) - AI-powered code editor
- **AI Model**: Claude Sonnet 4.5
- **개발 시간**: 약 10시간+ (AI 페어 프로그래밍)
- **총 기능 개발**: 20+ 주요 기능

---

## 라이센스

MIT

---

<div align="center">

**Made with ❤️ and 🤖 using [Cursor AI](https://cursor.sh)**

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!

</div>
