import { css } from '@emotion/react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { React, useState } from 'react';
import Layout from '../components/Layout.js';
import { getParsedCookie, setStringifiedCookie } from '../util/cookies';
import { getProductData } from '../util/database';

const mainStyles = css`
  margin: 0 5vw;

  a {
    color: #3e9aa5;
    font-weight: bold;
    :hover {
      color: #1a494e;
    }
  }
`;

const layoutStyles = css`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const cartList = css`
  flex-basis: 50%;
`;

const productItem = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid gray;
  border-radius: 3px;
  margin: 10px 10px;
  padding: 15px 20px;
  opacity: 0.8;
  background-color: rgb(255, 255, 255, 0.5);
  :hover {
    background-color: rgb(255, 255, 255);
  }
`;

const productContent = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const totalStyles = css`
  background-color: white;
  padding: 40px 20px;
  border-radius: 3px;
  text-align: right;
`;

export default function Cart(props) {
  const [cartItems, setCartItems] = useState(props.cartItems);

  // total Quantity of all items in cart:
  const totalQuantity = cartItems
    .map((arr) => arr.quantity)
    .reduce((a, b) => {
      return a + b;
    }, 0);

  // total Sum of all items in cart:
  const cartSum = cartItems
    .map((arr) => arr.price * arr.quantity)
    .reduce((a, b) => {
      return a + b;
    }, 0);

  // display message if nothing is in the cart:
  if (cartSum === 0) {
    return (
      <>
        <Head>
          <title>Store - Home</title>
          <meta name="My first E-Commerce store" content="Cart" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout globalCart={props.globalCart}>
          <main css={mainStyles}>
            <h1>Cart</h1>
            <div css={layoutStyles}>
              <div>
                <p>Oh no there's nothing here yet :(</p>
                <br />

                <Link href="/">
                  <a>{'<'} back to all clouds</a>
                </Link>
              </div>
              <div css={totalStyles}>
                <div>items in your cart: {totalQuantity}</div>
                <br />
                <div>order value: € {cartSum}</div>
                <div>delivery: € 0 </div>
                <div>_________________________</div>
                <div>
                  <strong>Total: € {cartSum}</strong>
                </div>
              </div>
            </div>
          </main>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Store - Home</title>
        <meta name="My first E-Commerce store" content="Cart" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout globalCart={props.globalCart}>
        <main css={mainStyles}>
          <h1>Cart</h1>
          <div css={layoutStyles}>
            <div css={cartList}>
              <p>
                <strong>Your Chosen Ones:</strong>
              </p>
              {cartItems.map((cartItem) => {
                return (
                  // products:
                  <div key={`cart-${cartItem.id}`} css={productItem}>
                    <div css={productContent}>
                      <Link href={`/products/${cartItem.id}`} passHref>
                        <a>
                          <Image
                            src={`/${cartItem.id}.jpg`}
                            width="150"
                            height="150"
                          />
                        </a>
                      </Link>
                      <div>
                        <div>
                          <Link href={`/products/${cartItem.id}`} passHref>
                            <h2>{cartItem.name}</h2>
                          </Link>

                          {/* minus button */}
                          <button
                            onClick={() => {
                              const updatedItem = cartItems.find(
                                (item) => item.id === cartItem.id,
                              );
                              const currentCookie = Cookies.get('cart')
                                ? getParsedCookie('cart')
                                : [];
                              const updatedCart = currentCookie.find(
                                (cookie) => cookie.id === cartItem.id,
                              );
                              if (updatedItem.quantity !== 1) {
                                updatedCart.quantity -= 1;
                                setStringifiedCookie('cart', currentCookie);
                                props.setGlobalCart(currentCookie);
                                updatedItem.quantity -= 1;
                                setCartItems([...cartItems]);
                              }
                            }}
                          >
                            -
                          </button>

                          {cartItem.quantity}

                          {/* add button: */}
                          <span> </span>
                          <button
                            onClick={() => {
                              const updatedItem = cartItems.find(
                                (item) => item.id === cartItem.id,
                              );
                              updatedItem.quantity += 1;
                              setCartItems([...cartItems]);

                              const currentCookie = Cookies.get('cart')
                                ? getParsedCookie('cart')
                                : [];
                              const updatedCart = currentCookie.find(
                                (cookie) => cookie.id === cartItem.id,
                              );
                              updatedCart.quantity += 1;
                              setStringifiedCookie('cart', currentCookie);
                              props.setGlobalCart(currentCookie);
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div>
                          subtotal: {cartItem.price * cartItem.quantity} €
                        </div>
                      </div>
                    </div>
                    <div>
                      {/* remove button */}
                      <button
                        onClick={() => {
                          // cookie
                          const currentCookie = Cookies.get('cart')
                            ? getParsedCookie('cart')
                            : [];
                          const newCookie = currentCookie.filter((cookie) => {
                            return cookie.id !== cartItem.id;
                          });
                          setStringifiedCookie('cart', newCookie);
                          props.setGlobalCart([...newCookie]);
                          // cart
                          const newCart = cartItems.filter((item) => {
                            return item.id !== cartItem.id;
                          });
                          setCartItems([...newCart]);
                          console.log(newCart);
                        }}
                      >
                        remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div css={totalStyles}>
              <div>items in your cart: {totalQuantity}</div>
              <br />
              <div>order value: € {cartSum}</div>
              <div>delivery: € 0 </div>
              <div>_________________________</div>
              <div>
                <strong>Total: € {cartSum}</strong>
              </div>
              <br />
              <br />
              <Link href="/checkout">
                <a>Checkout {'>'}</a>
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const productData = await getProductData(); // info from database
  const cookies = JSON.parse(context.req.cookies.cart || '[]');

  const cartItems = cookies.map((cookie) => {
    const databaseProduct = productData.find(
      (product) => cookie.id === product.id,
    );
    return {
      id: databaseProduct.id,
      name: databaseProduct.name,
      description: databaseProduct.description,
      price: databaseProduct.price,
      quantity: cookie.quantity,
    };
  });

  return {
    props: {
      productData,
      cartItems,
    },
  };
}
