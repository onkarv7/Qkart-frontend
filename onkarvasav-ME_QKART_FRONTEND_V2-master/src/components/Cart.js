import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack,Grid } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
// import Grid from '@material-ui/core/Grid'

  


// import { arrayBuffer } from "stream/consumers";

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) return;
  let nextdata = cartData.map((x) => ({
    ...x,
    ...productsData.find((y) => x.productId === y._id),
  }));
  return nextdata;
  // let arr = []
  //  productsData.forEach((x)=>{
  //    cartData.forEach((y)=>{
  //      if(y.productId===x._id){
  //        arr.push(y);
  //      }
  //    })
  //  })
  //  return arr;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items) => {
  
  let x = 0;
  items.forEach((y) => {
    x = x + y.qty * y.cost;
  });
  return x;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
// const handleAdd = () =>{

// }
const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};


/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ products, items = [], handleQuantity,isReadOnly }) => {
  const history = useHistory();
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }
  console.log(items[0]); 
  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        {items.map(
          (item) =>
            (
              <Box
                key={item._id}
                display="flex"
                alignItems="flex-start"
                padding="1rem"
              >
                <Box className="image-container">
                  <img
                    // Add product image
                    src={item.image}
                    // Add product name as alt eext
                    alt={item.name}
                    width="100%"
                    height="100%"
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
                >
                  <div>{item.name}</div>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
            >{isReadOnly?<p>Qty:{item.qty}</p>:
                    <ItemQuantity
                      value={item.qty}
                      handleAdd={() => handleQuantity(true, item._id, item.qty)}
                      handleDelete={() =>
                        handleQuantity(false, item._id, item.qty)
                      }
                      // Add required props by checking implementation
                    />}
                    <Box padding="0.5rem" fontWeight="700">
                         ${item.cost}
                    </Box>
                  </Box>
                </Box>
              </Box>
            )
        )}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          {isReadOnly?<></>:<Button
          onClick={()=>history.push("/checkout")}
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
          >
            Checkout
          </Button>}
        </Box>
      </Box>
      {isReadOnly?
      <Box className="cart">
      <Box item align="left" justify="center" padding="1rem"  > 
         <h3>Order Details</h3>
     </Box>
      <Box padding="1rem" display="flex" justifyContent="space-between"  container>
     <Box item align="left" justify="center" > 
         Products
     </Box>
     <Box  item align="right" justify="center" xs={6}>
        {items.length}
     </Box>
       </Box>
       <Box padding="1rem" display="flex" justifyContent="space-between"  container>
     <Box item align="left" justify="center" > 
         Subtotal
     </Box>
     <Box  item align="right" justify="center" xs={6}>
        ${getTotalCartValue(items)}

     </Box>
       </Box>
       <Box padding="1rem" display="flex" justifyContent="space-between"  container>
     <Box item align="left" justify="center" > 
         Shipping charges
     </Box>
     <Box  item align="right" justify="center" xs={6}>
        0
     </Box>
       </Box>
       
       
      <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            <h3>Total</h3>
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
          </Box>
         
        </Box>:<></>
}        
      
    </>
  );
};

export default Cart;
