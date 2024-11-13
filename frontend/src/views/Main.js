import React, { useEffect, useState } from 'react';
import './Main.css';
import Product from '../components/Product';
import image from '../img/image.png';

function Main({ setBasket, setBasketPrice, setBasketQty, basket, setMessage, setModalBox, token }) {

  const [products, setProducts] = useState([])

  useEffect(() => {
    const api = 'http://127.0.0.1:9001/products'

    fetch(api)
      .then((result) => result.json())
      .then((result) => {
        // console.debug(result.data)
        setProducts(result.data)
      })
  }, [])

  function AddProduct() {
    if (token !== null) {
      return (
        <>
          <button className='addProduct' onClick={() => setModalBox('AddProductBox')}>Добавить товар</button>
        </>
      )
    }
  }

  return (
    <div className="Main">
      <AddProduct />
      <div className='mainGrid'>
      {products.map((item) => <Product key={item._id} id={item._id} image={image}
        title={item.title} price={item.price} setBasket={setBasket}
        setBasketPrice={setBasketPrice} setBasketQty={setBasketQty}
        basket={basket} setMessage={setMessage} setModalBox={setModalBox} token={token} />)}
      </div>
    </div>
  );
}

export default Main;