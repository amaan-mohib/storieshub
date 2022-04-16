import produce from "immer";

export const initialState = {
  book: {
    id: "",
    title: "",
    tags: [],
    body: "",
    synopsis: "",
    authors: [],
    requests: [],
    genre: "",
    nsfw: false,
    joinID: "",
    prs: 0,
    leader: "",
    requested: false,
    updatedAt: "",
    createdAt: "",
  },
  error: null,
  messages: [],
  mobileBody: "",
  read: 0,
};

export const types = {
  UPDATE_BOOK: "UPDATE_BOOK",
  SET_ERROR: "SET_ERROR",
  SET_MESSAGES: "SET_MESSAGES",
  SET_MOBILE_BODY: "SET_MOBILE_BODY",
  SET_READ: "SET_READ",
  UPDATE_TITLE: "UPDATE_TITLE",
  UPDATE_BODY: "UPDATE_BODY",
  UPDATE_SYNOPSIS: "UPDATE_SYNOPSIS",
  UPDATE_JOIN_ID: "UPDATE_JOIN_ID",
  UPDATE_REQUESTED: "UPDATE_REQUESTED",
  UPDATE_AUTHORS: "UPDATE_AUTHORS",
  UPDATE_REQUESTS: "UPDATE_REQUESTS",
  UPDATE_PRS: "UPDATE_PRS",
};
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.UPDATE_BOOK:
      return produce(state, (draft) => {
        draft.book = { ...draft.book, ...payload };
      });
    case types.UPDATE_TITLE:
      return produce(state, (draft) => {
        draft.book.title = payload;
      });
    case types.UPDATE_BODY:
      return produce(state, (draft) => {
        draft.book.body = payload;
      });
    case types.UPDATE_SYNOPSIS:
      return produce(state, (draft) => {
        draft.book.synopsis = payload;
      });
    case types.SET_ERROR:
      return produce(state, (draft) => {
        draft.error = payload;
      });
    case types.SET_MESSAGES:
      return produce(state, (draft) => {
        draft.messages = payload;
      });
    case types.SET_READ:
      return produce(state, (draft) => {
        draft.read = payload;
      });
    case types.SET_MOBILE_BODY:
      return produce(state, (draft) => {
        draft.mobileBody = payload;
      });
    case types.UPDATE_JOIN_ID:
      return produce(state, (draft) => {
        draft.book.joinID = payload;
      });
    case types.UPDATE_REQUESTED:
      return produce(state, (draft) => {
        draft.book.requested = payload;
      });
    case types.UPDATE_AUTHORS:
      return produce(state, (draft) => {
        draft.book.authors = [...payload].push(draft.book.authors);
      });
    case types.UPDATE_REQUESTS:
      return produce(state, (draft) => {
        draft.book.requests = draft.book.requests.filter(
          (data) => data.id !== payload
        );
      });
    case types.UPDATE_PRS:
      return produce(state, (draft) => {
        draft.book.prs = payload;
      });
    default:
      throw new Error("invalid type");
  }
};
