import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import GroupPageLayout from "../../group/GroupPageLayout";

export default function GroupViewPage(props) {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [group, setGroup] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/group/view/" + groupId).then((response) => {
      setGroup(response.data);
      console.log(response.data);
    })
      .catch((error) => {
        console.error("모임 정보를 불러오는데 실패했습니다." + error);
      });
  }, []);

  useEffect(() => {
    if (group && group.members) {
      const memberIds = group.members?.map((member) => member.userId);
      console.log(memberIds);
      axios.post(`/api/group/members`, memberIds).then((response) => {
        setUsers(response.data);
      }).catch((error) => {
        console.error("멤버 정보를 불러오는데 실패했습니다." + error);
      } );
    }
  }, [group]);

  return (
    <GroupPageLayout group={group}>
      <Outlet context={{ group, users, ...props }} />
    </GroupPageLayout>
  );

}