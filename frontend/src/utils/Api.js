class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getCurrentUser() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include',
    })
      .then(res => this._checkFetch(res))
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include',
    })
      .then(res => this._checkFetch(res))
  }

  updateUserProfile(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: name,
        about: about
      }),
    })
      .then(res => this._checkFetch(res))
  }

  addNewCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: name,
        link: link
      }),
    })
      .then(res => this._checkFetch(res))
  }

  removeCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include',
    })
      .then(res => this._checkFetch(res))
  }

  addLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
    })
      .then(res => this._checkFetch(res))
  }

  removeLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include',
    })
      .then(res => this._checkFetch(res))
  }

  updateAvatar(link) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        avatar: link
      }),
    })
      .then(res => this._checkFetch(res))
  }

  _checkFetch(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(res);
  }
}

// Создание экземпляра класса API
const api = new Api({
  baseUrl: 'https://api.quantum.nomoredomains.xyz',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
