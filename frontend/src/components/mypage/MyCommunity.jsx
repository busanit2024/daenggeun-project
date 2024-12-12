import styled from "styled-components";
import CommunityListItem from "../community/CommunityListItem";
import { useEffect, useState } from "react";
import { ListContainer } from "../pages/Mypage/MyPageMain";
import Button from "../ui/Button";
import axios from "axios";


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
  const [uid, setUid] = useState('');
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    setUid(sessionStorage.getItem('uid'));
  } ,[]);

  useEffect(() => {
    if (!uid) return;
    fetchMyCommunity(0);
  }, [uid]);

    const fetchMyCommunity = (page) => {
      axios.get(`/api/community/myCommunity/${uid}`, {params: 
        {
          page: page,
          size: 5,
        }
      }).then((response) => {
        const newComu = response.data.content;
        setCommunityList((prev) => (page === 0 ? newComu : [...prev, ...newComu]));
        setHasNext(!response.data.last);
      }).catch((error) => { 
        console.error('모임을 불러오는데 실패했습니다.' + error);
      });
    };

    const handleNext = () => {  
    fetchMyCommunity(page + 1);
    setPage(page + 1);
  };
  return (
    <ListContainer>
      <h3>내 동네생활 글</h3>
      {communityList.map((community) => (
        <CommunityListItem community={community} key={community.id} />
      ))}
      {hasNext && <Button title={'더보기'} onClick={handleNext} /> }
    </ListContainer>
  );
}