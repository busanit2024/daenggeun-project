import { useOutletContext, useParams } from "react-router-dom";
import { Container } from "./GroupPageLayout";
import styled from "styled-components";
import { useEffect, useState } from "react";

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

const positionData = [
  { enum: 'ADMIN', name: '모임장' },
  { enum: 'MANAGER', name: '운영진' },
  { enum: 'MEMBER', name: '일반멤버' },
]

export default function MemberProfile() {
  const { group } = useOutletContext();
  const { memberId } = useParams();
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (group && group.members) {
      const id = memberId ?? sessionStorage.getItem('uid');
      const member = group?.members.find((member) => member.userId === id);
      setMember(member);
      console.log(member);
    }
  }, [group, memberId]);

  const calculateRegDate = (date) => {
    //오늘로부터 멤버 가입일까지의 날짜 차이 계산
    const today = new Date();
    const regDate = new Date(date);
    const diffTime = Math.abs(today - regDate);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    if (diffYears > 0) {
      return `${diffYears}년`;
    }
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    if (diffMonths > 0) {
      return `${diffMonths}개월`;
    }

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return `${diffDays}일`;
    }

    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours}시간`;
    }

    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    return `${diffMinutes}분`;
  }

  const getPosition = (position) => {
    return positionData.find((data) => data.enum === position)?.name;
  }

  return (
    <Container>
      <InnerContainer>
        <ProfileContainer>
          <ProfilePic>
            <img src={member?.profileImage?.url ?? '/images/defaultProfileImage.png'} alt="프로필 이미지" />
          </ProfilePic>
          <div className="nameWrap">
            <div className="name">{member?.username ?? '멤버이름'}</div>
            <div className="nickname">{member?.groupNickName ?? '모임 별명'}</div>
          </div>
        </ProfileContainer>

        <RecordContainer>
          <div className="recordItem">
            <div>게시글</div>
            <div>{member?.posts?.length ?? 0}</div>
          </div>
          <div className="recordItem">
            <div>댓글</div>
            <div>{member?.comments?.length ?? 0}</div>
          </div>
          <div className="recordItem">
            <div>참여한 일정</div>
            <div>{member?.assigns?.length ?? 0}</div>
          </div>
        </RecordContainer>

        <DescContainer>
          <div className="desc">소개글</div>
          <div className="moreinfo">
            <div>본인인증 완료</div>
            <div>{getPosition(member?.position)}</div>
            <div>{calculateRegDate(member?.registeredDate)} 전에 가입</div>
            <div>{member?.location?.[0]?.emd ?? '지역'}</div>
          </div>
        </DescContainer>

      </InnerContainer>

    </Container>
  );
}