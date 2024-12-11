import { useState } from "react";
import { ListContainer } from "../pages/Mypage/MyPageMain";
import GroupListItem from "../group/GroupListItem";

const dummyData = {
  id: 1,
  title: '모임 이름',
  image: {
    url: '/images/defaultGroupImage.png',
    filename: 'defaultGroupImage.png'
  },
  description: '모임 설명',
  location: {
    emd: '동네',
    sigungu: '구'
  },
  category: '카테고리',
  }
  


export default function MyGroup() {
  const [groups, setGroups] = useState([]);
  return (
    <ListContainer>
      <h3>참여중인 모임</h3>
      <GroupListItem group={dummyData} />
    </ListContainer>
  );
}