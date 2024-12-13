import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import RoundFilter from "../ui/RoundFilter";

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

  .mannerTempWrap {
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

export default function AlbaMemberProfile({ userId }) {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);

  // 사용자 정보 가져오기
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
  }, [userId]); // userId가 변경될 때마다 실행

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

  if (!member) return null; // 데이터를 로드 중일 때는 아무것도 표시하지 않음

  return (
    <InnerContainer>
      <ProfileContainer>
        <ProfilePic>
          <img
            src={member?.profileImage?.url ?? "/images/default/defaultProfileImage.png"}
            alt="프로필 이미지"
            onError={(e) => (e.target.src = "/images/default/defaultProfileImage.png")}
          />
        </ProfilePic>
        <div className="nameWrap">
          <div className="name">
            {member?.username ?? "멤버이름"}
            <br />
            {member?.location?.find((item) => item.emd)?.emd || "지역"}
          </div>
        </div>
        <div className="mannerTempWrap">
          {member?.position !== "MEMBER" && (
            <p className="nannerTemp">
              <RoundFilter
                variant={getMannerTemp(member?.mannerTemp ?? 36.5)}
                title={`${member?.mannerTemp ?? "36.5"}℃`}
              />
              매너온도
            </p>
          )}
        </div>
      </ProfileContainer>
    </InnerContainer>
  );
}
