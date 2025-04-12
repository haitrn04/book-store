
import { Navbar, Main, Product, Footer,Chat } from "../components";

function Home() {
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;



  return (
    <>
    
      <Navbar user={storedUser} />
      <Main />
      <Product />
      <Footer />
      <Chat/>
    </>
  );
}

export default Home;
