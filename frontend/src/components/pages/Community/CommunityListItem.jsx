import { useNavigate } from 'react-router-dom';

const CommunityListItem = ({ community }) => {
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  const handleClick = () => {
    navigate(`/community/${community.id}`); // navigate로 상세 페이지로 이동
  };

  return (
    <div onClick={handleClick}>
      <h3>{community.title}</h3>
      <p>{community.content}</p>
    </div>
  );
};

export default CommunityListItem;