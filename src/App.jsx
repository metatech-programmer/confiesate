import "./App.css";
import BtnTop from "./components/BtnTop";
import Footer from "./components/Footer";
import LandingTitle from "./components/LandingTitle";
import Masonry from "./components/Masonry";
import Menu from "./components/Menu";
import items from  "./assets/constants/items.json"

function App() {
  

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
