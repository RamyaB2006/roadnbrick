import Navbar from "./components/Navbar.jsx";
import AppRouter from "./router.jsx";

const App = () => {
  return (
    <div className="rb-app">
      <Navbar />
      <main className="rb-main">
        <AppRouter />
      </main>
    </div>
  );
};

export default App;
