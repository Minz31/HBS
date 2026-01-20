import SearchBar from "../components/SearchBar";

function Home() {
  return (
    <div className="max-w-[1200px] mx-auto mt-8 px-4">


      <h1 className="text-3xl font-bold text-center md:text-left">
        Save up to 55% on your next hotel stay
      </h1>

      {/* <p className="text-gray-600 mt-2 text-lg text-center md:text-left">
        Get Offers 
      </p> */}

      <SearchBar />
    </div>
  );
}

export default Home;
