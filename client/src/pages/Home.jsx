import Banner from '../components/Banner';
import Categories from '../components/Categories';
import TrustBar from '../components/TrustBar';
import BestSellers from '../components/BestSellers';
import BottomBanner from '../components/BottomBanner';

const Home = () => {
  return (
    <div>
      <Banner />
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 overflow-visible">
        <TrustBar />
        <Categories />
        <BestSellers />
        <BottomBanner />
      </div>
    </div>
  );
};

export default Home;
