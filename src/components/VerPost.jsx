import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import items from "../assets/constants/items.json";

const VerPost = ({ isOpen, onClose, postId }) => {
  const [post, setPost] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
    const element = document.getElementById("descPost");
    element.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUpComments = () => {
    const element = document.getElementById("comments");
    element.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (postId) {
      const postFound = items.find((item) => item.id === postId);
      if (postFound) {
        setPost(postFound);
      }
    }
  }, [postId]);

  useEffect(() => {
    setShowMore(false);
  }, [post]);

  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-5xl mx-auto h-[86dvh] max-h-[90dvh] overflow-y-auto rounded-lg py-5 md:py-0 md:rounded-l-lg">
        <div className="flex flex-col md:flex-row bg-app-purple/10 rounded-lg md:h-full">
          {/* Left side - Image */}
          <div className="bg-app-purple/10 h-[27dvh] md:h-full md:w-[65%] ">
            {post?.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full object-contain h-full"
              />
            )}
          </div>

          {/* Right side - Content */}
          <div className="md:w-[35%] flex flex-col">
            {/* Header with user info */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-full bg-gray-200 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://avatar.iran.liara.run/public/${post?.id}')`,
                  }}
                >
                  {/* User avatar placeholder */}
                </div>
                <div className="font-semibold text-md">{post?.author}</div>
              </div>
            </div>

            {/* Comments section */}
            <div className="relative flex flex-col items-baseline   overflow-y-auto p-4 "  id="comments">
              {/* Main post content */}
              <div className="mb-4 w-full">
                <h2
                  className={
                    "font-bold mb-2 text-app-blue text-balance truncate" +
                    " " +
                    (showMore ? "" : "line-clamp-2")
                  }
                >
                  {post?.title}
                </h2>
                <p
                  id="descPost"
                  className={
                    "px-1 text-sm text-pretty overflow-y-auto max-h-40" +
                    " " +
                    (showMore ? "" : "line-clamp-3 truncate")
                  }
                >
                  {post?.description}
                </p>
                <span
                  className={
                    "text-sm cursor-pointer " +
                    " " +
                    (showMore
                      ? "text-app-blue hover:text-white/50"
                      : "text-gray-200 hover:text-app-blue")
                  }
                  onClick={() => toggleShowMore()}
                >
                  {showMore ? "Ver menos" : "Ver mas..."}
                </span>
              </div>

              {/* Comments list */}
              <div className="flex flex-col space-y-2 h-0 md:h-auto relative">
                {post?.comments?.map((comment, index) => (
                  <div key={index} className="flex space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                    <div>
                      <span className="font-semibold mr-2 opacity-60 text-app-soft">
                        {comment.author}
                      </span>
                      <span className="text-sm  text-gray-500 text-pretty">
                        {comment.text}
                      </span>
                    </div>
                  </div>
                ))}
                   <div onClick={() => handleUpComments()}
                className="sticky -bottom-4 w-max md:w-auto text-center opacity-90 bg-app-blue text-gray-200 px-12 py-0 rounded-t-full border backdrop-blur-2xl transition-all border-white left-0 right-0 mx-auto cursor-pointer md:hover:opacity-100 active:opacity-100 text-xs "
                style={{ backdropFilter: "blur(2px)" }}
              >
                <span>Volver arriba</span>
              </div>
              </div>
           
            </div>

            {/* Footer with actions */}
            <div className="p-4 border-t flex  flex-col gap-3">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <button className="hover:text-gray-600 flex gap-2">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {post?.likes}
                  </button>
                  <button className="hover:text-gray-600 flex gap-2">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    {post?.comments?.length}
                  </button>
                </div>
              </div>
              <div>
                <form action="#" className="flex w-full justify-between gap-3 ">
                  <textarea
                    type="text"
                    className="w-full p-1 border border-gray-300 rounded-md  bg-app-bluePurple/40"
                    placeholder="Agregar un comentario..."
                  />
                  <button
                    type="submit"
                    className="border border-gray-300 p-2 rounded-md hover:bg-black/30"
                  >
                    Publicar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VerPost;
