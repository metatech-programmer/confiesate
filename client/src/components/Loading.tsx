
const Loading = () => {

  const sizeImage = [
    "851x315",
    "1200x628",
    "1200x630",
    "1080x1080",
    "1200x1800",
    "600x600",
  ];

  return (
    <>
      <section className="columns-2 md:columns-4 gap-4 px-4 md:px-16 md:pt-4">
        {Array.from({ length: 10 }).map((_) => (
          <div className="break-inside-avoid mb-4 md:hover:scale-105 bg-app-bluePurple rounded-xl transition-all md:hover:shadow-lg md:hover:shadow-app-purple/70 mix-blend-plus-darker relative hover:cursor-pointer">
            <div className="relative">
              <img
                className="rounded-t-xl shadow w-full h-auto object-contain bg-app-purple max-w-[100dvh] max-h-[70dvh] hover:opacity-70 transition-all"
                src={`https://dummyimage.com/${
                  sizeImage[Math.floor(Math.random() * sizeImage.length)]
                }`}
              />
            </div>
            <div className="p-1 md:p-3 bg-app-bluePurple bg-opacity-70 rounded-b-lg md:rounded-b-xl flex font-open-sans justify-evenly items-center">
              <section className="font-semibold text-white text-xs flex truncate  items-center w-full justify-between gap-2">
                <div className="flex items-center w-2/3 truncate">
                  <div
                    className="size-5 md:size-7 bg-center bg-no-repeat  rounded-full animate-fade-in-up mr-2  bg-contain truncate "
                    style={{
                      backgroundImage: `url('https://avatar.iran.liara.run/public/1')`,
                    }}
                  />
                  <span className="truncate  md:w-full text-xs"># Anonimo</span>
                </div>
                <div className="flex items-center justify-end space-x-1 md:space-x-3 w-1/2 ">
                  <button className=" hover:scale-110 active:scale-110 transition-all">
                    {" "}
                    <svg
                      className=" stroke-slate-400 fill-app-blue/70 hover:fill-app-blue "
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="md:hover:scale-110 active:scale-110 mr-3 z-50  transition-all fill-app-red stroke-app-red/70 "
                    aria-label="Like"
                  >
                    <svg
                      viewBox="0 0 1024.00 1024.00"
                      className="w-6 h-6"
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
                </div>
              </section>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Loading;
