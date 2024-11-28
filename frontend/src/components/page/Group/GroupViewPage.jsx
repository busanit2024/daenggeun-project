import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function GroupViewPage(props) {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [group, setGroup] = useState({});

  useEffect(() => {
    axios.get("/api/group/view/" + groupId).then((response) => {
      setGroup(response.data);
    })
    .catch((error) => { 
      console.error("모임 정보를 불러오는데 실패했습니다." + error);
    });
  }, []);


  return(
  <div>
    <h1>모임 상세보기</h1>
    <h2>{group.title}</h2>
    <p>{group.description}</p>
    <p>카테고리: {group.category}</p>
    <p>연령대: {group.ageRange}</p>
    <p>인원: {group.members?.length() ?? 0 }/{group.maxMember}</p>
  </div>
  );

}