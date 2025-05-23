import { useEffect, useState } from "react";
import CrearPost from "./CrearPost";
import useModal from "../hooks/useModal";

type MenuProps = {
  titlePage: (title: string) => void;
};

const Menu = ({ titlePage }: MenuProps) => {
  const createPostModal = useModal();
  const [title, setTitle] = useState(
    "Todos los post de la comunidad en un solo lugar"
  );

  useEffect(() => {
    titlePage(title);
  }, [title, titlePage]);

  return (
    <>
      <CrearPost
        isOpen={createPostModal.isOpen}
        onClose={createPostModal.closeModal}
      />
      <div className="flex justify-center items-center gap-4 fixed md:sticky bottom-7 md:-bottom-full md:top-[2dvh] border bg-app-bluePurple/50 rounded-full h-fit p-1 w-max mx-2 md:mx-auto  z-[60] text-app-soft transition-all backdrop-blur-sm overflow-hidden ">
        <ul className="flex justify-center items-center gap-0  md:gap-1 text-lg w-full">
          <li className="inline-block mx-2 hover:scale-105 transition-all">
            <button
              onClick={() =>
                setTitle("Todos los post de la comunidad en un solo lugar")
              }
              className="font-lacquer hover:text-slate-200 transition-all lowercase hover:underline underline-offset-3 hover:decoration-wavy"
            >
              Todos
            </button>
          </li>
          <li className="inline-block mx-2 hover:scale-105 transition-all">
            <button
              onClick={() => setTitle("Todos los post de confesiones")}
              className="font-lacquer hover:text-slate-200 transition-all lowercase hover:underline underline-offset-3 hover:decoration-wavy"
            >
              Confesiones
            </button>
          </li>
          <li className="inline-block mx-2 hover:scale-105 transition-all">
            <button
              onClick={() => setTitle("Todos los post de los ciudadanos")}
              className="font-lacquer hover:text-slate-200 transition-all lowercase hover:underline underline-offset-3 hover:decoration-wavy"
            >
              Ciudadanos
            </button>
          </li>
          <li className="inline-block hover:scale-95  transition-all">
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                createPostModal.openModal();
              }}
              className="font-lacquer bg-app-red/80 hover:text-slate-200 transition-all lowercase  hover:uppercase  rounded-full  h-min flex w-20 items-center justify-evenly md:hover:scale-95 active:scale-95"
            >
              <svg
                className="inline-block size-5"
                viewBox="0 0 32 32"
                version="1.1"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <title>plus-circle</title>{" "}
                  <desc>Created with Sketch Beta.</desc> <defs> </defs>{" "}
                  <g
                    id="Page-1"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    {" "}
                    <g
                      id="Icon-Set-Filled"
                      transform="translate(-466.000000, -1089.000000)"
                      fill="#f5f5f5"
                    >
                      {" "}
                      <path
                        d="M488,1106 L483,1106 L483,1111 C483,1111.55 482.553,1112 482,1112 C481.447,1112 481,1111.55 481,1111 L481,1106 L476,1106 C475.447,1106 475,1105.55 475,1105 C475,1104.45 475.447,1104 476,1104 L481,1104 L481,1099 C481,1098.45 481.447,1098 482,1098 C482.553,1098 483,1098.45 483,1099 L483,1104 L488,1104 C488.553,1104 489,1104.45 489,1105 C489,1105.55 488.553,1106 488,1106 L488,1106 Z M482,1089 C473.163,1089 466,1096.16 466,1105 C466,1113.84 473.163,1121 482,1121 C490.837,1121 498,1113.84 498,1105 C498,1096.16 490.837,1089 482,1089 L482,1089 Z"
                        id="plus-circle"
                      >
                        {" "}
                      </path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>{" "}
              New{" "}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Menu;
