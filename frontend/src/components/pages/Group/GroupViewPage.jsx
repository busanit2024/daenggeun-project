import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GroupPageLayout from "../../group/GroupPageLayout";
import styled from "styled-components";
import MemberListItem from "../../group/MemberListItem";
import ScheduleListItem from "../../group/ScheduleListItem";
import RoundFilter from "../../ui/RoundFilter";
import PostListItem from "../../group/PostListItem";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  & .innerContainer:not(:last-child) {
    border-bottom: 1px solid #dcdcdc;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 24px;

  .group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .title {
    margin: 0;
  }

  .more {
    display: flex;
    gap: 4px;
    align-items: center;
    color: #666666;
    cursor: pointer;
  }
`;

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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 48px;
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

export default function GroupViewPage(props) {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [group, setGroup] = useState({});
  const [selectedBoard, setSelectedBoard] = useState('전체');

  useEffect(() => {
    axios.get("/api/group/view/" + groupId).then((response) => {
      setGroup(response.data);
      console.log(response.data);
    })
      .catch((error) => {
        console.error("모임 정보를 불러오는데 실패했습니다." + error);
      });
  }, []);


  return (
    <GroupPageLayout group={group}>
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
            <div className="more">더보기
              <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
            </div>
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
            <div className="more">더보기
              <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
            </div>
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
            <div className="more">더보기
              <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
            </div>
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
    </GroupPageLayout>
  );

}