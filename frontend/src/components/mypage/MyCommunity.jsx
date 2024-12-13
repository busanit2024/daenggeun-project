import styled from "styled-components";
import CommunityListItem from "../community/CommunityListItem";
import { useEffect, useState } from "react";
import { ListContainer } from "../pages/Mypage/MyPageMain";
import Button from "../ui/Button";
import axios from "axios";


export default function MyCommunity() {
  const [communityList, setCommunityList] = useState([]);
  const [uid, setUid] = useState('');
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    setUid(sessionStorage.getItem('uid'));
  }, []);

  useEffect(() => {
    if (!uid) return;
    fetchMyCommunity(0);
  }, [uid]);

  const fetchMyCommunity = (page) => {
    axios.get(`/api/community/myCommunity/${uid}`, {
      params:
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
      {communityList.length === 0 && <div>작성한 글이 없어요.</div>}
      {communityList.length > 0 &&
        <>
          {communityList.map((community) => (
            <CommunityListItem community={community} key={community.id} />
          ))}
          {hasNext && <Button title={'더보기'} onClick={handleNext} />}
        </>
      }
    </ListContainer>
  );
}