import React from 'react'
import { Footer, Navbar, Product,Chat } from "../components"

const Products = () => {
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;



  return (
    <>
    
      <Navbar user={storedUser} />
      <Product />
      <Footer />
      <Chat/>
    </>
  )
}

export default Products