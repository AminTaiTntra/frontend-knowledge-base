import React from "react";
import { PostCardContext } from "../componets/PostCardComponent";

const usePostCardContext = () => {
    const context = React.useContext(PostCardContext);
    if (!context) {
        throw new Error("PostCardComponent.Title must be used within a PostCardComponent");
    }
    return context;
};

export default usePostCardContext;