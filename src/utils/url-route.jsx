const URL = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
  },
  PUBLIC: {
    HOME: "/",
  },
  PRIVATE: {
    HOME: "/admin",
    COLLECTION: "/collection",
    COLLECTION_DETAIL: "/collection/:id",
  },
};

export default URL;
