import React, { useState, useRef } from "react";
import Logo from "../../ui/Logo";
import InputText from "../../ui/InputText";
import Button from "../../ui/Button";
import styled, { keyframes } from "styled-components"; // keyframes 추가
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LocationSearchModal from "../../ui/LocationSearchModal";
import { singleFileUpload } from "../../../firebase";
import { compressImage } from "../../../firebase";
import useGetUserId from "../../../utils/useGetUserId"; 

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 20px;  
    align-items: center;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
`;

// 애니메이션 정의
const fadeInUp = keyframes`
    0% {
        transform: translateY(20px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
`;

const AnimatedH3 = styled.h3`
    animation: ${fadeInUp} 0.5s ease forwards;
    animation-delay: ${(props) => props.delay || '0s'}; // 지연 시간 설정
`;

const AnimatedH4 = styled.h4`
    animation: ${fadeInUp} 0.5s ease forwards;
    animation-delay: ${(props) => props.delay || '0.5s'}
`;

const Spacing = styled.div`
    margin: 5px 0;
`;

const ProfileImageWrapper = styled.div`
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 75px;
    overflow: hidden;
    border: 2px solid #eee;
    margin: 20px 0;
    cursor: pointer;
    transition: border-color 0.2s ease;
    z-index: 1;

    &:hover {
        border-color: #ddd;
    }
`;

const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const DefaultProfileImage = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    color: #999;
`;

const ImageDeleteButton = styled.button`
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default function SetProfilePage(props) {
    const [username, setUsername] = useState("");
    const [userLocation, setUserLocation] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const fileInput = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    const userId = useGetUserId(window.sessionStorage.getItem("uid"));

    const handleLocationSelect = (selectedLocation) => {
        if (typeof selectedLocation === 'string') {
            const [sigungu, emd] = selectedLocation.split(",").map(loc => loc.trim());
            
            const locationObject = {
                sigungu: sigungu,
                emd: emd
            };

            setUserLocation([locationObject]);
            setIsModalOpen(false); 
        } else {
            console.error("선택된 위치가 문자열이 아닙니다:", selectedLocation);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB 제한
                alert('파일 크기는 5MB 이하여야 합니다.');
                return;
            }
            
            try {
                const compressedFile = await compressImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(compressedFile); 
                setProfileImage(compressedFile); 
            } catch (error) {
                console.error('이미지 압축 중 오류 발생:', error);
            }
        }
    };

    const handleImageDelete = () => {
        setProfileImage(null);
        setPreviewImage(null);
        if (fileInput.current) {
            fileInput.current.value = '';
        }
    };

    const handleStart = async () => {
        if (!username || userLocation.length === 0) {
            alert("닉네임과 지역 정보를 모두 입력해주세요!");
            return;
        }

        if (!userId) {
            alert("유효한 사용자 ID가 없습니다.");
            return;
        }

        try {
            let profileImageData = null;

            if (profileImage) {
                const { url, filename } = await singleFileUpload(profileImage);
                console.log("이미지 업로드 성공. 파일 이름 : ", filename);
                profileImageData = { url, filename }; 
            }

            await axios.post(`/user/profileSave/${userId}`, { 
                username, 
                userLocation,
                profileImage: profileImageData
            });
            alert("프로필이 성공적으로 저장되었습니다.");
            navigate("/"); 
            window.location.reload();
        } catch (error) {
            console.error("프로필 저장 중 오류 발생:", error);
            alert("프로필 저장에 실패했습니다.");
        }
    };

    return (
        <Wrapper>
            <TextContainer>
                <Logo variant="logoWithText" />
                <AnimatedH3 delay="0s">우리 동네 중고 직거래</AnimatedH3>
                <AnimatedH4 delay="0.5s">
                    당근마켓은 동네 직거래 마켓이에요.<br />
                    내 동네를 설정하고 시작해보세요!
                </AnimatedH4>
            </TextContainer>
            <Spacing />
            <AnimatedH3 delay="1s">내 동네 설정하기</AnimatedH3>
            <InputText
                value={userLocation.map(loc => `${loc.sigungu}, ${loc.emd}`).join(", ")} 
                onClick={() => setIsModalOpen(true)}
                placeholder="지역이나 동네로 검색하기"
                readOnly 
                onChange={(e) => { }}
            />
            {isModalOpen && (
                <LocationSearchModal onSelect={handleLocationSelect} onClose={() => setIsModalOpen(false)} />
            )}
            <Spacing />
            <AnimatedH3 delay="1.5s">프로필 설정하기</AnimatedH3>
            <Spacing />
            <ProfileImageWrapper onClick={() => fileInput.current?.click()}>
                {previewImage ? (
                    <>
                        <ProfileImage src={previewImage} alt="프로필 이미지" />
                        <ImageDeleteButton onClick={(e) => {
                            e.stopPropagation();
                            handleImageDelete();
                        }}>×</ImageDeleteButton>
                    </>
                ) : (
                    <DefaultProfileImage>
                        📷
                    </DefaultProfileImage>
                )}
            </ProfileImageWrapper>
            <input
                type="file"
                ref={fileInput}
                style={{ display: "none" }}
                onChange={handleImageChange}
            />
            <Spacing />
            <InputText 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="닉네임을 입력하세요"  
            />
            <Spacing />
            <Button
                title="댕근 시작하기"
                onClick={handleStart}
                variant="primary" 
            />
        </Wrapper>
    );
};