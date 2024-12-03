import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ListItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
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

const WorkType = styled.span`
  margin-top: 8px;
  background-color: #e6f7ff;
  color: #007bff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  align-self: flex-start;
`;

export default function AlbaListItem({ alba }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/alba/${alba.id}`);
  };

  return (
    <ListItemContainer onClick={handleClick}>
      <Title>{alba.title}</Title>
      <Location>{`${alba.location.si} ${alba.location.gu} ${alba.location.dong}`}</Location>
      <Category>{alba.category}</Category>
      {alba.workType && <WorkType>{alba.workType}</WorkType>}
    </ListItemContainer>
  );
}
