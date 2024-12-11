import styled from "styled-components";
import CommunityListItem from "../community/CommunityListItem";
import { useState } from "react";
import { ListContainer } from "../pages/Mypage/MyPageMain";


const dummyData = {
  id: 1,
  title: '동네생활 제목',
  content: '동네생활 내용',
  images: [
    { url: '/images/defaultGroupImage.png' }
  ],
  createdDate: '2021-09-01T00:00:00',
  location: {
    emd: '동네',
    sigungu: '구'
  },
  category: '카테고리',
};

export default function MyCommunity() {
  const [communityList, setCommunityList] = useState([]);
  return (
    <ListContainer>
      <h3>내 동네생활 글</h3>
      <CommunityListItem community={dummyData} />
    </ListContainer>
  );
}