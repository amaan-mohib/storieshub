import React, { useEffect } from "react";
import ProfileProvider, { useProfile } from "../../src/contexts/ProfileContext";
import { db } from "../../src/firebase";
import ProfileBody from "../../src/views/Profile";

const Profile = ({ uid, data, published, error }) => {
  const { setData, setPublished, setError } = useProfile();
  useEffect(() => {
    setData(data);
    setPublished(published);
    setError(error);
  }, [data, published, error]);
  return <ProfileBody uid={uid} />;
};

export async function getServerSideProps(context) {
  const { params } = context;
  const { uid } = params;
  let data = null;
  let error = null;
  let published = [];
  if (uid) {
    let docRef = db.collection("users").doc(uid);
    try {
      const doc = await docRef.get();
      if (doc.exists) {
        data = doc.data();
      } else error = true;
    } catch (err) {
      error = err;
    }
    try {
      const ss = await db
        .collection("published")
        .where("uids", "array-contains", uid)
        .get();
      const docs = ss.docs.map((doc) => {
        return {
          ...doc.data(),
          updatedAt: doc.data().updatedAt.toDate().toDateString(),
        };
      });
      published = docs.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (err) {
      console.error(err);
    }
  }

  return {
    props: {
      uid,
      data: JSON.parse(JSON.stringify(data)),
      published: JSON.parse(JSON.stringify(published)),
      error,
    },
  };
}

const Component = (props) => (
  <ProfileProvider>
    <Profile {...props} />
  </ProfileProvider>
);

export default Component;
