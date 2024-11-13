import React from 'react';
import './Registration.css';

function Registration({ setModalBox, setMessage }) {

  function Reg() {
    const email = document.getElementById('email').value
    const login = document.getElementById('login').value
    const password = document.getElementById('pass').value

    const validEmail = email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)
    const validLogin = login.match(/.+$/i)

    let message

    if (!validEmail || !validLogin || password.length === 0) {
      document.getElementById('loginError').innerText = "Вы ввели данные неправильно!"
      return
    }

    const data = {
      email: email,
      login: login,
      password: password
    }

    // console.debug(data)

    const api = 'http://127.0.0.1:9001/registration'

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
    <div className="Registration">
      <h1>Регистрация:</h1>
      <input id='email' placeholder='E-Mail' type='email' />
      <input id='login' placeholder='Логин' type='text' />
      <input id='pass' placeholder='Пароль' type='password' />
      <button id='send' onClick={() => Reg()}>Войти</button>
      <p id='loginError'></p>
    </div>
  );
}

export default Registration;