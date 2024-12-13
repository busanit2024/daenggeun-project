import { useNavigate, useOutletContext } from "react-router-dom";
import { Container, InnerContainer } from "./GroupPageLayout";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { FaCaretLeft, FaCaretRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import Button from "../ui/Button";

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

  & .buttonContainer {
    position: absolute;
    top: 0;
    right: 0;
    margin: 24px;
    display: flex;
    align-items: center;
    gap: 24px;

    button {
      background-color: transparent;
      color: #fff;
    }
  }


  & .close {
    cursor: pointer;
  }

`;

const LargeImage = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  justify-self: center;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;

  & .chevron {
    color: #fff;
    cursor: pointer;
  }

  img {
    width: auto;
    height: 100%;
    object-fit: contain;
  }
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

    &.left {
      grid-column-start: 1;
    }

    &.right {
      grid-column-start: 12;
    }
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
  const navigate = useNavigate();
  const [imageOpen, setImageOpen] = useState(-1);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);


  useEffect(() => {
    if (!group) return;
    fetchBoardWithImage(page);
  }, [group, page]);

  const setDefaultImage = (e) => {
    e.target.src = "/images/default/defaultGroupImage.png";
  }

  const fetchBoardWithImage = (page) => {
    axios.get(`/api/group/board/album/${group.id}`, { params: { page: page, size: 12 } }).then((response) => {
      const newPosts = response.data.content;
      const newImages = newPosts.map((post) => {
        return {
          id: post.id,
          image: post.images[0],
        }
      });
      console.log(newImages);
      setHasNext(!response.data.last);
      setImages((prev) => page === 0 ? newImages : [...prev, ...newImages]);
    });
  }



  return (
    <Container>
      <InnerContainer>
        <div className="group-header">
          <h3 className="title">앨범</h3>
        </div>

        <AlbumGridContainer>
          {
            images.map((image, index) => (
              <AlbumThumbContainer key={index} onClick={() => setImageOpen(index)}>
                <img src={image?.image?.url} onError={setDefaultImage} alt="모임 앨범 이미지" />
              </AlbumThumbContainer>
            ))
          }

        </AlbumGridContainer>

        {hasNext && <Button title="더보기" onClick={() => setPage(page + 1)} />}

      </InnerContainer>

      {imageOpen !== -1 && <LargeImageContainer>
        <div className="buttonContainer">
          <Button title="게시글로 이동하기" onClick={() => navigate(`/group/${group.id}/board/${images[imageOpen].id}`)} />
          <div className="close" onClick={() => setImageOpen(-1)}>
            <img width={24} src="/images/icon/cancel.svg" alt="cancel" />
          </div>
        </div>
        <LargeImage>
          <FaChevronLeft className="chevron" size={24} onClick={() => setImageOpen((...prev) => (parseInt(prev) - 1 < 0 ? 0 : parseInt(prev) - 1))} />
          <img src={images[imageOpen]?.image?.url} onError={setDefaultImage} />
          <FaChevronRight className="chevron" size={24} onClick={() => setImageOpen((...prev) => (parseInt(prev) + 1 >= images.length ? prev : parseInt(prev) + 1))} />
        </LargeImage>
        <ImageList>
          <>
            <div className="arrow-button left" onClick={() => setThumbnailIndex((...prev) => (
              prev - 1 < 0 ? 0 : prev - 1
            ))}>
              <FaCaretLeft size={24} />
            </div>
            {images.slice(thumbnailIndex * 10, thumbnailIndex * 10 + 10).map((image, index) => (
              <div className="tumbnail" key={`thumb${index}`} onClick={() => setImageOpen(thumbnailIndex * 10 + index)}>
                <img src={image?.image?.url} onError={setDefaultImage} />
                asdfadsf
              </div>
            ))}
            <div className="arrow-button right" onClick={() => setThumbnailIndex((...prev) => (
              prev + 1 > images.length / 10 ? prev : prev + 1
            ))}>
              <FaCaretRight size={24} />
            </div>
          </>



        </ImageList>
      </LargeImageContainer>}
    </Container>
  );
}