### 모던워시 관리자 페이지
시작방법
```
npm run start
```

- 사용 라이브러리 : react v18.3.1, react-router-dom v6.30.1, zustand v5.0.6, mui v7.2.0 

1. 메인페이지
* 비 로그인 시
<img width="1918" height="911" alt="스크린샷 2025-07-23 133912" src="https://github.com/user-attachments/assets/1452a0e2-bfac-4944-b28c-49d80731403e" />

- 일반 유저로 간주되어 사이드 바에서 FAQ 페이지만 들어갈 수 있게 표시
- 최근 공지사항 목록 불러오기 

* 관리자 로그인 시
<img width="1919" height="903" alt="스크린샷 2025-07-23 134917" src="https://github.com/user-attachments/assets/2883458a-8f0f-4c28-84c7-42c65c85acf7" />
- 관리자로 로그인하면 사이드바의 메뉴가 공지사항 관리와 FAQ관리로 변경
- 클릭하면 이동
- 최근 공지사항 메뉴에도 전체보기가 생성되어 자동으로 공지사항 관리 페이지로 이동

2. 로그인 페이지
- 페이지
  <img width="1915" height="909" alt="스크린샷 2025-07-23 134211" src="https://github.com/user-attachments/assets/68ed804f-b275-41d3-8061-bdd9690b157b" />
- 아이디 비밀번호 미 입력시
  <img width="1914" height="949" alt="스크린샷 2025-07-23 134226" src="https://github.com/user-attachments/assets/b3ac567e-ed44-4d98-9ea8-980359f8fe94" />
- 아이디 비밀번호가 일치하지 않을 때
  <img width="1914" height="914" alt="스크린샷 2025-07-23 134308" src="https://github.com/user-attachments/assets/60d0cfd1-ae65-4e5e-a588-5796f435974b" />
- 일치 할 때
  <img width="1910" height="953" alt="스크린샷 2025-07-23 134341" src="https://github.com/user-attachments/assets/5ea9d945-0ff0-4bd4-b302-a65473f27668" />


**기능 내역**
1. 아이디 비밀번호 미입력 시 경고창 출력
2. 로그인 실패 시 경고창 출력
3. 성공하면 경고창과 함께 메인페이지로 이동  
4. 성공 할 때 zustand상태 관리를 통해 localStroage에 토큰정보 저장 및 로그인 때 불러온 토큰도 저장 되게 설정
5. axios에서 인터셉터 기능을 활용해 header에 Autorized=Barear토큰 저장
<img width="349" height="295" alt="image" src="https://github.com/user-attachments/assets/2ec4a863-3c10-4a2c-a9ff-955eea4ed69c" />
6. 로그인이 된 후 토큰 정보가 있으면 로그인 버튼은 로그아웃 버튼으로 변경 로그아웃시 localStorage에 있는 토큰 정보와 zustand 토큰정보를 제거 

3. 공지사항 관리
- 목록 페이지
<img width="1919" height="908" alt="스크린샷 2025-07-23 135057" src="https://github.com/user-attachments/assets/c783785a-310f-4da1-8d19-02e819bfbc5a" />
- 상세페이지
<img width="1915" height="912" alt="스크린샷 2025-07-23 135203" src="https://github.com/user-attachments/assets/4dff5097-55b3-46ca-8f55-8cc70ddc04d3" />
- 등록
<img width="1915" height="910" alt="스크린샷 2025-07-23 135140" src="https://github.com/user-attachments/assets/857d116d-9e46-4032-a78e-6b65a2e74964" />
- 수정 
<img width="1917" height="904" alt="스크린샷 2025-07-23 135128" src="https://github.com/user-attachments/assets/901e0893-4e20-4a27-8fb3-3e19f7fd09f8" />

**기능 내역**
- 테이블 태그를 활용하여 리스트 출력
- 각 버튼을 누르면 해당하는 페이지와 삭제 기능 작동
- 삭제는 알림창을 출력 하여 선택 기능 추가
<img width="1914" height="950" alt="스크린샷 2025-07-23 135359" src="https://github.com/user-attachments/assets/f7aa6fcb-d950-41d7-aa70-51353a53a70b" />
- 상세 페이지 에서도 수정 삭제 가능
- 페이지네이션을 활용하여 페이지 분리 성공

4. FAQ관리
- 목록
<img width="1918" height="905" alt="스크린샷 2025-07-23 135447" src="https://github.com/user-attachments/assets/6d8966dd-1bd2-4197-86ef-8d176ad4e2f3" />

- 상세 
<img width="1916" height="903" alt="스크린샷 2025-07-23 135553" src="https://github.com/user-attachments/assets/dddf6acf-5654-4712-bf50-512826403675" />

- 수정
<img width="1919" height="913" alt="스크린샷 2025-07-23 140348" src="https://github.com/user-attachments/assets/7af6f99b-599f-4b48-8132-0150d8ad058c" />

- 등록
<img width="1917" height="907" alt="스크린샷 2025-07-23 140409" src="https://github.com/user-attachments/assets/02412546-bbd4-4774-a06f-e01df128079a" />


**기능 내역**
- 테이블 태그를 활용하여 리스트 출력
- 각 버튼을 누르면 해당하는 페이지와 삭제 기능 작동
- 삭제는 알림창을 출력 하여 선택 기능 추가
<img width="1907" height="952" alt="스크린샷 2025-07-23 140445" src="https://github.com/user-attachments/assets/5c400df5-5a59-4e46-a2b6-68bfb7f9ae6c" />
- 상세 페이지 에서도 수정 삭제 가능
- 페이지네이션을 활용하여 페이지 분리 성공

5. FAQ(일반 유저)
- 각 탭별 내용
<img width="1913" height="904" alt="스크린샷 2025-07-23 140707" src="https://github.com/user-attachments/assets/20bb0adb-204b-4351-9b13-453f233ed6a3" />

<img width="1914" height="907" alt="스크린샷 2025-07-23 140715" src="https://github.com/user-attachments/assets/a8d57f0b-2a89-4ea6-b9fe-dde186df0b60" />

- 등록 된 질문이 없을 경우
<img width="1917" height="911" alt="스크린샷 2025-07-23 140739" src="https://github.com/user-attachments/assets/dc6a0ff5-4d8d-4003-a724-7d0509a2017d" />

**기능 내역**
- 전체 질문 내역을 불러온 후
- 등록 된 카테고리 리스트를 thead를 활용하여 버튼형식으로 생성
- 해당하는 카테고리를 누르면 일치하는 내용이 나오도록 생성 하였음
