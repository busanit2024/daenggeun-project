import React , { useState, useEffect } from "react";
import Logo from "../../ui/Logo";
import InputText from "../../ui/InputText";
import Button from "../../ui/Button";
import styled from "styled-components";
import SearchModal from "../../ui/LocationSearchModal";
import axios from "axios";

const Wrapper = styled.div`
    display : flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 20px;  
    align-items : center;
`;

const Spacing = styled.div`
    margin: 5px 0;
`;

const RecommendedList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RecommendedItem = styled.li`
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  &:hover {
    background: #f0f0f0;
  }
`;

export default function SetProfilePage(props) {
    const [ username, setUsername ] = useState("");
    const [ userLocation, setUserLocation ] = useState("");
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ recommendedLocations, setRecommendedLocations ] = useState([]);
    const [ profileImage, setProfileImage ] = useState(null);

    useEffect(() => {
        const fetchRecommendedLocations = async () => {
        try {
            const response = await axios.get("/api/data/locations");
            setRecommendedLocations(response.data);
        } catch (error) {
            console.error("추천 데이터 로드 실패:", error);
        }
        };
        fetchRecommendedLocations();
    }, []);

    const handleLocationSelect = (location) => {
        setUserLocation(location); 
        setIsModalOpen(false); 
      };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
    };

    const handleStart = async () => {
        if (!username || !location) {
            alert("닉네임과 지역 정보를 모두 입력해주세요!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("location", location);
            if (profileImage) {
                formData.append("profileImage", profileImage);
            }

            const sessionUid = window.sessionStorage.getItem("uid");

            await axios.post(
                `/user/profile`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${sessionUid}`, // Firebase UID를 사용
                    },
                }
            );

            alert("프로필이 성공적으로 저장되었습니다!");
            navigate("/"); // 메인 페이지로 이동
        } catch (error) {
            console.error("프로필 저장 실패:", error);
            alert("프로필 저장 중 문제가 발생했습니다.");
        }
    };

    return (
        <Wrapper>
            <Logo variant="logoWithText"  />
            <h3>우리 동네 중고 직거래</h3>
            <h4>
                당근마켓은 동네 직거래 마켓이에요.<br />
                내 동네를 설정하고 시작해보세요!
            </h4>
            <h3>내 동네 설정하기</h3>
            <InputText
                value={userLocation}
                onClick={() => setIsModalOpen(true)}
                placeholder="지역이나 동네로 검색하기"
                readOnly
            />
            {isModalOpen && (
                <SearchModal onClose={() => setIsModalOpen(false)}>
                <h4>지역 선택</h4>
                <InputText placeholder="지역 검색하기" />
                <RecommendedList>
                    {recommendedLocations.map((location, index) => (
                    <RecommendedItem
                        key={index}
                        onClick={() => handleLocationSelect(location)}
                    >
                        {location}
                    </RecommendedItem>
                    ))}
                </RecommendedList>
                </SearchModal>
            )}
            <Spacing />
            <h3>프로필 설정하기</h3>
            <Spacing />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <Spacing />
            <InputText 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="닉네임을 입력하세요"  />
            <Spacing /><Spacing />
            <Button
                title="댕근 시작하기"
                onClick={handleStart}
                variant="primary" />
        </Wrapper>
    );

};