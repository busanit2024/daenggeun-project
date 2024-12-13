import { useOutletContext, useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { calculateDate } from "../../utils/calculateDate";
import InputText from "../ui/InputText";
import { FaEdit, FaPen } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import Button from "../ui/Button";
import axios from "axios";
import RoundFilter from "../ui/RoundFilter";
import MyPageList from "../mypage/MyPageList";



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

  .mannerTempWrap{
  display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .name {
    font-size: 18px;
    font-weight: bold;
    display: flex;
    gap: 4px;
    align-items: center;
  }
.nickname {
    color: #666666;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .nickname-input {
    display: flex;
    gap: 4px;
    align-items: center;
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

export default function AlbaMemberProfile({userId}) {
  const { memberId } = useParams();
  console.log("useParams memberId:", memberId);
  const [member, setMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [user, setUser] = useState(null); // 사용자 데이터 상태

  
  const id = memberId ?? sessionStorage.getItem('uid');
  console.log("sessionStorage uid:", sessionStorage.getItem('uid'));
  useEffect( () => {
    fetchMemberInfo(userId);
   
    // const member = group?.members.find((member) => member.userId === id);
    // setMember(member);
    // setNickname(member?.groupNickName);
    // console.log(member);
    
  }, []);


  const fetchMemberInfo = (userId) => {
    console.log("userId:",userId);
    axios.get(`/user/find?uid=${userId}`).then((response) => {
      console.log("Member 정보:",response.data);
      setMember(response.data);
      }).catch((error) => {
        console.error("사용자 정보 불러오기에 실패했습니다." + error);
      });    
};
  
console.log("member.location:", member?.location);
console.log("member.location.emd:", member?.location?.emd);


const mannerTemp = {
  worst: { min: 0, max: 12.5, label: 'worst' },
  bad: { min: 12.5, max: 30, label: 'bad' },
  defTemp: { min: 30, max: 37.5, label: 'defTemp' },
  warm: { min: 37.5, max: 42, label: 'warm' },
  good: { min: 42, max: 50, label: 'good' },
  hot: { min: 50, max: 99, label: 'hot' },
}
const getMannerTemp = (temp) => {
  if (temp >= mannerTemp.worst.min && temp < mannerTemp.worst.max) {
      return 'worst';
  } else if (temp >= mannerTemp.bad.min && temp < mannerTemp.bad.max) {
      return 'bad';
  } else if (temp >= mannerTemp.defTemp.min && temp < mannerTemp.defTemp.max) {
      return 'defTemp';
  } else if (temp >= mannerTemp.warm.min && temp < mannerTemp.warm.max) {
      return 'warm';
  } else if (temp >= mannerTemp.good.min && temp < mannerTemp.good.max) {
      return 'good';
  } else if (temp >= mannerTemp.hot.min && temp < mannerTemp.hot.max) {
      return 'hot';
  }
}




  return (
    <>
      <InnerContainer>
        <ProfileContainer>
          <ProfilePic>
            <img src={member?.profileImage?.url ?? '/images/defaultProfileImage.png'} alt="프로필 이미지" onError={(e) => e.target.src = '/images/defaultProfileImage.png'} />
          </ProfilePic>
          <div className="nameWrap">
          <div className="name">            
            {member?.username ?? "멤버이름"}<br></br>
            {member?.location
                              ?.find(item => item.emd) // emd 필드가 있는 첫 번째 요소 찾기,당 요소의 emd 값 출력, 없으면 "지역" 출력
                              ?.emd || "지역"} 
          </div>
          </div>

          <div className="mannerTempWrap">{member?.position !== "MEMBER" && (
              <p className="nannerTemp"><RoundFilter variant={getMannerTemp(user?.mannerTemp ?? 36.5)} title={`${user?.mannerTemp ?? '36.5'}℃`} />매너온도</p>
            )}
          </div>

        </ProfileContainer>
      </InnerContainer>

    </>
  );
}