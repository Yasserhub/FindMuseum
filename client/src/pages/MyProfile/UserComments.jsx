import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileReviewCard from "./ProfileReviewCard";
import useFetch from "../../hooks/useFetch";
import Pagination from "../../components/common/pagination/Pagination";
import "./user-comments.css";

const UserComments = () => {
  const [userComments, setUserComments] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { userId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(5);
  const [currentButton, setCurrentButton] = useState(1);

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const totalPagesNum = Math.ceil(userComments?.length / commentsPerPage);

  const { performFetch } = useFetch(`/user/comments/${userId}`, (response) => {
    setUserComments(response.result.comments);
  });

  useEffect(() => {
    performFetch();
  }, [userId, refresh]);

  const currentComments = userComments?.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  return (
    <>
      <div className="user-comments-container">
        <ProfileReviewCard
          comments={currentComments}
          refresh={refresh}
          setRefresh={setRefresh}
          commentLength={userComments?.length}
        />

        <Pagination
          pages={totalPagesNum}
          setCurrentPage={setCurrentPage}
          currentButton={currentButton}
          setCurrentButton={setCurrentButton}
        />
      </div>
    </>
  );
};

export default UserComments;
