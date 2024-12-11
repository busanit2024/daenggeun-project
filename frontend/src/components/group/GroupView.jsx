import styled from "styled-components";
import { useEffect, useState } from "react";
import MemberListItem from "./MemberListItem";
import ScheduleListItem from "./ScheduleListItem";
import PostListItem from "./PostListItem";
import RoundFilter from "../ui/RoundFilter";
import { Container, InnerContainer, GridContainer } from "./GroupPageLayout";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";


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
  border: 1px solid #e0e0e0;

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


export default function GroupView() {
  const naviagte = useNavigate();
  const { group, membersLoaded } = useOutletContext();
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!membersLoaded) return;
    axios.get(`/api/group/board/${group.id}`, {params: {
      boardName: selectedBoard,
      page: 0,
      size: 4,
    }}).then((response) => {
      const newPosts = response.data.content;
      const postsWithUser = newPosts.map((post) => {
        const user = group.members.find((member) => member.userId === post.userId);
        return {
          ...post,
          user: user,
        };
      });
      setPosts(postsWithUser);
    }).catch((error) => {
      console.error('게시글을 불러오는데 실패했습니다.' + error);
    });
  }, [group, membersLoaded, selectedBoard]);




  return (
    <Container>
      <InnerContainer className="innerContainer">
        <div className="group-header">
          <h3 className="title">앨범</h3>
          <Link to={'album'} className="more">더보기
            <img height={12} src="/images/icon/arrow_right.svg" alt="더보기" />
          </Link>
        </div>
        <AlbumContainer>
          {posts?.filter((post) => post?.images?.length > 0).slice(0, 4).map((post) => (
            <AlbumItem key={post.id} onClick={() => naviagte(`board/${post.id}`)}>
              <img src={post.images[0].url} alt={post.id} />
            </AlbumItem>
          ))}
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
          {group.members?.map((member) => (
            <MemberListItem key={member.id} member={member} />
          ))}
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
          <RoundFilter title="전체" variant={selectedBoard === 'all' ? 'boardSelected' : 'board'} onClick={() => setSelectedBoard('all')} />
          {group.boards?.map((board) => (
            <RoundFilter key={board} title={board} variant={selectedBoard === board ? 'boardSelected' : 'board'} onClick={() => setSelectedBoard(board)} />

          ))}
        </BoardContainer>
        <PostContainer>
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} onClick={() => naviagte(`board/${post.id}`)} />
          ))}
        </PostContainer>

      </InnerContainer>
    </Container>
  );

}