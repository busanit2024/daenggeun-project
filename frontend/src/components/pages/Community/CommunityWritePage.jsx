import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getApps, initializeApp } from "firebase/app"; // Firebase App import
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage import

// Firebase configuration
const firebaseConfig = {
  // Your Firebase configuration
};

// Firebase 초기화
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storage = getStorage();

const Container = styled.div`
  padding: 16px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 8px; /* 제목과 내용 사이의 간격 조정 */
  font-size: 18px; /* 제목 크기 조정 */
  font-weight: bold; /* 제목 볼드체 */
`;

const ContentInput = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
`;

const CategorySelect = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
`;

const ImageInput = styled.input`
  margin-bottom: 16px;
`;

const LocationButton = styled.button`
  margin-bottom: 16px;
`;

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    axios.get("/api/data/filter?name=groupCategory").then((response) => {
      setCategories(response.data.filters);
    })
    .catch((error) => {
      console.error("카테고리를 불러오는데 실패했습니다." + error);
    });
  }, []);

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setImageUrl(url);
  };

  const handleSubmit = async () => {
    const postData = {
      title,
      content,
      category: selectedCategory,
      image: imageUrl,
      // 위치 정보 추가 필요
    };
    console.log(postData);
    // API 호출하여 게시글 저장
    // navigate("/community"); // 작성 후 커뮤니티 페이지로 이동
  };

  return (
    <Container>
      <h2>동네생활 글쓰기</h2>
      <CategorySelect onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
        <option value="">카테고리 선택</option>
        {categories.map((category) => (
          <option key={category.name} value={category.name}>{category.name}</option>
        ))}
      </CategorySelect>
      <TitleInput 
        type="text" 
        placeholder="제목을 입력하세요" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <ContentInput 
        placeholder="ㅇㅇ동 이웃과 이야기를 나눠보세요." 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
      />
      <ImageInput 
        type="file" 
        accept="image/*" 
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            handleImageUpload(file);
          }
        }} 
      />
      <LocationButton onClick={() => alert("위치 선택 기능 추가 필요")}>
        위치 선택
      </LocationButton>
      <button onClick={handleSubmit}>게시글 작성</button>
    </Container>
  );
}