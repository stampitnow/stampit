# 🍎 Safari에서 실행하기

## 문제
Safari에서는 로컬 파일(`file://`)로 직접 열면 다음 기능들이 작동하지 않습니다:
- Service Worker (오프라인 지원)
- PWA 설치
- 일부 저장소 기능

## 해결 방법

### 방법 1: Python 웹 서버 사용 (권장)

1. **서버 실행**
   - Windows: `start-server.bat` 더블클릭
   - Mac/Linux: 터미널에서 다음 명령어 실행
     ```bash
     python3 -m http.server 8000
     ```

2. **브라우저에서 접속**
   - Safari를 열고 `http://localhost:8000` 접속

3. **PWA 설치** (선택사항)
   - Safari 하단 공유 버튼(□↗) 탭
   - "홈 화면에 추가" 선택
   - "추가" 버튼 탭

### 방법 2: Node.js 웹 서버 사용

Node.js가 설치되어 있다면:

```bash
npx serve
```

그 다음 표시되는 URL로 접속

### 방법 3: Live Server (VS Code 사용자)

1. VS Code에서 "Live Server" 확장 프로그램 설치
2. `index.html` 파일 우클릭 → "Open with Live Server"

## 확인 방법

웹 서버가 제대로 실행되면:
- URL이 `http://localhost:8000`처럼 `http://` 또는 `https://`로 시작
- Safari 개발자 도구(Option+Cmd+I)에서 콘솔 오류 없음
- PWA 설치 옵션이 공유 메뉴에 표시됨

## 문제 해결

### Python이 설치되지 않은 경우
- Windows: Microsoft Store에서 "Python" 검색하여 설치
- Mac: 기본적으로 설치되어 있음

### 포트가 이미 사용 중인 경우
다른 포트 번호 사용:
```bash
python -m http.server 8080
```

그 다음 `http://localhost:8080` 접속

## 추가 팁

### Safari 개발자 도구 활성화
1. Safari → 환경설정 → 고급
2. "메뉴 막대에서 개발자용 메뉴 보기" 체크

### 캐시 문제 해결
Safari에서 Option+Cmd+E (캐시 비우기) 후 새로고침
