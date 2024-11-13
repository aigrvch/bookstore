import React from 'react';
import './Login.css';

function Login({ setModalBox, setToken, setMessage }) {

  function Log() {
    const login = document.getElementById('login').value
    const password = document.getElementById('pass').value

    const validLogin = login.match(/.+$/i)

    let message

    if (!validLogin || password.length === 0) {
      document.getElementById('loginError').innerText = "Вы ввели данные неправильно!"
      return
    }

    const data = {
      login: login,
      password: password
    }

    // console.debug(data)

    const api = 'http://127.0.0.1:9001/login'

    fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((result) => result.json())
      .then((result) => {
        message = result.message
        if (result.token !== undefined) {
          localStorage.setItem('token', result.token)
          setToken(result.token)
        }
      })

    setTimeout(() => {
      setMessage(message)
      setModalBox('MessageBox')
    }, 100)
  }

  return (
    <div className="Login">
      <h1>Логин:</h1>
      <input id='login' placeholder='Логин' type='text' />
      <input id='pass' placeholder='Пароль' type='password' />
      <button id='send' onClick={() => Log()}>Войти</button>
      <p id='loginError'></p>
    </div>
  );
}

export default Login;