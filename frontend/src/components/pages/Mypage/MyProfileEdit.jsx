import React, { useEffect, useState } from "react";
import InputText from "../../ui/InputText";
import styled from "styled-components";
import { ProfileBox, Wrapper } from "./MyPageMain";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../ui/Button";
import { singleFileUpload } from "../../../firebase";

const EditNickname = styled.input`
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 24px;
    font-weight: bold;
`;

const CustomFileInput = styled.input`
    display: none;
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

    & .profileImageWrap {
        position: relative;
        
        & label {
            cursor: pointer;
            position: absolute;
            bottom: 0;
            right: 0;
            width: 32px;
            height: 32px;

            img {
                width: 100%;
                height: 100%;
            }
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




export default function MyProfileEdit(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const uid = sessionStorage.getItem('uid');
        if (!uid) return;
        axios.get(`/user/${uid}`).then((response) => {
            setUser(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.error('사용자 정보를 불러오는데 실패했습니다.' + error);
        });
    }, []);

    const getProfileImageUrl = () => {
        if (profileImage) {
            return URL.createObjectURL(profileImage);
        }
        return user?.profileImage?.url ?? '/images/defaultProfileImage.png';
    }

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
    }

    const handleUpdate = async () => {
        /// 프로필 업데이트
    }




    return (
        <Wrapper>
            <h1>회원정보 수정</h1>
            <UserInfoBox>
                <div className="profileImageWrap">
                    <div className="profileImage">
                        <img src={getProfileImageUrl()} alt={user?.username} onError={(e) => e.target.src = '/images/defaultProfileImage.png'} />
                    </div>
                    <CustomFileInput type="file" accept="image/*" id="profileImage" onChange={handleProfileImageChange} />
                    <label htmlFor="profileImage">
                        <img src="/images/icon/camera.svg" alt="프로필 이미지 수정" />
                    </label>

                </div>


                <div className="userInfo">
                    <div className="userInfoText">
                        <EditNickname type="text" value={user?.username ?? '닉네임'} onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))} />
                        <span className="uniqueCode">#{user?.uniqueCode ?? '000000'}</span>
                    </div>
                </div>
            </UserInfoBox>

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '24px 120px' }}>
                <label htmlFor="email">이메일</label> 
                <InputText id='email' grow value={user?.email ?? ''} placeholder="등록할 이메일을 입력하세요." />
            </div>

            <div style={{ width: '100%', display: 'flex', padding: '24px 120px' }}>
                <Button title="저장" grow onClick={handleUpdate} variant="primary" />
            </div>


        </Wrapper>

    );
}
