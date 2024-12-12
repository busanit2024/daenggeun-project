import React, { useState, useRef } from "react";
import styled from "styled-components";

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px dashed #ccc;
  padding: 16px;
  border-radius: 8px;
  max-width: 350px;
  box-sizing: border-box;
`;

const ImagePlaceholder = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
  max-width: 350px;
  border: 1px solid #ccc;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  padding: 10px;
  box-sizing: border-box;
`;

const UploadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const CameraIcon = styled.img`
  width: 50px;
  height: 50px;
  cursor: pointer;
  margin: 0 auto;
  display: block;
`;

const ImageUpload = ({ onImageChange }) => {
  const [images, setImages] = useState([]);
  const inputRef = useRef(null); // input 참조

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.slice(0, 10 - images.length); // 최대 10개 제한
    setImages((prevImages) => {
      const newImages = [...prevImages, ...validFiles];
      onImageChange(newImages); // 부모 컴포넌트로 전달
      return newImages;
    });
    e.target.value = ""; // input 초기화
  };

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click(); // input 파일 선택 창 열기
    }
  };

  return (
    <ImageUploadContainer>
      <ImagePlaceholder onClick={triggerFileInput}>
        {images.length === 0 ? (
          <span 
            style={{ 
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              width: "100%",
              height: "100%",
            }}
          >
            이미지를 등록해주세요.
          </span>
        ) : (
          images.map((img, index) => (
            <UploadedImage key={index} src={URL.createObjectURL(img)} alt={`uploaded-${index}`} />
          ))
        )}
      </ImagePlaceholder>
      <div>
        <CameraIcon
          src="/images/icon/camera.svg"
          alt="카메라 아이콘"
          onClick={triggerFileInput} // 아이콘 클릭으로 파일 선택
        />
        <br />
        <span role="img" aria-label="upload" 
          style=
          {{ 
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center", 
          }}
        >
          {images.length} / 10
        </span>
      </div>
      <input
        id="image-upload"
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
    </ImageUploadContainer>
  );
};

export default ImageUpload;
