export const BASE_URL = 'https://api.qunatum.nomoredomains.xyz';

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
    body: JSON.stringify({ password, email }),
  })
    .then(res => checkFetch(res))
}

export function authorize(email, password) {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ password, email }),
  })
    .then(res => checkFetch(res))
}

export function logoutUser() {
  return fetch(`${BASE_URL}/users/logout`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
  })
    .then(res => checkFetch(res))
}