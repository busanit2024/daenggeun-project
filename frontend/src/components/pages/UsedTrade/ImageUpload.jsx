import React, { useState } from "react";
import styled from "styled-components";

const ImageUploadContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  border: 1px dashed #ccc;
  padding: 16px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const ImagePlaceholder = styled.div`
  width: 350px;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const UploadedImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const CameraIcon = styled.img`
  width: 50px;  /* 원하는 크기로 조정 */
  height: 50px; /* 원하는 크기로 조정 */
`;

const ImageUpload = () => {
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files].slice(0, 10));
  };

  return (
    <ImageUploadContainer>
      {images.map((img, index) => (
        <UploadedImage key={index} src={URL.createObjectURL(img)} alt={`uploaded-${index}`} />
      ))}
      {images.length < 10 && (
        <ImagePlaceholder>
          <label htmlFor="image-upload">
            <span role="img" aria-label="upload" style={{ alignItems: "center" }}>
              <CameraIcon src="/images/icon/camera.svg" alt="카메라 아이콘" />
              <br/>
              {images.length} / 10
            </span>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </ImagePlaceholder>
      )}
    </ImageUploadContainer>
  );
};

export default ImageUpload;
