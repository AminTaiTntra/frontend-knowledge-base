import React from "react";
import usePostCardContext from "../hooks/usePostCardContext";

type PostCardContextType = {
    post: PostCardProps;
};


type PostCardProps = {
    id: number
    title: string
    content: string
    user: {
        id: number
        name: string
    },
    isOnProfilePage?: boolean
};

type Props =  {
    post: PostCardProps;
    children: React.ReactNode;
};


export const PostCardContext = React.createContext<PostCardContextType | undefined>(undefined);


export default function PostCardComponent({ children, post }: Props) {
    return (
        <PostCardContext.Provider value={{ post }}>
            <div className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-300">
                {children}
            </div>
        </PostCardContext.Provider>
    )
}


PostCardComponent.Id = function PostCardId() {
    const {post} = usePostCardContext();

    return (
        <div className="bg-gray-200 h-32 flex items-center justify-center">
            <span className="text-black font-bold text-center block">{post.id}</span>
        </div>
    );
}

PostCardComponent.Title = function PostCardTitle() {
    const {post} = usePostCardContext();

    return <h2 className="text-2xl font-bold text-black mb-2">{post.title}</h2>;
}

PostCardComponent.Content = function PostCardContent() {
    const {post} = usePostCardContext();

    return <p className="text-gray-700 text-sm mb-4 leading-relaxed">{post.content}</p>;
}

PostCardComponent.Author = function PostCardAuthor() {
    const {post} = usePostCardContext();

    if (post.isOnProfilePage) return null;

    return <p className="text-xs text-gray-600 font-medium mb-6">By <span className="font-semibold text-black">{post.user.name}</span></p>;
}

PostCardComponent.Actions = function PostCardActions() {
    return (
        <div className="flex gap-3">
            <button className="flex-1 bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200">
                Read More
            </button>
            <button className="flex-1 border-2 border-black text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200">
                Like
            </button>
        </div>
    )
}   