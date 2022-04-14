import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import FeatherIcon from "feather-icons-react";
import ToggleButton from "react-toggle-button";
import Link from "../components/Link";
import FormProvider, { useForm } from "../contexts/CreateFormContext";
import { db, timestamp } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Buttons";
import { useRouter } from "next/router";
import SEO from "../components/Helmet";
// import { appName } from "../config";
// import { Helmet } from "react-helmet";

const Create = () => {
  return (
    <FormProvider>
      <div>
        <SEO title="Create" />
        <Navbar />
        <div className="main" style={{ flexDirection: "column" }}>
          <Title />
          <Footer />
        </div>
      </div>
    </FormProvider>
  );
};
const Footer = () => {
  const { title, tags, synopsis, genre, nsfw, error, setError } = useForm();
  const history = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const validation = () => {
    if (title === "" || genre === "" || tags.length < 1) {
      setError(true);
      return true;
    } else {
      setError(false);
      return false;
    }
  };
  return (
    <div className="feed">
      {error && <div className="error">*Please fill the required fields</div>}
      <div className="footer">
        <Button secondary as={Link} href="/">
          Cancel
        </Button>
        <Button
          loading={loading}
          endIcon={<FeatherIcon icon="chevron-right" />}
          onClick={() => {
            if (!validation()) {
              setLoading(true);
              let docRef = db.collection("books").doc();
              docRef
                .set({
                  id: docRef.id,
                  title: title,
                  synopsis: synopsis,
                  tags: tags,
                  genre: genre,
                  nsfw: nsfw,
                  createdAt: timestamp.serverTimestamp(),
                  updatedAt: timestamp.serverTimestamp(),
                  authors: timestamp.arrayUnion({
                    id: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    leader: true,
                  }),
                  uids: timestamp.arrayUnion(user.uid),
                  leader: user.uid,
                })
                .then(() => {
                  console.log("created book with id: ", docRef.id);
                  db.collection("users")
                    .doc(`${user.uid}`)
                    .set(
                      {
                        books: timestamp.arrayUnion(docRef.id),
                      },
                      { merge: true }
                    )
                    .then(() => {
                      setLoading(false);
                      history.push(`/edit/${docRef.id}`);
                      console.log("added book id to user");
                    })
                    .catch((err) => console.error(err));
                })
                .catch((err) => console.error(err));
            }
          }}>
          Next
        </Button>
      </div>
    </div>
  );
};
const Title = () => {
  const { title, setTitle, synopsis, setSynopsis, nsfw, setNsfw, error } =
    useForm();
  return (
    <div className="feed">
      <input
        type="text"
        name="title"
        className="textfield title-field"
        placeholder={`Title${error ? "*" : ""}`}
        value={title}
        style={{ width: "100%" }}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        autoCapitalize="words"
      />
      <TagInput />
      <textarea
        name="synopsis"
        type="text"
        placeholder="Synopsis (can be skipped)"
        rows="5"
        className="textfield"
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
        style={{ width: "100%", resize: "none" }}
      />
      <Genres />
      <div className="toggleDiv" onClick={() => setNsfw(!nsfw)}>
        <p style={{ fontSize: "small" }}>Matured Content</p>
        <ToggleButton value={nsfw} onToggle={() => setNsfw(!nsfw)} />
      </div>
    </div>
  );
};
const TagInput = () => {
  const { tags, setTags, error } = useForm();
  const [input, setInput] = useState("");
  const [isKeyReleased, setIsKeyReleased] = useState(false);
  const [words, setWords] = useState([]);
  const fieldRef = useRef(null);
  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };
  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = input.trim();

    if (
      (key === "," || key === " " || key === "Enter") &&
      trimmedInput.length &&
      !tags.includes(trimmedInput)
    ) {
      e.preventDefault();
      setTags((t) => [...t, trimmedInput]);
      setInput("");
      fieldRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "end",
        block: "end",
      });
    }
    if (key === "Backspace" && !input.length && tags.length && isKeyReleased) {
      e.preventDefault();
      const tagsCopy = [...tags];
      const pop = tagsCopy.pop();
      setTags(tagsCopy);
      setInput(pop);
    }
    setIsKeyReleased(false);
  };
  const onKeyUp = () => {
    setIsKeyReleased(true);
  };
  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index));
  };
  const randomTags = (words) => {
    let result = [];
    let taken = [];
    let n = 4;
    let len = words.length;
    const getRandom = () => {
      let x = Math.floor(Math.random() * len);
      if (x in taken) {
        taken.push(x);
        return getRandom();
      } else return x;
    };
    for (let i = 0; i < n; i++) {
      result.push(words[getRandom()]);
    }
    setTags(result);
  };
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/AlexHakman/Java-challenge/master/words.txt"
    )
      .then((res) => res.text())
      .then((text) => {
        setWords(text.split("\r\n"));
        // randomTags(text.split("\r\n"));
      });
  }, []);

  return (
    <div
      className="key-input"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
      <div className="keywords key-input-div">
        {tags.map((tag, index) => (
          <p>
            {tag}
            <button onClick={() => deleteTag(index)}>
              <FeatherIcon icon="x" size="15" />
            </button>
          </p>
        ))}
        {tags.length < 4 && (
          <input
            ref={fieldRef}
            name="keywords"
            value={input}
            className="textfield"
            onChange={onChange}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            placeholder={`Keywords${
              error && tags.length < 1 ? "*" : ""
            } (Max 4)`}
          />
        )}
      </div>
      <div
        className="icon-button"
        style={{ width: "45px" }}
        title="Randomize"
        onClick={() => randomTags(words)}>
        <FeatherIcon icon="refresh-cw" size="20" />
      </div>
    </div>
  );
};
export const genres = [
  "Action and adventure",
  "Crime and mystery",
  "Fantasy",
  "Horror",
  "Romance",
  "Science fiction",
  "Non-fiction",
];
const Genres = () => {
  const { genre, setGenre, error } = useForm();

  return (
    <div>
      <select
        id="genres"
        value={genre}
        title="Genre"
        onChange={(e) => setGenre(e.target.value)}>
        <option value="" selected style={{ color: "var(--secondary-text)" }}>
          {`Select Genre${error ? "*" : ""}`}
        </option>
        {genres.map((g, i) => (
          <option value={i}>{g}</option>
        ))}
      </select>
    </div>
  );
};
export default Create;
