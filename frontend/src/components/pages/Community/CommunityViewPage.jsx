import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function CommunityViewPage(props) {
    const navigate = useNavigate();
    const { communityId } = useParams();
    const [group, setGroup] = useState({});

    useEffect(() => {
        axios.get("/api/community/view/" + communityId).then((response) => {
            setGroup(response.data);
        })
        .catch((error) => {
            console.error("동네생활 정보를 불러오는데 실패했습니다." + error);
        });
    }, []);

    return(
        <div>
            
        </div>
    );
}