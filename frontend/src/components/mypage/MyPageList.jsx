import { useNavigate, useOutletContext } from "react-router-dom";
import { ProfileBox } from "../pages/Mypage/MyPageMain";
import RoundFilter from "../ui/RoundFilter";
import { FaFileSignature,  FaReceipt, FaRegHeart, FaShoppingBasket, FaUsers } from "react-icons/fa";
import { FaLocationCrosshairs, FaLocationDot, } from "react-icons/fa6";

const mannerTemp = {
  worst: { min: 0, max: 12.5, label: 'worst' },
  bad: { min: 12.5, max: 30, label: 'bad' },
  defTemp: { min: 30, max: 37.5, label: 'defTemp' },
  warm: { min: 37.5, max: 42, label: 'warm' },
  good: { min: 42, max: 50, label: 'good' },
  hot: { min: 50, max: 99, label: 'hot' },
}

export default function MyPageList() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

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
      <ProfileBox>
                <div className="mannerTemp">
                    <p>매너온도</p>
                    <RoundFilter variant={getMannerTemp(user?.mannerTemp ?? 36.5)} title={`${user?.mannerTemp ?? '36.5'}℃`} />
                </div>


        </ProfileBox>

        {/* 나의 거래  */}
        <ProfileBox>
            <p>나의 거래</p>
            <div className="innerContainer">
                {/* <div className="innerTitle">
                    <FaRegHeart />
                    <span>관심목록</span>
                </div> */}
                <div className="innerTitle" onClick={() => navigate("trade")}>
                    <FaReceipt />
                    <span>판매내역</span>
                </div>
                {/* <div className="innerTitle">
                    <FaShoppingBasket />
                    <span>구매내역</span>
                </div> */}

            </div>
        </ProfileBox>

        <ProfileBox>
            <p>나의 활동</p>
            <div className="innerContainer">
                <div className="innerTitle" onClick={() => navigate("community")}>
                    <FaFileSignature />
                    <span>내 동네생활 글</span>
                </div>

                <div className="innerTitle" onClick={() => navigate("group")}>
                    <FaUsers />
                    <span>참여중인 모임</span>
                </div>
            </div>
        </ProfileBox>
        <ProfileBox>
            <p>설정</p>
            <div className="innerContainer">
                <div className="innerTitle" onClick={() => navigate("location")}>
                    <FaLocationDot />
                    <span>내 동네 설정</span>
                </div>

                <div className="innerTitle">
                    <FaLocationCrosshairs />
                    <span>동네 인증하기</span>
                </div>
            </div>
        </ProfileBox>
    </>
  );
}