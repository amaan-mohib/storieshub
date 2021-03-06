import React from "react";
import { db } from "../../src/firebase";
import {
  capitalize,
  joinObjects,
  parseHTMLString,
} from "../../src/utils/utils";
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
      } else {
        context.res.statusCode = 404;
        error = true;
      }
    } catch (err) {
      error = err;
    }
  }

  return {
    props: {
      id,
      data: JSON.parse(JSON.stringify(data)),
      error,
      title: data
        ? `${capitalize(data.title)} - A Story by ${joinObjects(
            data.authors,
            "displayName"
          )}`
        : "Book Not Found",
      description: data
        ? `"${capitalize(data.title)}" by ${joinObjects(
            data.authors,
            "displayName"
          )} · ${parseHTMLString(data.synopsis)}`
        : null,
      route: `/book/${id}`,
    },
  };
}

export default book;
