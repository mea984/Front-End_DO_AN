import React from "react";
import URL from "../utils/url-route";
import Collection from "../components/Collection";
import CollectionDetail from "../components/CollectionDetail";

const privateRouter = [
  {
    path: URL.PRIVATE.COLLECTION,
    element: <Collection />,
  },
  {
    path: URL.PRIVATE.COLLECTION_DETAIL,
    element: <CollectionDetail />,
  },
];

export default privateRouter;
