import styled from "styled-components";
import { useState } from "react";
import MemberListItem from "./MemberListItem";
import ScheduleListItem from "./ScheduleListItem";
import PostListItem from "./PostListItem";
import RoundFilter from "../ui/RoundFilter";
import { Container, InnerContainer, GridContainer } from "./GroupPageLayout";
import { Link, useNavigate, useOutletContext } from "react-router-dom";


const AlbumContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const AlbumItem = styled.div`
  width: 100%;
  height: 0;
  padding-top: 100%;
  background-color: #dcdcdc;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const BoardContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;


export default function GroupView () {
  const naviagte = useNavigate();
  const { group } = useOutletContext();
  const [selectedBoard, setSelectedBoard] = useState('전체');

  return (
<Container>
        <InnerContainer className="innerContainer">
          <div className="group-header">
            <h3 className="title">앨범</h3>
            <div className="more">더보기
              <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
            </div>
          </div>
          <AlbumContainer>
            <AlbumItem>
              <img src="/images/default_group_image.jpg" alt="앨범 이미지" />
            </AlbumItem>
            <AlbumItem>
              <img src="/images/default_group_image.jpg" alt="앨범 이미지" />
            </AlbumItem>
            <AlbumItem>
              <img src="/images/default_group_image.jpg" alt="앨범 이미지" />
            </AlbumItem>
            <AlbumItem>
              <img src="/images/default_group_image.jpg" alt="앨범 이미지" />
            </AlbumItem>
          </AlbumContainer>
        </InnerContainer>
        <InnerContainer className="innerContainer">
          <div className="group-header">
            <h3 className="title">멤버 {group.members?.length ?? 0}</h3>
            <Link to={"members"} className="more">더보기
              <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
            </Link>
          </div>
          <GridContainer>
            <MemberListItem />
            <MemberListItem />
            <MemberListItem />
            <MemberListItem />
            </GridContainer>
        </InnerContainer>
        <InnerContainer className="innerContainer">
          <div className="group-header">
            <h3 className="title">일정 {group.schedules?.length ?? 0}</h3>
            <Link to={"schedule"} className="more">더보기
              <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
            </Link>
          </div>
          <GridContainer>
            <ScheduleListItem />
            <ScheduleListItem />
            <ScheduleListItem />
            <ScheduleListItem />
          </GridContainer>
        </InnerContainer>
        <InnerContainer className="innerContainer">
          <div className="group-header">
            <h3 className="title">게시글 {group.posts?.length ?? 0}</h3>
            <Link to={"board"} className="more">더보기
              <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
            </Link>
          </div>
          <BoardContainer>
            <RoundFilter title="전체" variant={selectedBoard === '전체' ? 'boardSelected' : 'board'} onClick={() => setSelectedBoard('전체')} />
          { group.boards?.map((board) => (
            <RoundFilter key={board} title={board} variant={selectedBoard === board ? 'boardSelected' : 'board'} onClick={() => setSelectedBoard(board)} />
            
          ))}
          </BoardContainer>
          <PostContainer>
            <PostListItem />
            <PostListItem />
            <PostListItem />
          </PostContainer>
          
        </InnerContainer>
      </Container>
  );

}