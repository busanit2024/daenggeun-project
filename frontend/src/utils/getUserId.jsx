import { useState, useEffect } from "react";

const getUserId = (uid) => {
    const [userId, setUserId] = useState(null);
    
    useEffect(() => {
        const fetchUserId = async () => {
            if (uid) {
                window.sessionStorage.setItem("uid", uid);
                const response = await fetch(`/user/${uid}`);
                const data = await response.json();
                setUserId(data.userId);
            } else {
                window.sessionStorage.removeItem("uid");
                setUserId(null);
            }
        };

        fetchUserId();
    }, [uid]);

    return userId;
};

export default getUserId;