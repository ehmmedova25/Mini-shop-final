import HeroBanner from "./HeroBanner";
import RecentlyViewed from "../../components/RecentlyViewed";
import ProductList from "../Home/components/ProductList";
import BrowseByStyle from "./Browsebystyle";

const Home = () => {
  return (
    <>
      <HeroBanner />

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
        <ProductList />
        <RecentlyViewed />
        <BrowseByStyle/>
      </div>
    </>
  );
};

export default Home;