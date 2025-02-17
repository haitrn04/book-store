
import { Navbar, Main, Product, Footer } from "../components";

function Home() {
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;



  return (
    <>
    
      <Navbar user={storedUser} />
      <Main />
      <Product />
      <Footer />
    </>
  );
}

export default Home;
