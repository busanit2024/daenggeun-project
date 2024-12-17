import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ImAlarm } from "react-icons/im";
import { ImCalendar } from "react-icons/im";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LiaWonSignSolid } from "react-icons/lia";
import "../../../styles/AlbaStyled.css";
import Button from "../../ui/Button";
import styled from "styled-components";
import AlbaMemberProfile from "../../alba/AlbaMemberProfile";
import AlbaListItem from "../../alba/AlbaListItem";
import { useArea } from "../../../context/AreaContext";
import Breadcrumb from "../../ui/Breadcrumb";

const AlbaDetail = () => {
  const { id } = useParams(); // URL에서 id 가져오기
  const navigate = useNavigate(); // 상세 페이지 이동용
  const [job, setJob] = useState(null); // 상세 데이터 상태
  const [relatedJobs, setRelatedJobs] = useState([]); // 관련 알바 데이터 상태
  const [itemsToShow, setItemsToShow] = useState(5); // 처음에 보여줄 게시물 개수
  const { area } = useArea();
  const [searchFilter, setSearchFilter] = useState({ 
    sido: "부산광역시", sigungu: "", emd: "", 
    category: "all", sort: "" });


  useEffect(() => {
    // 상세 데이터 로드
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/alba/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error("글 조회 중 오류 발생:", error);
      }
    };

    // 관련 알바 데이터 로드
    const fetchRelatedJobs = async () => {
      try {
        const response = await axios.get("/api/alba");
        setRelatedJobs(response.data.filter((item) => item._id !== id));
      } catch (error) {
        console.error("관련 알바 데이터 불러오기 실패:", error);
      }
    };

    fetchJob();
    fetchRelatedJobs();
  }, [id]);

  if (!job) return <p>로딩 중...</p>; // 로딩 처리


  const routes = [
    { path: "/", name: "홈" },
    { path: "/alba", name: "알바 검색" },
    { path: "/alba/create", name: "알바 게시물 작성" },
    { path: `/alba/${id}`, name: "알바 상세 보기" },
    { path: `/alba/${id}/edit`, name: "알바 게시물 수정" },
  ];

  const handleEdit = () => {
    navigate(`/alba/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/alba/${id}`);
        alert("게시물이 삭제되었습니다.");
        navigate("/alba");
      } catch (error) {
        console.error("게시물 삭제 중 오류 발생:", error);
        alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const sessionId = sessionStorage.getItem("uid");
  const isAuthor = sessionId === job.userId;

  const handleShowMore = () => {
    setItemsToShow((prev) => prev + 5);
  };

  return (
    <div className="alba-detail-page">
     <Breadcrumb routes={routes} />
     <br/>
    <h2>{`${searchFilter.sido} ${area.sigungu || searchFilter.sigungu} ${area.emd || ''} ${searchFilter.category === 'all' ? "" : searchFilter.category}`}{searchFilter.category === 'all' ? " 알바" : ""}</h2>
      <div className="alba-detail-container">
        {/* 좌측 영역 */}
        <div className="detail-left">
          <img
            src={
              job.image != null
                ? job.image.url
                : "images/default/default-image.png"
            }
            alt={job.title}
            className="detail-image"
          />
          <div className="profile-info">
            {/* userId가 변경되면 AlbaMemberProfile이 데이터를 새로 로드합니다 */}
            <AlbaMemberProfile userId={job.userId} />
          </div>
        </div>

        {/* 우측 영역 */}
        <div className="detail-right">
          <div className="detail-body">
            <h2>{job.title}</h2>
            <p>
              <LiaWonSignSolid /> {job.wageType} {job.wage}
            </p>
            <p>
              <HiOutlineLocationMarker /> {job.workPlace}
            </p>
            <p>
              <ImCalendar /> {job.workDays}
            </p>
            <p>
              <ImAlarm /> {job.workTime.start}~{job.workTime.end}
            </p>

            <h2>상세 내용</h2>
            <pre
              style={{
                maxWidth: "100%",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflow: "auto",
              }}
            >
              {job.description}
            </pre>
          </div>

          {/* 수정 및 삭제 버튼 */}
          {isAuthor && (
            <>
              <Button
                type="edit-button"
                title="수정"
                variant="primary"
                onClick={handleEdit}
              />
              
              <Button
                type="delete-button"
                title="삭제"
                variant="secondary"
                onClick={handleDelete}
              />
            </>
          )}

          <div className="detail-map">
            <iframe
              title="location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                job.workPlace
              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="map-frame"
            ></iframe>
            <div className="map-name">{job.workPlace}</div>
          </div>
        </div>
      </div>

      {/* 하단 관련 알바 리스트 */}
      <div className="related-jobs">
        <h2>모든 지역 알바 목록</h2>
        <div className="alba-list-full">
          {relatedJobs.slice(0, itemsToShow).map((item) => (
            <AlbaListItem key={item._id} alba={item} />
          ))}
          {itemsToShow < relatedJobs.length && (
            <Button title="더보기" variant="primary" onClick={handleShowMore} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbaDetail;
