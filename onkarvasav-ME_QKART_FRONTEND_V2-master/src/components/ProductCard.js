import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
// import {addToCart} from "./Products"

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card"  >
       <CardMedia
          
          component="img"
          height="220"
          image= {product.image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" color="text.secondary">
            {product.name}
          </Typography>
          <Typography variant="h5" >
           ${product.cost}
          </Typography>
          <Rating name="read-only" value={product.rating} readOnly />
        </CardContent>
        <Button onClick={handleAddToCart} className="button" variant="contained">ADD TO CART</Button>
    </Card>
  )}

  export default ProductCard;
