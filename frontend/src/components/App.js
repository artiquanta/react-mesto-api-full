import { useState, useEffect, memo } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/Api';
import * as auth from '../utils/auth';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import PopupWithConfirmation from './PopupWithConfirmation';
import PopupError from './PopupError';
import Loader from './Loader';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { AppContext } from '../contexts/AppContext';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isEditProfilePopupOpen, setPopupProfileOpen] = useState(false);
  const [isAddPlacePopupOpen, setPopupAddCardsOpen] = useState(false);
  const [isEditAvatarPopupOpen, setPopupAvatarOpen] = useState(false);
  const [isPopupWithConfirmationOpen, setPopupConfirmationOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cardDeleteId, setCardDeleteId] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isProcessing, setProcessStatus] = useState(false);
  const [isLoading, setLoadingStatus] = useState(true);
  const [errorData, setErrorData] = useState({});
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [isRequestCompleted, setRequestCompleted] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  const history = useHistory();

  // Проверка наличия сохранённого токена
  useEffect(() => {
    handleAuthCheck();
    //eslint-disable-next-line
  }, [])

  // Загрузка первоначальных данных с сервера при авторизации
  useEffect(() => {
    if (loggedIn) {
      Promise.all([
        api.getCurrentUser(),
        api.getInitialCards()
      ])
        .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          setCards(existingCards => [...existingCards, ...cardsData]);
          setLoadingStatus(false);
        })
        .catch(err => {
          showError(err);
          setLoadingStatus(false);
        });
    }
  }, [loggedIn]);

  // Регистрация пользователя
  function handleRegister(email, password) {
    auth.register(email, password) // регистрируем пользователя
      .then(res => {
        if (res.statusCode !== '400') {
          setRequestCompleted(true);
          setTooltipOpen(true);
          setTimeout(() => {// задержка (без неё запрос не выполняется с кодом 429)
            setTooltipOpen(false);
            handleLogin(email, password); // авторизуем пользователя после регистрации
          }, 3000);

        }
      })
      .catch(err => {
        // отображаем ошибку регистрации
        err.json()
          .then(err => {
            setRequestMessage(err.message);
            setRequestCompleted(false);
            setTooltipOpen(true);
          })
          .catch(err => showError(err));
      })
      .catch(err => showError(err));
  }

  // Обработчик входа в систему
  function handleLogin(email, password) {
    auth.authorize(email, password)
      .then(() => {
        setLoggedIn(true);
        setUserEmail(email);
        history.push('/');
      })
      .catch(err => {
        // отображаем ошибку авторизации
        err.json()
          .then(err => {
            setRequestMessage(err.message)
            setRequestCompleted(false);
            setTooltipOpen(true);
          })
          .catch(err => showError(err));
      })
      .catch(err => showError(err));
  }

  // Обработчик выхода из системы
  function handleLogOut() {
    auth.logoutUser()
      .then(() => {
        setLoggedIn(false);
        history.push('/sign-in');
        setCards([]);
        setCurrentUser({});
        setUserEmail('');
      })
      .catch(err => showError(err));
  }

  // Проверка корректности токена пользователя
  function handleAuthCheck() {
    // Проверяем, был ли пользователь ранее авторизован
    if (document.cookie.includes('auth')) {
      // Получаем текущего пользователя по имеющемуся токену
      api.getCurrentUser()
        .then(data => {
          if (data.email) {
            setUserEmail(data.email);
            setLoggedIn(true);
            history.push('/');
            setLoadingStatus(false);
          }
        })
        .catch(() => setLoadingStatus(false));
    } else {
      setLoadingStatus(false);
    }
  }

  // Обработчик кнопки лайка
  function handleCardLike(card) {
    const isLiked = card.likes.includes(currentUser._id) ? true : false;

    (isLiked ? api.removeLike(card._id) : api.addLike(card._id))
      .then(newCard => {
        setCards((state) => state.map(currentCard => currentCard._id === card._id ? newCard : currentCard));
      })
      .catch(err => showError(err));
  }

  // Обработчик нажатия кнопки удаления карточки
  function handleCardDeleteClick(cardId) {
    setCardDeleteId(cardId);
    setPopupConfirmationOpen(true);
  }

  // Обработчик удаления карточки из модального окна
  function handleCardDelete() {
    setProcessStatus(true);
    api.removeCard(cardDeleteId)
      .then(() => {
        setCards((state) => state.filter(currentCard => currentCard._id !== cardDeleteId));
        closeAllPopups();
      })
      .catch(err => showError(err));
  }

  // Открытие модального окна изменения аватара
  function handleEditAvatarClick() {
    setPopupAvatarOpen(true);
  }

  // Открытие модального окна редактирования профиля
  function handleEditProfileClick() {
    setPopupProfileOpen(true);
  }

  // Открытие модального окна добавления карточки
  function handleAddPlaceClick() {
    setPopupAddCardsOpen(true);
  }

  // Закрытие модального окна
  function closeAllPopups() {
    setProcessStatus(false);
    setPopupAddCardsOpen(false);
    setPopupAvatarOpen(false);
    setPopupProfileOpen(false);
    setPopupConfirmationOpen(false);
    setTooltipOpen(false);
    setSelectedCard({});
    setCardDeleteId('');
  }

  // Открытие модального окна с просмотром изображения карточки
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  // Обновление профиля пользователя
  function handleUpdateUser({ name, about }) {
    setProcessStatus(true);
    api.updateUserProfile(name, about)
      .then(newData => {
        setCurrentUser(newData);
        closeAllPopups();
      })
      .catch(err => showError(err));
  }

  // Обновление автара пользователя
  function handleUpdateAvatar({ avatar }) {
    setProcessStatus(true);
    api.updateAvatar(avatar)
      .then(newData => {
        setCurrentUser(newData);
        closeAllPopups();
      })
      .catch(err => showError(err));
  }

  // Добавление карточки места
  function handleAddPlaceSubmit({ name, link }) {
    setProcessStatus(true);
    api.addNewCard(name, link)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => showError(err));
  }

  // Отображение ошибки при запросе к серверу
  function showError(errorData) {
    setProcessStatus(false);
    setErrorData(errorData);

    // интервал скрытия модального окна с ошибкой
    setTimeout(() => {
      setErrorData({});
    }, 7000);
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <AppContext.Provider value={{ loggedIn: loggedIn, userEmail: userEmail }}>
          <Header onLogOut={handleLogOut} />
          <Switch>
            <Route path="/sign-in">
              <Login onLogin={handleLogin} />
            </Route>
            <Route path="/sign-up">
              <Register onLogin={handleLogin} onRegister={handleRegister} />
            </Route>
            <ProtectedRoute>
              <Main
                cards={cards}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDeleteClick} />
              <Footer />
            </ProtectedRoute>
            <Route>
              <Redirect to={`${loggedIn ? '/' : '/sign-in'}`} />
            </Route>
          </Switch>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isProcessing={isProcessing} />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isProcessing={isProcessing} />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isProcessing={isProcessing} />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups} />
          <PopupWithConfirmation
            isOpen={isPopupWithConfirmationOpen}
            onClose={closeAllPopups}
            onCardDelete={handleCardDelete}
            isProcessing={isProcessing} />
          <PopupError
            errorData={errorData} />
          <InfoTooltip
            isOpen={isTooltipOpen}
            onClose={closeAllPopups}
            isRequestCompleted={isRequestCompleted}
            requestMessage={requestMessage} />
        </AppContext.Provider>
        <Loader
          isLoading={isLoading} />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default memo(App);