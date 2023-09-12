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
import { generateCartItemsFrom, getTotalCartValue } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


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

const Products = () => {
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
  let { enqueueSnackbar } = useSnackbar();

  let [product, setProduct] = useState([]);
  let [load, setLoad] = useState(false);
  let [cartItem, setCartItem] = useState([]);

  let [timeoutId, setTimeoutId] = useState(null);



  let token = localStorage.getItem("token");
  let username = localStorage.getItem("username");

  //console.log(cartItem)

  const performAPICall = async () => {
    setLoad(true);

    try {
      let response = await axios.get(`${config.endpoint}/products`);
      console.log(response.data);
      setProduct(response.data);

      setLoad(false);
    } catch (e) {
      if (e.response.status === 500) {
        enqueueSnackbar(`${e.response.data.message}`, { variant: "error" });
      }
    }

    setLoad(false);
  };

  useEffect(() => {
    performAPICall();
  }, []);
  

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setLoad(true);

    try {
      let response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      // console.log(text)
      setProduct(response.data);

      setLoad(false);
    } catch (e) {
      setLoad(false);

      // console.log(e.response.status);

      if (e.response.status === 404) {
        setProduct([]);
      }
    }
  };

  // useEffect(()=> {
  //   performSearch(search)
  // },[search])

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
    let text = event.target.value;
    //  setSearch(event.target.value)

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    let time = setTimeout(async () => {
      await performSearch(text);
    }, 1000);

    setTimeoutId(time);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data

      let res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(await res.data)

      // console.log(product)

      //console.log(cartItem)

      //setCartItem(generateCartItemsFrom(await res.data ,  product))

      ////console.log(cartItem)

      // getTotalCartValue(cartItem)

      return await res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  useEffect(() => {
    fetchCart(token)
      .then((cartData) => generateCartItemsFrom(cartData, product))
      .then((cartItems) => setCartItem(cartItems));
  }, [product]);

  

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let itemAlreadyPresent = false;

    for (let i = 0; i < items.length; i++) {
      if (items[i].productId === productId) {
        itemAlreadyPresent = true;
      }
     
    }
    return itemAlreadyPresent;
  }

    /**
     * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
     *
     * @param {string} token
     *    Authentication token returned on login
     * @param { Array.<{ productId: String, quantity: Number }> } items
     *    Array of objects with productId and quantity of products in cart
     * @param { Array.<Product> } products
     *    Array of objects with complete data on all available products
     * @param {string} productId
     *    ID of the product that is to be added or updated in cart
     * @param {number} qty
     *    How many of the product should be in the cart
     * @param {boolean} options
     *    If this function was triggered from the product card's "Add to Cart" button
     *
     * Example for successful response from backend:
     * HTTP 200 - Updated list of cart items
     * [
     *      {
     *          "productId": "KCRwjF7lN97HnEaY",
     *          "qty": 3
     *      },
     *      {
     *          "productId": "BW0jAAeDJmlZCF8i",
     *          "qty": 1
     *      }
     * ]
     *
     * Example for failed response from backend:
     * HTTP 404 - On invalid productId
     * {
     *      "success": false,
     *      "message": "Product doesn't exist"
     * }
     */
    const addToCart = async (
      token,
      items,
      products,
      productId,
      qty,
      options = { preventDuplicate: false}
    ) => {
      console.log("clicked");
      if (!token) {
        enqueueSnackbar("Login to add an item to the Cart", {
          variant: "error",
        });
        return;
      }

      if ( isItemInCart(items, productId) && (options.preventDuplicate)  ) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "warning" }
        );
        return;
      }
      try {
        let res = await axios.post( `${config.endpoint}/cart`,
          {  productId: productId,
            qty: qty ,},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
let result = generateCartItemsFrom( res.data, products)
console.log(result)
        setCartItem(result);
        console.log(cartItem)
        console.log("inside try")
      } catch (e) {
        if (e.res.status === 404) {
          enqueueSnackbar(e.res.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
            { variant: "error" }
          );
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
          fullwidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, timeoutId)}
        />

        {/* Search view for mobiles */}
        <TextField
          className="search-mobile "
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
          onChange={(e) => debounceSearch(e, timeoutId)}
        />
      </Header>

      <Grid container>
        <Grid item className="product-grid" md={username ? 9 : 12} xs={12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step..
            </p>
          </Box>

          {load ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              py={10}
            >
              <CircularProgress size={40} />
              <h4>Loading Products...</h4>
            </Box>
          ) : (
            <Grid container item spacing={2} my={0.5}>
              {product.length ? (
                product.map((ele) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <ProductCard
                        product={ele}
                        handleAddToCart={async ()=>{
                                   await addToCart(token , cartItem , product , ele._id ,1, {preventDuplicate : true,})
                        }}
                      />
                    </Grid>
                  );
                })
              ) : (
                <Grid container item justifyContent="center">
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    py={10}
                  >
                    <SentimentDissatisfied size={40} />
                    <h4>No products found..!</h4>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>

        {username && (
          <Grid item md={3} xs={12} bgcolor="#E9F5E1">
            <Cart items={cartItem} 
            products={product}
            handleQuantity  = {addToCart} />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
