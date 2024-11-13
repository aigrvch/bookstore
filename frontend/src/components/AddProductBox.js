import React from 'react';
import './AddProductBox.css';

function AddProductBox({ setModalBox, setMessage }) {

  function AddProduct() {
    const title = document.getElementById('title').value
    const price = document.getElementById('price').value
    
    const validPrice= price.match(/^\d+$/)

    let message

    if (!validPrice || title.length === 0) {
      document.getElementById('addProductError').innerText = "Вы ввели данные неправильно!"
      return
    }

    const data = {
      title: title,
      price: price
    }

    // console.debug(data)

    const api = 'http://127.0.0.1:9001/products/add'

    fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((result) => result.json())
      .then((result) => message = result.message)

    setTimeout(() => {
      setMessage(message)
      setModalBox('MessageBox')
    }, 100)
  }

  return (
    <div className="AddProductBox">
      <h1>Добавление товара</h1>
      <input id='title' placeholder='Название товара' type='text' />
      <input id='price' placeholder='Цена товара' type='text' />
      <button id='send' onClick={() => AddProduct()}>Добавить</button>
      <p id='addProductError'></p>
    </div>
  );
}

export default AddProductBox;