import DOMPurify from "dompurify";

export const isS = (array = [], word = "", plural = "s") => {
  return `${word}${array && array.length > 1 ? plural : ""}`;
};

export const createMarkup = (html) => {
  return {
    __html: DOMPurify.sanitize(html),
  };
};
