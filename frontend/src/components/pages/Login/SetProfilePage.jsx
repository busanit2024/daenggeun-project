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
    padding: 40px;  
    align-items: center;
    background-color: #FFF9F5;
    font-family:noto-sans
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 48px;
`;

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
    animation-delay: ${(props) => props.delay || '0s'};
    color: #FF7B07;
    font-size: 24px;
    margin: 16px 0;
`;

const AnimatedH4 = styled.h4`
    animation: ${fadeInUp} 0.5s ease forwards;
    animation-delay: ${(props) => props.delay || '0.5s'};
    color: #666;
    font-weight: normal;
    line-height: 1.6;
    margin: 8px 0;
`;

const Spacing = styled.div`
    margin: 12px 0;
`;

const ProfileImageWrapper = styled.div`
    position: relative;
    width: 180px;
    height: 180px;
    border-radius: 90px;
    overflow: hidden;
    border: 3px solid #FFE8D6;
    margin: 24px 0;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &:hover {
        border-color: #FF7B07;
        transform: translateY(-2px);
    }
`;

const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
`;


const DefaultProfileImage = styled.div`
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 64px;
    color: #FFE8D6;
    transition: all 0.3s ease;

    &:hover {
        color: #FF7B07;
        background-color: #FFF9F5;
    }
`;

const ImageOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;

    ${ProfileImageWrapper}:hover & {
        opacity: 1;
    }
`;

const ImageDeleteButton = styled.button`
    background: #FF7B07;
    color: white;
    border: 2px solid white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    transition: all 0.2s ease;

    &:hover {
        background: #FF8D2B;
        transform: rotate(90deg);
    }
`;

const StyledInputText = styled(InputText)`
    width: 320px;
    padding: 16px;
    border: 2px solid #FFE8D6;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.2s ease;

    &:focus {
        border-color: #FF7B07;
        box-shadow: 0 0 0 4px rgba(255, 123, 7, 0.1);
    }

    &::placeholder {
        color: #999;
    }
`;

const StyledButton = styled(Button)`
    padding: 16px;
    margin-top: 30px;
    font-size: 18px;
    font-weight: bold;
    transition: all 0.3s ease;
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    width: 400px;
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
                emd: emd || ''
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
            <FormContainer>
                <AnimatedH3 delay="1s">내 동네 설정하기</AnimatedH3>
                <StyledInputText
                    value={userLocation.map(loc => loc.emd? `${loc.sigungu}, ${loc.emd}` : loc.sigungu).join(", ")} 
                    onClick={() => setIsModalOpen(true)}
                    placeholder="지역이나 동네로 검색하기"
                    readOnly 
                />
                {isModalOpen && (
                    <LocationSearchModal onSelect={handleLocationSelect} onClose={() => setIsModalOpen(false)} />
                )}
                <Spacing />
                <AnimatedH3 delay="1.5s">프로필 설정하기</AnimatedH3>
                <ProfileImageWrapper onClick={() => fileInput.current?.click()}>
                    {previewImage ? (
                        <>
                            <ProfileImage src={previewImage} alt="프로필 이미지" />
                            <ImageOverlay>
                                <ImageDeleteButton 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleImageDelete();
                                    }}
                                >
                                    ×
                                </ImageDeleteButton>
                            </ImageOverlay>
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
                    accept="image/*"
                />
                <StyledInputText 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="닉네임을 입력하세요"  
                />                
            </FormContainer>
            <StyledButton
                onClick={handleStart}
                title="댕근 시작하기"
                variant="primary"
                width="400px"
                style={{ marginTop: '20px' }}
            />
        </Wrapper>
    );
};