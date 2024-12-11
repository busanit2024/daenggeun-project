import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import RoundFilter from "../../ui/RoundFilter";
import { FaFileSignature, FaList, FaMapPin, FaReceipt, FaRegHeart, FaRegListAlt, FaShoppingBasket, FaUsers } from "react-icons/fa";
import { FaLocationCrosshairs, FaLocationDot, FaLocationPin, FaMapLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { calculateDate } from "../../../utils/calculateDate";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 24px;

    h1 {
        font-size: 24px;
        font-weight: bold;
        justify-self: flex-start;
        margin-right: auto;
    }
`;

const UserInfoBox = styled.div`
    display: flex;
    align-items: center;
    gap: 36px;
    width: 100%;
    padding: 24px;

    .userInfo {
        display: flex;
        flex-direction: column;
        gap:12px;
    }

        & .profileImage {
            width: 120px;
            height: 120px;
            overflow: hidden;
            border-radius: 50%;
            background-color: #dcdcdc;

            img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .userInfoText {
        display: flex;
        align-items: baseline;
        gap: 8px;
        .username {
            font-size: 32px;
            font-weight: bold;
        }

        .uniqueCode {
            font-size: 16px;
            color: #666666;
        }
    }
`;

export const ProfileBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    padding: 24px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;

    p {
        font-size: 18px;
        font-weight: bold;
    }

    .mannerTemp {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .innerContainer {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 8px;

        .innerTitle {
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
    }
`;


const mannerTemp = {
    worst: { min: 0, max: 12.5, label: 'worst' },
    bad: { min: 12.5, max: 30, label: 'bad' },
    defTemp: { min: 30, max: 37.5, label: 'defTemp' },
    warm: { min: 37.5, max: 42, label: 'warm' },
    good: { min: 42, max: 50, label: 'good' },
    hot: { min: 50, max: 99, label: 'hot' },
}


export default function MyPageMain(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const uid = sessionStorage.getItem('uid');
        if (!uid) return;
        axios.get(`/user/${uid}`).then((response) => {
            console.log(response.data); 
            setUser(response.data);
        }).catch((error) => {
            console.error('사용자 정보를 불러오는데 실패했습니다.' + error);
        });
    }, []);

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
        <Wrapper>
            <h1>마이페이지</h1>
            <UserInfoBox>
                <div className="profileImage">
                    <img src={user?.profileImage?.url ?? '/images/defaultProfileImage.png'} alt={user?.username} onError={(e) => e.target.src = '/images/defaultProfileImage.png'} />
                </div>

                <div className="userInfo">
                    <div className="userInfoText">
                        <h5 className="username">{user?.username ?? '닉네임'}</h5>
                        <span className="uniqueCode">#{user?.uniqueCode ?? '000000'}</span>
                        {/* <span className="regDate">{calculateDate(user?.registeredDate) ?? ''} 전 가입</span> */}
                    </div>
                    <Button title="프로필 수정" onClick={() => navigate('edit')} />
                </div>
            </UserInfoBox>

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
                    <div className="innerTitle">
                        <FaRegHeart />
                        <span>관심목록</span>
                    </div>
                    <div className="innerTitle">
                        <FaReceipt />
                        <span>판매내역</span>
                    </div>
                    <div className="innerTitle">
                        <FaShoppingBasket />
                        <span>구매내역</span>
                    </div>

                </div>
            </ProfileBox>

            <ProfileBox>
                <p>나의 활동</p>
                <div className="innerContainer">
                    <div className="innerTitle">
                        <FaFileSignature />
                        <span>내 동네생활 글</span>
                    </div>

                    <div className="innerTitle">
                        <FaUsers />
                        <span>참여중인 모임</span>
                    </div>
                </div>
            </ProfileBox>
            <ProfileBox>
                <p>설정</p>
                <div className="innerContainer">
                    <div className="innerTitle">
                        <FaLocationDot />
                        <span>내 동네 설정</span>
                    </div>

                    <div className="innerTitle">
                        <FaLocationCrosshairs />
                        <span>동네 인증하기</span>
                    </div>
                </div>
            </ProfileBox>


        </Wrapper>
    );
}