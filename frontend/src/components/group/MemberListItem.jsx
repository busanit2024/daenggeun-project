import { useLocation, useNavigate } from "react-router-dom";
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
    display: flex;
    gap: 4px;
  }

  .nickname {
    color: #666666;
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
  const naviagte = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    const currentPath = location.pathname;
    const myId = sessionStorage.getItem('uid');
    if (member?.userId === myId) {
      naviagte('my');
    } else if (currentPath.endsWith("members")) {
      naviagte(`${currentPath}/${member?.userId}`);
    } else {
      naviagte(`members/${member?.userId}`);
    }
  }
  return (
    <Wrapper onClick={handleClick}>
      <ProfileImage>
        {<img src={member?.profileImage ?? '/images/defaultProfileImage.png'} alt={member?.name} />}
      </ProfileImage>
      <MemberInfo>
        <div className="name-wrap">
          <div className="name">{member?.username ?? '이름'} <span className="nickname">({member?.groupNickName ?? '그룹 별명'})</span></div>
          <div className="location">{member?.location?.[0]?.emd ?? '지역'}</div>
        </div>
        <div className="desc">소개</div>
      </MemberInfo>


    </Wrapper>
  );
}