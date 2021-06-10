import React, { useState } from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Feed = (props) => {
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(props.data.likes);
  const { user } = useAuth();
  return (
    <div className="feed">
      <div className="feed-title">
        <div>
          <Link className="feed-title-heading" to={`/book/${props.data.id}`}>
            <h2>{props.data.title}</h2>
          </Link>
          <p>
            {props.data.authors.map((a, index) => {
              return (
                <>
                  <Link
                    className="feed-author"
                    to={`/${a.id}`}>{`${a.name}`}</Link>
                  {index < props.data.authors.length - 1 ? ", " : ""}
                </>
              );
            })}
          </p>
        </div>
        {user && (
          <div className="likes">
            <FeatherIcon
              icon="heart"
              onClick={() => {
                setLike(!like);
                like ? setLikes(likes - 1) : setLikes(likes + 1);
              }}
              fill={like ? "red" : "none"}
            />
            <p>{likes}</p>
          </div>
        )}
      </div>
      <hr />
      <div className="feed-body">{props.data.synopsis}</div>
      <div className="keywords">
        {props.data.keywords.map((k) => (
          <p>{k}</p>
        ))}
      </div>
      <div className="published">{props.data.publishedAt}</div>
    </div>
  );
};

export default Feed;
