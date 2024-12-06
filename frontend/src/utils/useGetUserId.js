import axios from "axios";
import { useState, useEffect } from "react";

const useGetUserId = (uid) => {
    const [userId, setUserId] = useState(null);
    
    useEffect(() => {
        const fetchUserId = async () => {
            if (uid) {
                window.sessionStorage.setItem("uid", uid);
                try {
                    const response = await axios.get(`/user/${uid}`);
                    // 응답 상태가 200인지 확인
                    if (response.status === 200) {
                        setUserId(response.data.id); // 응답 데이터에서 userId를 가져옴
                    } else {
                        throw new Error("사용자를 찾을 수 없습니다.");
                    }
                } catch (error) {
                    console.error("사용자 ID를 가져오는 중 오류 발생:", error);
                    setUserId(null);
                }
            } else {
                window.sessionStorage.removeItem("uid");
                setUserId(null);
            }
        };

        fetchUserId();
    }, [uid]);

    return userId;
};

export default useGetUserId;