import Server from "../src/index";

const servidor = new Server();
console.clear();
servidor.start();
export default servidor.app;
