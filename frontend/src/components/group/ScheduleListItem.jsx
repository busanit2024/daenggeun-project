import { FaExclamationCircle, FaRegClock } from "react-icons/fa";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  cursor: pointer;
`;

const Date = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px;
  background-color: #f2f2f2;
  border-radius: 8px;
  flex-grow: 0;
  width: fit-content;
  height: fit-content;

  .month {
    font-size: 14px;
    color: #666666;
  }

  .date {
    font-size: 18px;
    font-weight: bold;
    color: #666666;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  .private {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #999999;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .state {
    font-size: 14px;
  }

  .state .open {
    color: #FF7B07;
  }

  .state .close {
    color: #d4b55f;
  }

  .tags {
    display: flex;
    gap: 12px;
    font-size: 14px;
    color: #666666;

    span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
`;

const Image = styled.div`
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #dcdcdc;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  flex-shrink: 0;
`;


export default function ScheduleListItem(props) {
  const { schedule } = props;

  return (
    <Wrapper>
      <div style={{display: 'flex', gap: '16px'}}>
        <Date>
          <div className="month">11월</div>
          <div className="date">27</div>
        </Date>
        <Info>
          {/* <div className="private"><FaExclamationCircle />모임에게만 공개된 일정이에요.</div> */}
          <div className="title">일정 제목</div>
          <div className="state">
            <span className="open">모집중</span>
            <span className="close">마감</span>
          </div>
          <div className="tags">
            <span>
              <FaRegClock />
              오전 11:00</span>
            <span>
              <img height={18} src="/images/icon/people_gray.svg" />
              0/0명</span>
          </div>
        </Info>
      </div>


      <Image>
        <img src="/images/default_group_image.jpg" alt="모임 이미지" />
      </Image>

    </Wrapper>
  );
}