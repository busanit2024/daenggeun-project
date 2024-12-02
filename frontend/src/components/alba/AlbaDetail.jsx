import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/AlbaStyled.css";
import axios from "axios";

const AlbaDetail = () => {
  const { id } = useParams(); // URL에서 id 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const [job, setJob] = useState(null); // 알바 상세 데이터 상태

  useEffect(() => {
    // 알바 상세 데이터 가져오기
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

  // 삭제 버튼 핸들러
  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 이 글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/alba/${id}`);
      alert("글이 성공적으로 삭제되었습니다.");
      navigate("/alba"); // 삭제 후 알바 리스트 페이지로 이동
    } catch (error) {
      console.error("글 삭제 중 오류 발생:", error);
    }
  };

  // 로딩 중 처리
  if (!job) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "20px" }}>{job.title}</h1>
      <p style={{ marginBottom: "10px" }}>{job.description}</p>
      <p style={{ marginBottom: "10px" }}>위치: {job.location}</p>
      <p style={{ marginBottom: "10px" }}>시급: {job.wage}</p>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate(`/alba/${id}/edit`)}
          style={{
            padding: "10px 15px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          수정
        </button>
        <button
          onClick={handleDelete}
          style={{
            padding: "10px 15px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default AlbaDetail;
