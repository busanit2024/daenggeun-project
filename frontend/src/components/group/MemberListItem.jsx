import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const ProfileImage = styled.div`
  width: 48px;
  height: 48px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #dcdcdc;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .name-wrap {
    display: flex;
    gap: 8px;
  }
  .name {
    font-size: 16px;
  }
  .location {
    color: #666666;
  }

  .desc {
    color: #666666;
  }
`;

export default function MemberListItem(props) {
  const { member } = props;
  return (
    <Wrapper>
      <ProfileImage>
        {member?.profileImage && <img src={member?.profileImage} alt={member?.name} />}
      </ProfileImage>
      <MemberInfo>
        <div className="name-wrap">
          <div className="name">이름</div>
          <div className="location">지역</div>
        </div>
        <div className="desc">소개</div>
      </MemberInfo>


    </Wrapper>
  );
}