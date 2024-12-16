import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import GroupPageLayout from "../../group/GroupPageLayout";

export default function GroupViewPage(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId } = useParams();
  const [group, setGroup] = useState({});
  const [membersLoaded, setMembersLoaded] = useState(false);

  useEffect(() => {
    axios.get("/api/group/view/" + groupId).then((response) => {
      setGroup(response.data);
    })
      .catch((error) => {
        console.error("모임 정보를 불러오는데 실패했습니다." + error);
      });
  }, [groupId]);

  useEffect(() => {
    if (group && group.members && !membersLoaded) {
      const memberIds = group.members?.map((member) => member.userId);
      axios.post(`/api/group/members`, memberIds).then((response) => {
        const users = response.data;
        const newMembers = group.members.map((member) => {
          const user = users.find((user) => user.uid === member.userId);
          const newUser = {
            ...member,
            location: user.location,
            username: user.username,
            profileImage: user.profileImage,
          };
          return newUser;
          }
        );

        setGroup((prev) => ({ ...prev, members: newMembers }));
        setMembersLoaded(true);
      }).catch((error) => {
        console.error("멤버 정보를 불러오는데 실패했습니다." + error);
      } );
    }
  }, [group]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <GroupPageLayout group={group}>
      <Outlet context={{ membersLoaded, group, ...props }} />
    </GroupPageLayout>
  );

}