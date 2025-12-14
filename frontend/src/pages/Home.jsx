import CountrySelector from "../components/CountrySelector.jsx";
import RoleCards from "../components/RoleCards.jsx";
import "../styles/home.css";

const Home = () => (
  <div className="rb-home-split">
    {/* Left: full-height image */}
    <div className="rb-home-left">
      <div className="rb-home-left-overlay" />
      <div className="rb-home-left-text">
        
        <p>
          See nearby suppliers, distances and availability on a colourful,
          responsive map.
        </p>
      </div>
    </div>

    {/* Right: all content */}
    <div className="rb-home-right">
      <section className="rb-home-right-inner">
        <header className="rb-home-header">
          <h1>RoadNBrick</h1>
          <p>
            Connect contractors and material suppliers using live maps, distance
            filters and a simple quotation workflow.
          </p>
          <CountrySelector />
        </header>

        <section className="rb-what">
          <h2>Why RoadNBrick?</h2>
          <p>
            RoadNBrick helps contractors discover suppliers by location, price
            and availability, while suppliers receive clear, structured
            requests they can accept or reject with a quotation.
          </p>
        </section>

        <section className="rb-roles">
          <RoleCards />
        </section>
      </section>
    </div>
  </div>
);

export default Home;
