import { FaExclamationCircle, FaRegComment } from "react-icons/fa";
import { FaRegThumbsUp } from "react-icons/fa6";
import styled from "styled-components";

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
  const { post } = props;

  return (
    <Wrapper>
      {/* <div className="private"><FaExclamationCircle />모임에게만 공개된 게시글이에요.</div> */}
      <div className="title">제목</div>

      <Info>
        <span>작성자</span>
        <span> · </span>
        <span>작성일</span>
        <span> · </span>
        <span>게시판이름</span>
      </Info>

      <Buttons>
        <div>
          <FaRegThumbsUp />6
        </div>
        <div>
          <FaRegComment />3
        </div>
        </Buttons>

    </Wrapper>
  );

}