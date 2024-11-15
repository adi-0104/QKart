import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

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
  // const cartItems  = productsData.filter((item) => cartData.some((cartItem) => item._id === cartItem.productId));
  if (!cartData) return;
  const updatedCartItems = cartData.map((cartItem) => ({
    ...productsData.find((item) => item._id === cartItem.productId),
    ...cartItem,
  }));

  return updatedCartItems;
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
export const getTotalCartValue = (items = []) => {
  if (items.length === 0) {
    return 0;
  }
  const total = items
    .map((item) => item.cost * item.qty)
    .reduce((total, currentValue) => total + currentValue);
  return total;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  let quantity = 0;
  if(!items) return quantity;

  items.forEach((currentItem) => quantity += currentItem.qty);
  return quantity;

  
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
const ItemQuantity = ({ checkOutView, value, handleAdd, handleDelete }) => {
  if (checkOutView) {
    return (
      <Stack direction="row" alignItems="center">
        <Box padding="0.5rem" data-testid="item-qty">
          Qty: {value}
        </Box>
      </Stack>
    );
  }
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
 *    Array of objects with qty and product
 *
 * @param {Function} handleQuantity
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ isReadOnly = false, products, items = [], handleQuantity }) => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const detailedCartItems = generateCartItemsFrom(items, products);
  const shippingCharge = 0;
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

  return (
    <>
      <Box className="cart">
        {
          /* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */
          detailedCartItems.map((cartItem) => (
            <Box key={cartItem.productId}>
              {cartItem.qty > 0 && (
                <Box display="flex" alignItems="flex-start" padding="1rem">
                  <Box className="image-container">
                    <img
                      src={cartItem.image}
                      alt={cartItem.name}
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
                    <div>{cartItem.name}</div>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <ItemQuantity
                        // Add required props by checking implementation
                        checkOutView={isReadOnly ? true : false}
                        value={cartItem.qty}
                        handleAdd={() =>
                          handleQuantity(
                            token,
                            items,
                            cartItem.productId,
                            cartItem.qty + 1
                          )
                        }
                        handleDelete={() =>
                          handleQuantity(
                            token,
                            items,
                            cartItem.productId,
                            cartItem.qty - 1
                          )
                        }
                      />
                      <Box padding="0.5rem" fontWeight="700">
                        ${cartItem.cost}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          ))
        }
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
            ${getTotalCartValue(detailedCartItems)}
          </Box>
        </Box>

        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => history.push("/checkout")}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly && (
        <Box className="cart">
          <Box
            padding="1rem"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
            >
              Order Details
            </Box>
          </Box>
          <Stack
            paddingY="0.5rem"
            paddingX="1rem"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Products</Box>
            <Box>{getTotalItems(detailedCartItems)}</Box>
          </Stack>
          <Stack
            paddingY="0.5rem"
            paddingX="1rem"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Subtotal</Box>
            <Box>${getTotalCartValue(detailedCartItems)}</Box>
          </Stack>
          <Stack
            paddingY="0.5rem"
            paddingX="1rem"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Shipping Charges</Box>
            <Box>${shippingCharge}</Box>
          </Stack>
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
            >
              Total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
            >
              ${getTotalCartValue(detailedCartItems) + shippingCharge}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Cart;
