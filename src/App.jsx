import "./App.css";
import BtnTop from "./components/BtnTop";
import Footer from "./components/Footer";
import LandingTitle from "./components/LandingTitle";
import Masonry from "./components/Masonry";
import Menu from "./components/Menu";

function App() {
  
  const items = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    alt: `Un chico de 18 años con una cerveza en la mano ${i + 1}`,
  }));

  return (
    <div className="w-full bg-gradient-to-b from-transparent from-70%  to-app-bluePurple/50 pb-24 relative">
      <LandingTitle />
      <Menu />
      <Masonry items={items} />
      <BtnTop />
      <Footer/>
    </div>
  );
}

export default App;
