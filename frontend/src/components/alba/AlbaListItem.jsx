import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { elapsedText } from '../../utils/elapsedText';

const ListItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
`;

const Location = styled.p`
  margin: 8px 0 0;
  color: #777;
`;

const Category = styled.span`
  background-color: #f0f0f0;
  color: #555;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  align-self: flex-start;
`;

const DetailsRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

const WorkType = styled.span`
  background-color: #e6f7ff;
  color: #007bff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const WorkTime = styled.span`
  background-color: #e6f7ff;
  color: #007bff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const WorkDays = styled.span`
  background-color: #e6f7ff;
  color: #007bff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
`;

export default function AlbaListItem({ alba }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/alba/${alba.id}`);
  };

  return (
    <ListItemContainer onClick={handleClick}>
      <DetailsContainer>
        <Title>{alba.title}</Title>
        <Location>
          {alba.workPlace} • {elapsedText(new Date(alba.createdAt))}
        </Location>
        <Category>{alba.wage}</Category>
        <DetailsRow>
          <WorkTime>
            {alba.workTime?.start} ~ {alba.workTime?.end}
          </WorkTime>
          {alba.workDays && (
            <WorkDays>
              {alba.workDays.join(', ')}
            </WorkDays>
          )}
          {alba.workType && <WorkType>{alba.workType}</WorkType>}
        </DetailsRow>
      </DetailsContainer>
      {alba.image && (
        <ImageContainer>
          <Image src={alba.image.url} alt={alba.title} />
        </ImageContainer>
      )}
    </ListItemContainer>
  );
}
