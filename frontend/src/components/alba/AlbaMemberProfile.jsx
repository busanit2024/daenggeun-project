import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import RoundFilter from "../ui/RoundFilter";

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px; /* 둥근 모서리 */
  border: 1px solid #eaeaea; /* 테두리를 흰색 또는 투명으로 설정 */
  box-shadow: none; /* 그림자 제거 */
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px; /* 프로필 이미지와 이름 사이 간격 */
`;

const ProfilePic = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%; /* 원형 이미지 */
  overflow: hidden;
  background-color: #dcdcdc;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지 비율 유지 */
  }
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: bold;

  .location {
    color: #666666;
    font-size: 14px;
    font-weight: normal;
  }
`;

const MannerTempContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;

  .temp {
    font-size: 18px;
    font-weight: bold;
    color:rgb(255, 0, 0); /* 매너온도 색상 */
  }
`;

export default function AlbaMemberProfile({ userId }) {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);

  useEffect(() => {
    const fetchMemberInfo = async (userId) => {
      try {
        const response = await axios.get(`/user/find?uid=${userId}`);
        setMember(response.data);
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error);
      }
    };

    if (userId) {
      fetchMemberInfo(userId);
    }
  }, [userId]);

  const mannerTemp = {
    worst: { min: 0, max: 12.5, label: "worst" },
    bad: { min: 12.5, max: 30, label: "bad" },
    defTemp: { min: 30, max: 37.5, label: "defTemp" },
    warm: { min: 37.5, max: 42, label: "warm" },
    good: { min: 42, max: 50, label: "good" },
    hot: { min: 50, max: 99, label: "hot" },
  };

  const getMannerTemp = (temp) => {
    if (temp >= mannerTemp.worst.min && temp < mannerTemp.worst.max) {
      return "worst";
    } else if (temp >= mannerTemp.bad.min && temp < mannerTemp.bad.max) {
      return "bad";
    } else if (temp >= mannerTemp.defTemp.min && temp < mannerTemp.defTemp.max) {
      return "defTemp";
    } else if (temp >= mannerTemp.warm.min && temp < mannerTemp.warm.max) {
      return "warm";
    } else if (temp >= mannerTemp.good.min && temp < mannerTemp.good.max) {
      return "good";
    } else if (temp >= mannerTemp.hot.min && temp < mannerTemp.hot.max) {
      return "hot";
    }
  };

  if (!member) return null;

  return (
    <CardContainer>
      <ProfileContainer>
        <ProfilePic>
          <img
            src={member?.profileImage?.url ?? "/images/default/defaultProfileImage.png"}
            alt="프로필 이미지"
            onError={(e) => (e.target.src = "/images/default/defaultProfileImage.png")}
          />
        </ProfilePic>
        <NameWrapper>
          <div>{member?.username ?? "멤버이름"}</div>
          <div className="location">
            {member?.location?.find((item) => item.emd)?.emd || "지역"}
          </div>
        </NameWrapper>
      </ProfileContainer>
      <MannerTempContainer>
        {member?.position !== "MEMBER" && (
          <>
            <div className="temp">{member?.mannerTemp ?? "98.3"}℃</div>
            <div>매너온도</div>
          </>
        )}
      </MannerTempContainer>
    </CardContainer>
  );
}
