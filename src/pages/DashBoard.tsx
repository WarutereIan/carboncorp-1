import BarChart from "../components/BarChart";
import GeographyChart from "../components/GeographyChart";
import Header from "../components/Header";

const DashBoard = () => {
  return (
    <div>
        <Header title="DASHBOARD" subtitle="Welcome to Carbon Corp's dashboard"/>
      <section className="my-3 grid lg:grid-cols-3 gap-8">
        <article className="rounded-lg p-5 h-[20vh] bg-[#1f2a40]">
          <h4 className="my-3">Carbon Sales Quantity</h4>
          <BarChart />
        </article>
        <article className="rounded-lg p-5 h-[20vh] bg-[#1f2a40]">
          <h4>Geography Based Carbon Traffic</h4>

          <GeographyChart />
        </article>
      </section>
    </div>
  );
};

export default DashBoard;
