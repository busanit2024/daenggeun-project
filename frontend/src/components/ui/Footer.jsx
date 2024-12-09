import styled from "styled-components";

const StyledFooter = styled.footer`
display: flex;
flex-direction: column;
align-items: center;
width: 100%;
padding: 64px 0;
`;

const DownloadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 360px;
  width: 100%;
  overflow: hidden;

  background-color: #FFF8F3;

  & .inner-container {
    justify-content: space-between;
    display: flex;
    padding:  64px;
    width: 100%;
    max-width: 1280px;
  }

  & .download-text {
    display: flex;
    flex-direction: column;
    align-items: start;

    & h2 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
      color: #FF7B07;
    }

    & h1 {
      margin: 0;
      font-size: 36px;
      font-weight: bold;
      color: #212124;
    }

    & .download-buttons {
      display: flex;
      gap: 8px;
      margin-top: 8px;

      & .download-button {
        width: auto;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        & img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }

  & .download-image {
    display: flex;
    position: relative;
    flex-grow: 1;

    & .mockup {
      width: 240px;
      height: auto;
      position: absolute;
      border-radius: 24px;
      border: 4px solid #FFE2D2;
      overflow: hidden;

      & img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    & .left {
      top: -48px;
      left: 156px;
    }

    & .right {
      bottom: -98px;
      right: 0;
    }

    
    & .popup {
      width: 280px;
      height: auto;
      position: absolute;
      top: 120px;
      left: 96px;
      z-index: 1;

      & img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: contain;
        box-shadow: 0 4px 8px rgba(0,0,0, 0.1);
      }
    }

  }

  
`;

const SiteMap = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 64px 64px 48px 64px;
  border-bottom: 1px solid #e9ecef;
  width: 100%;
  max-width: 1280px;

  color: #212124;

  & .logos {
    display: flex;
    flex-direction: column;
    gap: 28px;
    align-items: start;
    justify-content: flex-start;

    & .logo {
    height: 30px;
    margin: 0;

    & img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  & .sns {
    display: flex;
    gap: 18px;

    & .sns-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    & img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  
  }
    
    
  } 
  }

  & .sitemap {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    font-size: 14px;


    & .sitemap_column {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-right: 64px;

      & h4 {
        font-size: 16px;
        font-weight: bold;
      }

      & p {
        margin: 0;
        cursor: pointer;
      }

      & p:hover {
        color: #727580;
      }
    }
  }

  
`;

const FooterText = styled.div`
    padding: 36px 64px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  color: #727580;
  width: 100%;
  max-width: 1280px;

  font-size: 14px;

  & p {
    margin: 0;
    & :first-child {
      font-weight: bold;
    }
  }

  & .inline {
    display: flex;
    gap: 8px;
  }

  & .company-name {
    font-weight: bold;
  }

  & .footer_links {
    font-weight: bold;
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }


`;


export default function Footer() {
  return (
    <StyledFooter>
      <DownloadContainer>
        <div className="inner-container">
          <div className="download-text">
            <h2>당근에서 가까운 이웃과 함께해요.</h2>
            <h1>지금 바로 다운로드하기</h1>
            <div className="download-buttons">
              <div className="download-button">
                <img src="/images/appstore.svg" alt="앱스토어" />
              </div>
              <div className="download-button">
                <img src="/images/googleplay.svg" alt="구글플레이" />
              </div>
            </div>
          </div>

          <div className="download-image">
            <div className="mockup left">
              <img src="/images/mockup.png" />
            </div>
            <div className="popup">
                <img src="/images/popup.png" />
            </div>
            <div className="mockup right">
              <img src="/images/mockup2.png" />
            </div>
          </div>
        </div>

      </DownloadContainer>

      <SiteMap>
        <div className="logos">
          <div className="logo">
            <img src="/images/logo/danggnlogo.svg" alt="당근마켓" />
          </div>

          <div className="sns">
            <div className="sns-icon">
              <img src="/images/icon/facebook.svg" alt="페이스북" />
            </div>
            <div className="sns-icon">
              <img src="/images/icon/instagram.svg" alt="인스타그램" />
            </div>
            <div className="sns-icon">
              <img src="/images/icon/youtube.svg" alt="유튜브" />
            </div>
          </div>
        </div>

        <div className="sitemap">
          <div className="sitemap_column">
            <h4>회사</h4>
            <p>회사 소개</p>
            <p>당근페이</p>
            <p>팀문화</p>
            <p>서비스 소개</p>
            <p>블로그</p>
            <p>채용</p>
          </div>

          <div className="sitemap_column">
            <h4>탐색</h4>
            <p>중고거래</p>
            <p>부동산</p>
            <p>중고차</p>
            <p>알바</p>
            <p>동네업체</p>
            <p>동네생활</p>
            <p>모임</p>
            <p>채팅하기</p>
            <p>이웃</p>
          </div>

          <div className="sitemap_column">
            <h4>비즈니스</h4>
            <p>당근 비즈니스</p>
            <p>제휴 문의</p>
            <p>광고 문의</p>
          </div>

          <div className="sitemap_column">
            <h4>Karrot</h4>
            <p>Canada</p>
            <p>United States</p>
            <p>United Kingdom</p>
            <p>日本</p>
          </div>

          <div className="sitemap_column">
            <h4>문의</h4>
            <p>IR</p>
            <p>PR</p>
            <p>고객센터</p>
          </div>
        </div>

      </SiteMap>






      <FooterText>
        <p className="company-name">(주) 댕근마켓</p>
        <div className="inline">
          <p><span>팀원</span> <span>정수현, 오용호, 이상헌, 송민지, 엄채연</span> </p>
          <span>|</span>
          <p>  <span>사업자번호</span> <span>375-87-00088</span> </p>
        </div>
        <p><span>직업정보제공사업 신고번호</span> <span>J1200020200016</span></p>
        <p><span>통신판매업 신고번호</span> <span>2021-서울서초-2875</span></p>
        <p><span>호스팅 사업자</span> <span>Amazon Web Service(AWS)</span></p>
        <p><span>주소</span> <span>서울특별시 구로구 디지털로 300, 10층 (당근서비스)</span></p>
        <div className="inline">
          <p><span>전화</span> <span>1544-9796</span></p>
          <span>|</span>
          <p><span>고객문의</span> <span>cs@daangnservice.com</span> </p>
        </div>

        <div className="footer_links">
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>운영정책</span>
          <span>위치기반서비스 이용약관</span>
          <span>이용자보호 비전과 계획</span>
          <span>청소년보호정책</span>
        </div>

      </FooterText>

    </StyledFooter>
  );
}