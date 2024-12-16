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

  const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  const validFiles = files.slice(0, 1); // 최대 1개로 제한

  if (validFiles.length > 0) {
    const newImages = await Promise.all(validFiles.map(async (file) => {
      console.log("Uploaded file:", file); // 파일 객체 확인
      const url = URL.createObjectURL(file); // 미리보기 URL 생성
      
      // singleFileUpload 호출 전에 파일 타입 확인
      if (!(file instanceof File)) {
        console.error("File is not an instance of File:", file);
        throw new Error("Uploaded file is not a valid File instance");
      }

      const uploadedImage = await singleFileUpload(file); // Firebase에 업로드
      return { url, ...uploadedImage }; // URL과 Firebase 정보 포함
    }));

    setImages(newImages);
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
