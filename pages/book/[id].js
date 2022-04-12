import React from "react";
import { db } from "../../src/firebase";
import Book from "../../src/views/Book";

const book = ({ id, data, error }) => {
  return <Book id={id} data={data} error={error} />;
};

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;
  let data = null;
  let error = null;
  if (id) {
    let docRef = db.collection("published").doc(id);
    const doc = await docRef.get();
    try {
      if (doc.exists) {
        data = doc.data();
      } else error = true;
    } catch (err) {
      error = err;
    }
  }

  return {
    props: {
      id,
      data: JSON.parse(JSON.stringify(data)),
      error,
    },
  };
}

export default book;
