import { useOutletContext } from "react-router-dom";
import { Container, InnerContainer } from "./GroupPageLayout";
import styled from "styled-components";
import { useState } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

const AlbumGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
`;


const AlbumThumbContainer = styled.div`
  border: 1px solid #fff;  width: 100%;
  height: 0;
  padding-top: 100%;
  background-color: #000;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  transition: opacity 0.2s;

  &:hover {
    opacity: 60%;
  }

`;

const LargeImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.9);
  z-index: 99;
  justify-content: center;
  align-items: center;
  margin-top: 85px;

  & .close {
    position: absolute;
    top: 0;
    right: 0;
    margin: 24px;
    cursor: pointer;
  }
`;

const LargeImage = styled.div`
  display: flex;
  justify-self: center;
`;

const ImageList = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr;
  margin: 48px 64px;
  justify-self: end;

  & .arrow-button {
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .arrow-button:hover {
      opacity: 60%;
    }

  & .tumbnail {
  border: 1px solid rgba(0,0,0,0.8);
  width: 100%;
  height: 0;
  padding-top: 100%;
  background-color: #000;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 60%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;

  }

  }
  
`;

export default function GroupAlbum(props) {
  const { group } = useOutletContext();
  const [imageOpen, setImageOpen] = useState(false);
  const [images, setImages] = useState([]);

  const setDefaultImage = (e) => {
    e.target.src = "/images/default/defaultGroupImage.png";
  }

  return (
    <Container>
      <InnerContainer>
        <div className="group-header">
          <h3 className="title">앨범</h3>
        </div>

        <AlbumGridContainer>
          {
            Array.from({ length: 7 }).map((_, i) => (
              <AlbumThumbContainer key={i} onClick={() => setImageOpen(true)}>
                <img src={""} onError={setDefaultImage} alt="모임 앨범 이미지" />
              </AlbumThumbContainer>
            ))
          }

        </AlbumGridContainer>

      </InnerContainer>

      {imageOpen && <LargeImageContainer>
        <div className="close" onClick={() => setImageOpen(false)}>
          <img width={24} src="/images/icon/cancel.svg" alt="cancel" />
        </div>
        <LargeImage>
          <img src="/images/default/defaultGroupImage.png" onError={setDefaultImage} />
        </LargeImage>
        <ImageList>
          <>
            <div className="arrow-button">
              <FaCaretLeft size={24} />
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div className="tumbnail">
                <img src="/images/default/defaultGroupImage.png" onError={setDefaultImage} />
                asdfadsf
              </div>
            ))}
            <div className="arrow-button">
              <FaCaretRight size={24} />
            </div>
          </>



        </ImageList>
      </LargeImageContainer>}
    </Container>
  );
}