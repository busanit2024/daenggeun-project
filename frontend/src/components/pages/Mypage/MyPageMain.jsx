import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import { Outlet, useNavigate } from "react-router-dom";

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

export const UserInfoBox = styled.div`
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
            border: 1px solid #e0e0e0;

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
            cursor: pointer;

            &:hover {
                color: #666666;
            }
        }
    }
`;

export const ListContainer = styled.div`
    border-top: 1px solid #dcdcdc;
    display: flex;
    width: 100%;
    align-items: center;
    flex-direction: column;
    gap: 16px;
    padding: 24px 36px;

    & h3 {
        align-self: start;
        font-size: 24px;
        margin-bottom: 24px;
    }
`;


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

            <Outlet context={{ user }} />

        </Wrapper>
    );
}