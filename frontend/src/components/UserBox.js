import React from 'react';
import './UserBox.css';
import { jwtDecode } from 'jwt-decode';

function UserBox({ setModalBox, token, setToken, setPage }) {

  function logout() {
    setToken(null)
    localStorage.removeItem('token')
    setPage('Main')
  }

  function MultipleBoxes() {
    if (token !== null) {
      const login = jwtDecode(token).login

      // console.debug(login)

      return (
        <div className="UserBox">
          <p>Привет, {login}!</p>
          <button onClick={() => setPage('Cabinet')}>Личный кабинет</button>
          <button onClick={() => logout()}>Выйти</button>
        </div>
      )
    }

    return (
      <div className="UserBox">
        <button onClick={() => setModalBox('Login')}>Вход</button>
        <button onClick={() => setModalBox('Registration')}>Регистрация</button>
      </div>
    )
  }

  return (
    <MultipleBoxes />
  );
}

export default UserBox;