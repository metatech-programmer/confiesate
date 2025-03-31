import silence from "../assets/images/silence.gif";

const LandingTitle = () => {
  return (
    <article className="bg-gradient-to-b from-app-soft  to-transparent text-white flex flex-col justify-center w-full h-dvh items-center gap-8 overflow-hidden">
      <div
        className=" size-64 md:size-72   bg-center bg-no-repeat  rounded-full animate-fade-in-up"
        style={{
          backgroundImage: `url(${silence})`,
          backgroundSize: "cover",
          filter: "drop-shadow(1px 0px 90px #d9a667)",
        }}
      />
      <h1 className="font-lacquer text-6xl md:text-9xl text-center text-app-purple flex justify-center items-center gap-4 flex-col z-30  animate-fade-in-up">
        CONFIESATE{" "}
        <span className="text-4xl text-app-purple/30 font-bold">
          you need it
        </span>
      </h1>
    </article>
  );
};

export default LandingTitle;
