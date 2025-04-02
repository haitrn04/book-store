// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload;
  let updatedCart;

  switch (action.type) {
    case "ADDITEM":
      // Check if product already in cart
      const exist = state.find((x) => x.id_book === product.id_book);
      if (exist) {
        if(exist.qty >= product.stock) { 
          localStorage.setItem("cart-msg", "1");
          return state
        } else {
          updatedCart = state.map((x) =>
            x.id_book === product.id_book ? { ...x, qty: x.qty + 1 } : x
          );
          localStorage.setItem("cart-msg", "0");
        }
      } else {
        updatedCart = [...state, { ...product, qty: 1 }];
        localStorage.setItem("cart-msg", "0");
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    case "DELITEM":
      const exist2 = state.find((x) => x.id_book === product.id_book);
      if (exist2.qty === 1) {
        updatedCart = state.filter((x) => x.id_book !== exist2.id_book);
      } else {
        updatedCart = state.map((x) =>
          x.id_book === product.id_book ? { ...x, qty: x.qty - 1 } : x
        );
      }
      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    
      case "CLEAR_CART":
        return []; // Xóa toàn bộ giỏ hàng

    default:
      return state;
  }
};

export default handleCart;
