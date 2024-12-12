import { useState } from "react";
import { FaExclamationCircle, FaRegClock } from "react-icons/fa";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  cursor: pointer;
`;

const DateWrapper = styled.div`
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
  const { schedule, onClick } = props;

  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour < 12 ? '오전' : '오후';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const time = `${ampm} ${formattedHour}:${minute < 10 ? '0' + minute : minute}`;
    return { year, month, day, time };
  }

  const date = formatDate(schedule?.date);

  return (
    <Wrapper onClick={onClick}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <DateWrapper>
          <div className="month">{date.month}</div>
          <div className="date">{date.day}</div>
        </DateWrapper>
        <Info>
          {schedule?.isPrivate && <div className="private"><FaExclamationCircle />모임에게만 공개된 일정이에요.</div>}
          <div className="title">{schedule?.title}</div>
          <div className="state">
            {schedule?.closed ? <span className="close">마감</span> : <span className="open">모집중</span>}
          </div>
          <div className="tags">
            <span>
              <FaRegClock />
              {date.time}</span>
            <span>
              <img height={18} src="/images/icon/people_gray.svg" />
              {schedule.participants?.length || 0}
              /
              {schedule.maxMember || 0}
              명
              </span>
          </div>
        </Info>
      </div>


      <Image>
        {schedule.images?.length > 0 && <img src={schedule.images[0].url} alt="모임 이미지" />}
      </Image>

    </Wrapper>
  );
}