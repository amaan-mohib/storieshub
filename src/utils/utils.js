import DOMPurify from "dompurify";

export const isS = (array = [], word = "", plural = "s", singular = "") => {
  return `${word}${array && array.length > 1 ? plural : singular}`;
};

export const createMarkup = (html) => {
  return {
    __html: DOMPurify.sanitize(html),
  };
};

export const capitalize = (sentence = "") => {
  return sentence.replace(/\w\S*/g, (w) =>
    w.replace(/^\w/, (c) => c.toUpperCase())
  );
};

export const joinObjects = (array = [], key = "", seperator = ",") => {
  return array.map((a) => a[key]).join(seperator + " ");
};

export const parseHTMLString = (htmlString = "") => {
  return htmlString.replace(/<[^>]+>/g, "");
};
