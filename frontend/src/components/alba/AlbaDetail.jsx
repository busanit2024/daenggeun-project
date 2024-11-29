import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AlbaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/alba/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error("글 조회 중 오류 발생:", error);
      }
    };
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/alba/${id}`);
      navigate("/");
    } catch (error) {
      console.error("글 삭제 중 오류 발생:", error);
    }
  };

  if (!job) return <p>로딩 중...</p>;

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <p>위치: {job.location}</p>
      <p>시급: {job.wage}</p>
      <button onClick={() => navigate(`/alba/${id}/edit`)}>수정</button>
      <button onClick={handleDelete}>삭제</button>
    </div>
  );
};

export default AlbaDetail;
