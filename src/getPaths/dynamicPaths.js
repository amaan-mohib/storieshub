import { webUrl } from "../config";
import { db } from "../firebase";

const dynamicPaths = async () => {
  const bookRef = await db.collection("published").get();
  const books = bookRef.docs.map((doc) => doc.data());

  const productRef = await db.collection("users").get();
  const profiles = productRef.docs.map((doc) => doc.data());

  const bookDynamicPaths =
    books.length > 0 ? books.map((book) => `${webUrl}/book/${book.id}`) : [];
  const profileDynamicPaths =
    profiles.length > 0
      ? profiles.map((profile) => `${webUrl}/profile/${profile.uid}`)
      : [];

  return { bookDynamicPaths, profileDynamicPaths };
};

export default dynamicPaths;
