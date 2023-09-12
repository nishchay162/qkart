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

const ProductCard = ({ product, handleAddToCart }) => {
 // console.log(product)
  return (
    <Card className="card" id ={product._id}>
<CardMedia
       component="img"
        image={product.image}
        title={product.name}
      />
<CardContent>
        <Typography gutterBottom variant="h5" component="div">
        {product.name}
        </Typography>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: "bold" }}
          mb={1}>
        ${product.cost}
        </Typography>
        
       
          <Rating
            name="read-only"
            value={product.rating}
            readOnly
            size="small"
          />
          


</CardContent>
        <CardActions className="card-actions">
        <Button className="card-button"
         variant="contained"  
         fullWidth
          onClick = {handleAddToCart}         
                 >
                <AddShoppingCartOutlined /> &nbsp; ADD TO CART
                 </Button>
                 </CardActions>
        
    </Card>
  );
};

export default ProductCard;
