# 🚀 GitHub Pages로 앱 배포하기

## 📋 목차
1. [GitHub 계정 만들기](#1-github-계정-만들기)
2. [저장소 만들기](#2-저장소-만들기)
3. [파일 업로드하기](#3-파일-업로드하기)
4. [GitHub Pages 활성화](#4-github-pages-활성화)
5. [아이폰/아이패드에서 접속](#5-아이폰아이패드에서-접속)
6. [PWA 설치](#6-pwa-설치)

---

## 1. GitHub 계정 만들기

### 이미 계정이 있으면 이 단계 건너뛰기

1. **GitHub 웹사이트 접속**
   - https://github.com 접속

2. **Sign up 클릭**
   - 오른쪽 상단 "Sign up" 버튼 클릭

3. **정보 입력**
   - 이메일 주소 입력
   - 비밀번호 생성 (강력한 비밀번호 사용)
   - 사용자명 입력 (예: `myname123`)
   - 이메일 수신 여부 선택
   - 퍼즐 풀기 (로봇 확인)
   - "Create account" 클릭

4. **이메일 인증**
   - 받은 이메일에서 인증 코드 입력

---

## 2. 저장소 만들기

1. **로그인 후 New repository 클릭**
   - 우측 상단 `+` 버튼 → "New repository"

2. **저장소 정보 입력**
   - **Repository name**: `daily-routine` (원하는 이름)
   - **Description**: "일상 목표 챌린지 앱" (선택사항)
   - **Public** 선택 (⚠️ Private는 유료 플랜 필요)
   - "Add a README file" **체크 안 함**
   - "Create repository" 클릭

3. **저장소 생성 완료**
   - 빈 저장소가 생성됨
   - URL 예시: `https://github.com/사용자명/daily-routine`

---

## 3. 파일 업로드하기

### 방법 1: 웹 인터페이스 사용 (가장 쉬움)

1. **"uploading an existing file" 링크 클릭**
   - 저장소 페이지 중간에 있는 링크

2. **파일 드래그 앤 드롭**
   - 다음 파일들을 모두 선택해서 드래그:
     ```
     index.html
     script.js
     styles.css
     manifest.json
     sw.js
     stamp.png
     icon-72.png
     icon-96.png
     icon-128.png
     icon-144.png
     icon-152.png
     icon-192.png
     icon-384.png
     icon-512.png
     ```

3. **커밋 메시지 작성**
   - 하단 "Commit changes"에 메시지 입력
   - 예: "Initial commit - 앱 파일 업로드"

4. **Commit changes 클릭**
   - 녹색 버튼 클릭하여 업로드 완료

### 방법 2: Git 명령어 사용 (고급)

```bash
# 앱 폴더로 이동
cd C:\Project\ftp\app

# Git 초기화
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit"

# GitHub 저장소 연결 (본인의 URL로 변경)
git remote add origin https://github.com/사용자명/daily-routine.git

# 업로드
git branch -M main
git push -u origin main
```

---

## 4. GitHub Pages 활성화

1. **Settings 탭 클릭**
   - 저장소 상단 메뉴에서 "Settings" 클릭

2. **Pages 메뉴 찾기**
   - 왼쪽 사이드바에서 "Pages" 클릭

3. **Source 설정**
   - **Branch**: `main` 선택
   - **Folder**: `/ (root)` 선택
   - "Save" 버튼 클릭

4. **배포 대기**
   - 약 1-3분 정도 소요
   - 페이지 새로고침하면 URL이 표시됨
   - **URL 예시**: `https://사용자명.github.io/daily-routine/`

5. **배포 완료 확인**
   - 상단에 녹색 체크마크와 함께 URL이 표시되면 완료
   - "Visit site" 버튼 클릭하여 확인

---

## 5. 아이폰/아이패드에서 접속

1. **Safari 열기**
   - 아이폰/아이패드에서 Safari 앱 실행

2. **URL 입력**
   - 주소창에 GitHub Pages URL 입력
   - 예: `https://사용자명.github.io/daily-routine/`

3. **앱 실행 확인**
   - 앱이 정상적으로 로드됨
   - 모든 기능이 작동함

---

## 6. PWA 설치

### 아이폰/아이패드에서:

1. **Safari 하단 공유 버튼(□↗) 탭**

2. **아래로 스크롤하여 "홈 화면에 추가" 선택**

3. **앱 이름 확인**
   - 기본 이름: "Days in Routine"
   - 원하면 수정 가능

4. **"추가" 버튼 탭**
   - 오른쪽 상단 "추가" 버튼

5. **홈 화면에서 확인**
   - 앱 아이콘이 홈 화면에 생성됨
   - 일반 앱처럼 실행 가능

### Android에서:

1. **Chrome으로 접속**

2. **자동 프롬프트**
   - "홈 화면에 추가" 프롬프트 표시
   - "설치" 클릭

3. **수동 설치**
   - 메뉴(⋮) → "홈 화면에 추가"

---

## 🔄 파일 업데이트하기

앱을 수정한 후 다시 배포하려면:

### 웹 인터페이스 사용:

1. GitHub 저장소 페이지 접속
2. 수정할 파일 클릭 (예: `script.js`)
3. 연필 아이콘(✏️) 클릭
4. 코드 수정
5. 하단 "Commit changes" 클릭
6. 1-2분 후 자동으로 재배포됨

### 파일 교체:

1. GitHub 저장소에서 파일 클릭
2. 삭제 아이콘 클릭
3. 새 파일 업로드 ("Add file" → "Upload files")

### Git 사용:

```bash
# 파일 수정 후
git add .
git commit -m "수정 내용 설명"
git push
```

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] 모든 파일이 업로드되었는가?
- [ ] `index.html`이 루트 폴더에 있는가?
- [ ] 아이콘 파일들이 모두 업로드되었는가?
- [ ] GitHub Pages가 활성화되었는가?
- [ ] URL이 표시되었는가?
- [ ] 브라우저에서 접속 테스트를 했는가?

---

## 🐛 문제 해결

### 404 에러가 나는 경우:

1. **저장소가 Public인지 확인**
   - Settings → General → Danger Zone에서 확인

2. **Branch 이름 확인**
   - `main`인지 `master`인지 확인
   - Pages 설정에서 올바른 브랜치 선택

3. **배포 상태 확인**
   - Actions 탭에서 배포 진행 상황 확인
   - 초록색 체크마크가 나올 때까지 대기

### 파일이 업데이트되지 않는 경우:

1. **캐시 삭제**
   - Safari에서 Option+Cmd+R (강력 새로고침)
   - 또는 개발자 도구에서 캐시 비우기

2. **배포 확인**
   - GitHub Actions 탭에서 배포 완료 확인

### HTTPS 경고가 나는 경우:

- GitHub Pages는 자동으로 HTTPS 제공
- Settings → Pages → "Enforce HTTPS" 체크

---

## 💡 추가 팁

### 커스텀 도메인 사용:

1. 도메인 구매 (예: `mydailyroutine.com`)
2. Settings → Pages → Custom domain에 입력
3. DNS 설정 추가

### Private 저장소로 만들기:

- GitHub Pro 플랜 필요 (유료)
- 또는 다른 호스팅 서비스 사용 (Netlify, Vercel 등)

### 성능 최적화:

- 이미지 파일 압축
- 코드 최소화 (minify)
- 캐싱 전략 개선

---

## 📞 도움이 필요하면

- GitHub 공식 문서: https://docs.github.com/pages
- GitHub Pages 가이드: https://pages.github.com
- 커뮤니티 포럼: https://github.community

---

**🎉 이제 전 세계 어디서나 앱에 접속할 수 있습니다!**

URL을 북마크하거나 친구들과 공유하세요.
