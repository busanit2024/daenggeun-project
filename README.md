# 🥕당근 마켓을 웹으로, 당근마켓 클론 코딩 프로젝트 - 댕근
![댕근로고](https://github.com/busanit2024/daenggeun-project/blob/main/frontend/src/images/danggnlogo.png)

**댕근**은 당근마켓의 중고거래, 알바, 동네생활, 모임의 모바일에서 한정된 기능을 웹으로 가져와 구현한 서비스 입니다. 

## 🕙개발 기간
- 2024.11.27 ~ 2024.12.18
- 아이디어 회의
- 중간 점검
- 발표 평가

## 👨‍💻개발자 소개
- 정수현 : 팀장, 동네생활
- 엄채연 : 메인페이지 카테고리, 모임, 마이페이지, 댓글
- 송민지 : 로그인/회원가입, 메인페이지, 통합검색, 내 동네 설정하기
- 이상헌 : 중고거래
- 오용호 : 알바

## 💻개발 환경
- Version : Java17
- IDE : IntelliJ, Visual Studio Code
- Framework : SpringBoot
- ORM : JPA

## ⚙️기술 스택
- Frontend : React, JavaScript
- Backend : Spring, node.js,
- DataBase : MongoDB, Firebase
- 협업 관리 : Discord, Notion, Figma, Github

## 📟주요 기능
### ✔️ 로그인/회원가입
  - 전화번호 인증을 이용하여 로그인, 회원가입 로직을 통합하였음.
  - 기존 회원은 로그인 후 메인화면, 신규 회원은 회원 정보 등록 페이지로 이동함.
### ✔️ 중고거래
  -  
### ✔️ 알바
  - 
### ✔️ 동네생활
  - 동네생활 검색
    - 지역, 카테고리 필터를 통해 동네생활 게시글을 검색, 시간순으로 정렬.
  - 동네생활 생성, 수정, 삭제
    - 동네생활 게시글 작성 시 제목, 내용, 카테고리, 이미지 첨부 등을 통해 게시글을 작성하고 후에 수정 및 삭제 가능
  - 동네생활 게시글 댓글 기능
    - 해당 게시글마다 댓글을 작성 및 수정, 삭제 가능
### ✔️ 모임
  - 모임 검색
    - 지역, 카테고리 필터로 모임을 검색하고 시간순/이름순으로 정렬.
  - 모임 생성, 수정, 삭제
    - 모임 정보를 입력하여 모임 생성, 모임을 생성한 유저(모임장)이 모임 정보를 수정하거나 삭제 가능 
  - 모임 가입, 탈퇴, 가입 신청 관리
    - 생성된 모임에 가입 또는 탈퇴
    - 가입 신청이 필요한 모임의 경우 모임장이 가입 신청을 관리 
  - 모임 게시판
    - 자유게시판, 일정 게시판에서 게시글을 작성,열람,수정,삭제
    - 다른 유저가 작성한 일정에 참여할 수 있음
    - 사진이 첨부된 게시물을 앨범 형식으로 열람 가능
### ✔️ 마이페이지
  - 내 동네 설정
    - 부산 행정동 데이터를 GeoJSON 형식으로 변환하여 구글API로 불러온 지도 위에 투명하게 덮음.
    - 사용자가 모달을 통해 설정한 지역명을 비교 후 해당 지역만 스타일링 변경하여 사용자 설정 동네를 표시함.
    - 네비게이션 통해서 사용자가 클릭한 지역으로 지도 이동하여 확인할 수 있도록 함.

## ⛓️ERD
![ERD](https://github.com/busanit2024/daenggeun-project/blob/MJ-davie-forReadme/daenggeun.drawio.png)
