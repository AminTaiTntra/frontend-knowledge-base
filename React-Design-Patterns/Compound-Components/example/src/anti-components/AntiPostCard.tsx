import React from "react";




type AntiPostCardProps = {
  id: number
  title: string
  content: string
  user: {
    id: number
    name: string
  },
  isOnProfilePage?: boolean,
  shouldDisplayButtons: boolean,
};

type Props = {
  post: AntiPostCardProps;
};

export default function AntiPostCard({ post }: Props) {

  return (
    <div className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-300">
      <div className="bg-gray-200 h-32 flex items-center justify-center">
        <span className="text-black font-bold text-center block">{post.id}</span>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-black mb-2">{post.title}</h2>
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">{post.content}</p>
        {!post.isOnProfilePage && <p className="text-xs text-gray-600 font-medium mb-6">By <span className="font-semibold text-black">{post.user.name}</span></p>}

        {post.shouldDisplayButtons && (
          <div className="flex gap-3">
            <button className="flex-1 bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200">
              Read More
            </button>
            <button className="flex-1 border-2 border-black text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200">
              Like
            </button>
          </div>
        )}
      </div>
    </div>

  )
}
