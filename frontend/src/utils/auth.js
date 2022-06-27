export const BASE_URL = 'https://auth.nomoreparties.co';

export function checkFetch(res) {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(res);
}

export function register(email, password) {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  })
    .then(res => checkFetch(res))
}

export function authorize(email, password) {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  })
    .then(res => checkFetch(res))
    .then(res => {
      if (res.token) {
        localStorage.setItem('jwt', res.token);
        return res;
      }
    })
}

export function checkToken(token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => checkFetch(res))
    .then(res => res.data)
}