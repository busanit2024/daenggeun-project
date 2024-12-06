import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
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
    align-items: center;
  }
  .name {
    font-size: 16px;
    display: flex;
    gap: 4px;
    align-items: center;
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
        {<img src={member?.profileImage?.url ?? '/images/defaultProfileImage.png'} alt={member?.name} onError={(e) => e.target.src = '/images/defaultProfileImage.png'}/>}
      </ProfileImage>
      <MemberInfo>
        <div className="name-wrap">
          <div className="name">{member?.username ?? '이름'}
            {member.groupNickName && <span className="nickname">({member?.groupNickName ?? '그룹 별명'})</span> }
            {member?.position !== 'MEMBER' &&
              <img height={18} src={`/images/icon/group_${member?.position?.toLowerCase()}.svg`} alt={member?.position} />
            }
          </div>
          <div className="location">{member?.location?.[0]?.emd ?? '지역'}</div>
        </div>
        <div className="desc">소개</div>
      </MemberInfo>


    </Wrapper>
  );
}