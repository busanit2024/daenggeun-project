import { useEffect, useState } from "react";
import { ListContainer } from "../pages/Mypage/MyPageMain";
import GroupListItem from "../group/GroupListItem";
import axios from "axios";
import Button from "../ui/Button";

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
  const [uid, setUid] = useState('');
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    setUid(sessionStorage.getItem('uid'));
  }, []);

  useEffect(() => {
    if (!uid) return;
    fetchMyGroup(0);
  }, [uid]);

  const fetchMyGroup = (page) => {
    axios.get(`/api/group/search`, {
      params:
      {
        uid: uid,
        category: 'all',
        sigungu: '',
        emd: '',
        sort: '',
        page: page,
        size: 5,
      }
    }).then((response) => {
      const newGroups = response.data.content;
      setGroups((prev) => (page === 0 ? newGroups : [...prev, ...newGroups]));
      setHasNext(!response.data.last);
    }).catch((error) => {
      console.error('모임을 불러오는데 실패했습니다.' + error);
    });
  };

  const handleNext = () => {
    fetchMyGroup(page + 1);
    setPage(page + 1);
  };

  return (
    <ListContainer>
      <h3>참여중인 모임</h3>
      {groups.length === 0 && <div>참여중인 모임이 없어요.</div>}

      {groups.length > 0 &&
        <>
          {groups.map((group) => (
            <GroupListItem group={group} />
          ))}
          {hasNext && <Button title='더보기' onClick={handleNext} />}
        </>
      }
    </ListContainer>
  );
}