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
  display: flex;
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

const ImageUpload = ({ img, onImageChange }) => {
  const [images, setImages] = useState(img || []);
  const inputRef = useRef(null); // input 참조

  console.log("images",images);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.slice(0, 1); // 최대 1개로 제한

    if (validFiles.length > 0) {
      const newImages = validFiles.map(file => {
        const url = URL.createObjectURL(file); // 파일 URL 생성
        return { url, file };
      });
  
      setImages(newImages); // 상태 업데이트
      onImageChange(newImages); // 부모 컴포넌트로 전달
    }
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
            <UploadedImage key={index} src={img.url} alt={`uploaded-${index}`} />
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
          {images.length} / 1
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
