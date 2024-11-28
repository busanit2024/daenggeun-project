import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function GroupPage(props) {
  const navigate = useNavigate();
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    axios.get("/api/group/list").then((response) => {
      setGroupList(response.data);
      console.log(response.data);
    })
    .catch((error) => {
      console.error("모임 리스트를 불러오는데 실패했습니다." + error);
    });
  }, []);


  return(
  <div>
    <h1>모임 리스트</h1>
    {groupList.map((group) => (
      <div key={group.id} style={{border: "1px solid grey"}} onClick={() => navigate(`/group/view/${group.id}`)}>
        <h2>{group.title}</h2>
        <p>{group.description}</p>
      </div>
    ))}
    <button onClick={() => navigate("/group/create")}>모임 만들기</button>
  </div>
  );
  
}