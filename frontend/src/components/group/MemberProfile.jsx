import { useOutletContext, useParams } from "react-router-dom";
import { Container } from "./GroupPageLayout";
import styled from "styled-components";

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
  padding: 24px 48px;
`;

const ProfileContainer = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  
  .nameWrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .name {
    font-size: 18px;
    font-weight: bold;
  }
.nickname {
    color: #666666;
  }
`;

const ProfilePic = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #dcdcdc;
  overflow: hidden;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RecordContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  
  .recordItem:not(:last-child) {
    border-right: 1px solid #dcdcdc;
  }

  .recordItem {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
  }
`;

const DescContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .desc {
    margin-bottom: 32px;
  }

  .moreinfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: #666666;
  }
`;

export default function MemberProfile() {
  const { group } = useOutletContext();
  const { memberId } = useParams();

  console.log(memberId);

  return (
    <Container>
      <InnerContainer>
        <ProfileContainer>
          <ProfilePic>
            <img src="/images/default_profile_image.jpg" alt="프로필 이미지" />
          </ProfilePic>
          <div className="nameWrap">
            <div className="name">멤버이름</div>
            <div className="nickname">모임 별명</div>
          </div>
        </ProfileContainer>

        <RecordContainer>
          <div className="recordItem">
            <div>게시글</div>
            <div>0</div>
          </div>
          <div className="recordItem">
            <div>댓글</div>
            <div>0</div>
          </div>
          <div className="recordItem">
            <div>참여한 일정</div>
            <div>0</div>
          </div>
        </RecordContainer>

        <DescContainer>
          <div className="desc">소개글</div>
          <div className="moreinfo">
            <div>본인인증 완료</div>
            <div>직책 가입일</div>
            <div>지역</div>
          </div>
        </DescContainer>

      </InnerContainer>

    </Container>
  );
}