import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";
// import { useHistory, Link } from "react-router-dom";


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */
// const [Product,setproduct] = useState([]);
// const Product =
// {
// "name":"Tan Leatherette Weekender Duffle",
// "category":"Fashion",
// "cost":150,
// "rating":4,
// "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
// "_id":"PmInA797xJhMIPti"
// }
const Products = () => {
  const [NewProduct, nsetproduct] = useState([]);
  const [Product, setproduct] = useState([]);
  const [loading, setload] = useState(false);
  const [noproduct, boolean] = useState(false);
  const [timeoutid, timer] = useState(null);
  const [search, box] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [Token, settoken] = useState("");
  const [cartData, setcart] = useState([]);
 
  // const [Searched,setSearched] = useState(false)

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  // const history = useHistory();

  const performAPICall = async () => {
    try {
      setload(true);
      const res = await axios.get(config.endpoint + "/products");
      setload(false);
      setproduct(res.data);
      localStorage.getItem("token") && settoken(localStorage.getItem("token"));
      return res.data;
    } catch (err) {
      setload(false);
    }
  };
  useEffect(() => {
    performAPICall();

    // code to run after render goes here
  }, []); //

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const newproduct = await axios.get(
        config.endpoint + `/products/search?value=${text.target.value}`
      )
      // setSearched(true);
      nsetproduct(newproduct.data);
      boolean(false);
    } catch (err) {
      if (err.response.status === 404) {
        boolean(true);
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    box(event.target.value); 
    if (timeoutid) {
      clearTimeout(timeoutid);
    }

    const toutid = setTimeout(() => {
      performSearch(event);
    }, debounceTimeout);
    timer(toutid);
    // clearTimeout(timeoutid);
  };
  const isItemInCart = (productid) => {
    if (cartData.find((x) => x.productId === productid)) {
      return true;
    } else {
      return false;
    }
  };
  const fetchCart = async (token) => {
    try {
      const res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setcart(res.data);
    } catch (err) {}
  };
  const addToCart = async (productid, Token) => {
    if (!isItemInCart(productid)) {
      if (!Token) {
        enqueueSnackbar("please login to add items to cart", {
          variant: "warning",
        });
        return;
      }
      try {
        const response = await axios.post(
          `${config.endpoint}/cart`,
          {
            productId: productid,
            qty: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        setcart(response.data); 
        // fetchCart(Token);
      } catch (err) {}
    } else {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
    }
  };
  //  const gi =[{
  //     "name" :  "Tan Leatherette Weekender Duffle",
  //     "qty": 2
  //  },{
  //   "name" :  "The Minimalist Slim Leather Watch",
  //   "qty": 1
  //  },{
  //   "name" :  "YONEX Smash Badminton Racquet",
  //   "qty": 3
  //  }]

  // let convert = (given)=>{
  //    let want =  given.forEach((y)=>(
  //      {...y,

  //      "productId": Product.find((x)=>x.name===y.name)._id

  //    }))
  //    want.forEach((x)=>(delete x.name))
  //    (want);
  //    return want;
  // }

  useEffect(() => {
    // addToCart(3,"BW0jAAeDJmlZCF8i")
    fetchCart(localStorage.getItem("token"));
    
    // convert(gi);
  }, [Token]);


  const quantity = async (add, productid, quant) => {
    if (add) {
      try {
        const response = await axios.post(
          `${config.endpoint}/cart`,
          {
            productId: productid,
            qty: quant + 1,
          },
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        setcart(response.data);  
        // fetchCart(Token);
      } catch (err) {
      }
    } else {
      try {
        const response = await axios.post(
          `${config.endpoint}/cart`,
          {
            productId: productid,
            qty: quant - 1,
          },
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        setcart(response.data);  
        // fetchCart(Token);
      } catch (err) {
      }
    }
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          onChange={(e) => debounceSearch(e, 500)}
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container spacing={2}>
        <Grid
          item
          className="product-grid"
          md={localStorage.getItem("username") && 9}
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          {loading ? (
            <Grid container justifyContent="center" alignItems="center">
              <CircularProgress />
              <p>Loading Products</p>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {search.split("").length !== 0 ? (
                <>
                  {noproduct ? (
                    <p>No products found</p>
                  ) : (
                    <>
                      {NewProduct.map((x) => (
                        <Grid item xs={6} md={3} key={x._id}>
                          {" "}
                          <ProductCard
                            product={x}
                            handleAddToCart={() => {
                              addToCart(x._id, Token);
                            }}
                          />
                        </Grid>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <>
                  {Product.map((x) => (
                    <Grid item xs={6} md={3} key={x._id}>
                      {" "}
                      <ProductCard
                        product={x}
                        handleAddToCart={() => {
                          addToCart(x._id, Token);
                        }}
                      />
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          )}
        </Grid>
         {localStorage.getItem("username") && (
        <Grid className="cartclass" item xs={12} md={3}>
           <Cart
              products={Product}
             items={generateCartItemsFrom(cartData, Product)}
             handleQuantity={quantity}
           />
           </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};
// export{addToCart}
export default Products;
//   <div className="user">{user}</div>
// ))}
