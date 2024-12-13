import React, { useEffect, useState } from "react";
import InputText from "../../ui/InputText";
import styled from "styled-components";
import { ProfileBox, Wrapper } from "./MyPageMain";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../ui/Button";
import { deleteFile, singleFileUpload } from "../../../firebase";
import useGetUserId from "../../../utils/useGetUserId";
import LocationSearchModal from "../../ui/LocationSearchModal";

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

const InputBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;


    & .inputInner {
        display: flex;
        gap: 24px;
        padding: 24px 36px;
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
            console.log(response.data);
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
        return user?.profileImage?.url ?? '/images/default/defaultProfileImage.png';
    }

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
    }

    const handleUpdate = async () => {
        singleFileUpload(profileImage).then( async (response) => {
            if (user.profileImage) {
            await deleteFile(user.profileImage.filename);
            }
            const newProfileImage = response;
            axios.post(`/user/profileSave/${user.id}`, 
                {
                    id: user.id,
                    uid: user.uid,
                    username: user.username,
                    email: user.email,
                    userLocation: user.location,
                    profileImage: newProfileImage,
                }
            ).then((response) => {
                console.log(response.data);
                alert('회원정보가 수정되었습니다.');
                navigate('/mypage');
            }).catch((error) => { 
                console.error('회원정보 수정 중 오류 발생:', error);
                alert('회원정보 수정에 실패했습니다. 다시 시도해 주세요.');
            });
        }).catch((error) => {
            console.error('이미지 업로드 중 오류 발생:', error);
        });
    }




    return (
        <Wrapper>
            <h1>회원정보 수정</h1>
            <UserInfoBox>
                <div className="profileImageWrap">
                    <div className="profileImage">
                        <img src={getProfileImageUrl()} alt={user?.username} onError={(e) => e.target.src = '/images/default/defaultProfileImage.png'} />
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

            <InputBox>
                <div className="inputInner">
                    <h3>이메일</h3>
                    <InputText id='email' value={user?.email ?? ''} placeholder="등록할 이메일을 입력하세요." />
                </div>

            </InputBox>



            <div style={{ width: '100%', display: 'flex', padding: '24px 120px' }}>
                <Button title="저장" grow onClick={handleUpdate} variant="primary" />
            </div>


        </Wrapper>

    );
}
