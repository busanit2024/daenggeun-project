import { FaExclamationCircle, FaRegComment } from "react-icons/fa";
import { FaRegThumbsUp } from "react-icons/fa6";
import styled from "styled-components";
import { calculateDate } from "../../utils/calculateDate";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;

  .private {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #999999;
  }

  .title {
    font-weight: normal;
    font-size: 16px;

    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Info = styled.div`
  font-size: 14px;
  color: #666666;
  display: flex;
  gap: 4px;
`;

const Buttons = styled.div`
  color: #666666;
  display: flex;
  gap: 8px;

  div {
    display: flex;
    gap: 6px;
    align-items: center;
  }
`;

export default function PostListItem (props) {
  const { post, onClick } = props;

  return (
    <Wrapper onClick={onClick}>
      {/* <div className="private"><FaExclamationCircle />모임에게만 공개된 게시글이에요.</div> */}
      <div className="title">{post?.content ?? '게시글 내용'}</div>

      <Info>
        <span>{post?.user?.username ?? '작성자'} {post?.user?.groupNickName ? `(${post?.user?.groupNickName})` : ''}</span>
        <span> · </span>
        <span>{post?.createdDate ? calculateDate(post.createdDate) + ' 전' : '작성일' }</span>
        <span> · </span>
        <span>{post?.board ?? '게시판이름'}</span>
      </Info>

      <Buttons>
        <div>
          <FaRegThumbsUp /> {post?.likeUsers ? post.likeUsers.length : 0}
        </div>
        <div>
          <FaRegComment /> {post?.comments ? post.comments.length : 0}
        </div>
        </Buttons>

    </Wrapper>
  );

}