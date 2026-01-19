import SearchBar from "../components/SearchBar";

function Home() {
  return (
    <div className="max-w-[1300px] mx-auto mt-12 px-4">

      <h1 className="text-4xl font-bold text-center md:text-left">
        Save up to 55% on your next hotel stay
      </h1>

      <p className="text-gray-600 mt-2 text-lg text-center md:text-left">
        We compare hotel prices from over 100 sites
      </p>

      <SearchBar />
    </div>
  );
}

export default Home;
