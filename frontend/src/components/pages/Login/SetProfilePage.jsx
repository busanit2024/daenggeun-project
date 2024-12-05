import React, { useState, useRef } from "react";
import Logo from "../../ui/Logo";
import InputText from "../../ui/InputText";
import Button from "../../ui/Button";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LocationSearchModal from "../../ui/LocationSearchModal";
import { singleFileUpload } from "../../../firebase";
import useGetUserId from "../../../utils/useGetUserId"; 

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 20px;  
    align-items: center;
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
        // selectedLocation이 문자열인지 확인
        if (typeof selectedLocation === 'string') {
            const [sigungu, emd] = selectedLocation.split(",").map(loc => loc.trim());
            
            const locationObject = {
                sido: "부산", // 시도는 하드코딩하거나 다른 방법으로 설정
                sigungu: sigungu,
                emd: emd
            };

            setUserLocation([locationObject]); // Location 객체의 리스트로 설정
            setIsModalOpen(false); 
        } else {
            console.error("선택된 위치가 문자열이 아닙니다:", selectedLocation);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB 제한
                alert('파일 크기는 5MB 이하여야 합니다.');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            setProfileImage(file);
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

            // 이미지가 선택된 경우에만 업로드
            if (profileImage) {
                const { url, filename } = await singleFileUpload(profileImage);
                console.log("이미지 업로드 성공. 파일 이름 : ", filename);
                profileImageData = { url, filename, filePath: "your/file/path/here" }; // filePath 추가
            }

            // userId를 쿼리 파라미터로 포함하여 프로필 저장
            await axios.post(`/user/profileSave/${userId}`, { 
                username, 
                userLocation, // Location 객체의 리스트로 전송
                profileImage: profileImageData 
            });
            alert("프로필이 성공적으로 저장되었습니다.");
            navigate("/"); 
        } catch (error) {
            console.error("프로필 저장 중 오류 발생:", error);
            alert("프로필 저장에 실패했습니다.");
        }
    };

    return (
        <Wrapper>
            <Logo variant="logoWithText" />
            <h3>우리 동네 중고 직거래</h3>
            <h4>
                당근마켓은 동네 직거래 마켓이에요.<br />
                내 동네를 설정하고 시작해보세요!
            </h4>
            <h3>내 동네 설정하기</h3>
            <InputText
                value={userLocation.map(loc => `${loc.sigungu}, ${loc.emd}`).join(", ")} 
                onClick={() => setIsModalOpen(true)}
                placeholder="지역이나 동네로 검색하기"
                readOnly 
                onChange={(e) => {    }}
            />
            {isModalOpen && (
                <LocationSearchModal onSelect={handleLocationSelect} onClose={() => setIsModalOpen(false)} />
            )}
            <Spacing />
            <h3>프로필 설정하기</h3>
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