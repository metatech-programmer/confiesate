import React, { useState } from "react";

const Masonry = ({ items }) => {
  const [likedItems, setLikedItems] = useState({});
  const sizeImage = ['851x315','1200x628','1200x630','1080x1080', '1200x1800', '600x600'];

  const handleClick = (itemId) => {
    setLikedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <>
    <section className="columns-2 md:columns-4 gap-4 px-4 md:px-16 md:pt-4">
      {items.map((item) => (
        <div key={item.id} className="break-inside-avoid mb-4 md:hover:scale-105 bg-app-bluePurple rounded-xl transition-all md:hover:shadow-lg md:hover:shadow-app-purple/70 mix-blend-plus-darker relative hover:cursor-pointer">
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-black to-transparent z-40 opacity-0 md:hover:opacity-20 absolute"></div>
          <img
            key={item.id}
            className="rounded-t-xl shadow w-full h-auto object-contain bg-app-bluePurple max-w-[100dvh] max-h-[70dvh]"
            src={
              item.src
                ? item.src
                : `https://dummyimage.com/${sizeImage[Math.floor(Math.random() * sizeImage.length)]}`
            }
            alt={item.alt}
          />
          <div className="p-1 md:p-3 bg-app-bluePurple bg-opacity-70 rounded-b-lg md:rounded-b-xl flex font-open-sans justify-evenly items-center">
            <section className="font-semibold text-white text-xs flex truncate  items-center w-full justify-between i">
              <div className="flex items-center">
                <div
                  className="size-7 bg-center bg-no-repeat  rounded-full animate-fade-in-up mr-2  bg-contain truncate "
                  style={{
                    backgroundImage: `url('https://avatar.iran.liara.run/public/${Math.floor(
                      Math.random() * 100
                    )}')`,
                  }}
                />
                <span className="truncate w-20 md:w-full">
                  Anonimo #{Math.floor(Math.random() * 10000)}
                </span>
              </div>
              <button
                type="button"
                className={
                  "size-6 \\mr-3 z-50  " +
                  (likedItems[item.id]
                    ? " fill-app-red stroke-app-red/70"
                    : "fill-stone-700  stroke-slate-400")
                }
                aria-label="Like"
                onDoubleClick={() => handleClick(item.id)}
              >
                <svg
                  viewBox="0 0 1024.00 1024.00"
                  class="icon"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke-width="8.192"
                  transform="rotate(0)matrix(-1, 0, 0, 1, 0, 0)"
                >
                  <g
                    id="SVGRepo_bgCarrier"
                    stroke-width="0"
                    transform="translate(87.04000000000002,87.04000000000002), scale(0.83)"
                  ></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="40.96"
                  >
                    <path d="M725.333333 192c-89.6 0-168.533333 44.8-213.333333 115.2C467.2 236.8 388.266667 192 298.666667 192 157.866667 192 42.666667 307.2 42.666667 448c0 253.866667 469.333333 512 469.333333 512s469.333333-256 469.333333-512c0-140.8-115.2-256-256-256z"></path>
                  </g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M725.333333 192c-89.6 0-168.533333 44.8-213.333333 115.2C467.2 236.8 388.266667 192 298.666667 192 157.866667 192 42.666667 307.2 42.666667 448c0 253.866667 469.333333 512 469.333333 512s469.333333-256 469.333333-512c0-140.8-115.2-256-256-256z"></path>
                  </g>
                </svg>
              </button>
            </section>
          </div>
        </div>
      ))}
    </section>
    </>

  );
};

export default Masonry;
