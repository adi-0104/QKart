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
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * @property {string} name - The name or title of the product
 * @typedef {Object} CartItem -  - Data on product added to cart
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  //initialize variables
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  //initialise states
  const [filteredProductData, setFilteredProductData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [CartItems, setCartItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isProductsFound, setProductsFound] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);

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
  const performAPICall = async () => {
    try {
      const url = `${config.endpoint}/products`;
      const response = await axios.get(url);
      const data = response.data;
      // console.log(data);
      return data;
    } catch (err) {
      console.log(err.response.data);
      return null;
    }
  };

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
    try {
      const url = `${config.endpoint}/products/search?value=${text}`;
      const response = await axios.get(url);
      const data = response.data;
      setProductsFound(true);
      return data;
    } catch (err) {
      if (err.response.status === 404) {
        setProductsFound(false);
        return err.response.data;
      } else {
        setProductsFound(false);
        console.log("Check if Backend is Running Correctly");
        return [];
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
    //clear timer if it already exist
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const val = event.target.value;
    setSearchKey(val);
    setLoading(true);
    //set timer for searchAPI call
    const timerID = setTimeout(async () => {
      const data = await performSearch(val);
      setFilteredProductData(data);
      setLoading(false);
    }, 500);
    setDebounceTimeout(timerID);
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
      const req = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return req.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar("Token Invalid, Please Login Again", {
          variant: "error",
        });
        localStorage.clear();
        history.push("/login");
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return [];
    }
  };

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
    //make use off some method of arrays
    return items.some((product) => product.productId === productId);
  };

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
   *
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
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    //is user is logged out -> warning to Log in to add item to cart
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }
    //"ADD to Cart" button
    if (options.preventDuplicate && isItemInCart(items, productId)) {
      //if logged in
      //if product already added to cart -> warning
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }
    //else -> post updated quantity to backend && update local cart state
    try {
      const req = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId: `${productId}`,
          qty: qty,
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCartItems(req.data);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      const data = await performAPICall();
      setProductList(data);
      setFilteredProductData(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      const cartData = await fetchCart(token);
      setCartItems(cartData);
    };
    loadCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productList]);

  return (
    <div>
      <Header children>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <Box className="search-desktop">
          <TextField
            fullWidth
            className="search"
            size="small"
            InputProps={{
              className: "search",
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            value={searchKey}
            onChange={(e) => debounceSearch(e, debounceTimeout)}
            placeholder="Search for items/categories"
            name="search"
          />
        </Box>
      </Header>

      {/* Search view for mobiles */}
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
      <Grid container>
        <Grid item xs>
          <Grid container spacing={2}>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
            {isLoading ? (
              <Box className="loading">
                <CircularProgress color="primary" />
                <h4>Loading Products...</h4>
              </Box>
            ) : isProductsFound ? (
              <Grid container spacing={2} marginY="1rem" paddingX="2rem">
                {filteredProductData.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product._id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={async () =>
                        await addToCart(
                          token,
                          CartItems,
                          product._id,
                          1,
                          { preventDuplicate: true }
                        )
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box className="loading">
                <SentimentDissatisfied />
                <h4>No products found</h4>
              </Box>
            )}
          </Grid>
        </Grid>
        {token && (
          <Grid item xs={12} md={3} sx={{ backgroundColor: "#E9F5E1" }}>
            <Cart
              products={productList}
              items={CartItems}
              handleQuantity={addToCart}
            />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
