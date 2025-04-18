import "./App.css";
import BtnTop from "./components/BtnTop";
import Footer from "./components/Footer";
import LandingTitle from "./components/LandingTitle";
import Masonry from "./components/Masonry";
import Menu from "./components/Menu";
import { Item } from "./types/Item";
import itemsData from "./assets/constants/items.json";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";

function App() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const getTitle = (data: string) => {
    if (data.includes("confesiones")) {
      console.log("confesiones yei");
    } else if (data.includes("ciudadanos")) {
      console.log("ciudadanos yei");
    } else {
      console.log("todos yei");
    }

    setTitle(data);
    window.scrollTo({
      top: 400,
      behavior: "smooth", // para que el scroll sea suave
    });
  };

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [title]);


  const [items, setItems] = useState<Item[]>(itemsData );

  return (
    <div className="w-full bg-gradient-to-b from-transparent from-70%  to-app-bluePurple/50 pb-24 relative">
      <LandingTitle />
      <Menu titlePage={getTitle} />
      <h1 className="md:text-2xl text-app-purple font-lacquer text-pretty mb-5 md:my-5 md:mx-14 mx-5 uppercase font-extrabold animate-fade-in-up">
        {title} ...
      </h1>
      {loading ? <Loading /> : <Masonry items={items} />}
      <BtnTop />
      <Footer />
    </div>
  );
}

export default App;
