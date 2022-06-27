import { memo, useState, useContext } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

function Header(props) {
  const { onSignOut } = props;
  const { loggedIn, userEmail } = useContext(AppContext);

  // Состояние для мобильного меню
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Добавление ссылок, если пользователь неавторизован
  const headerLink =
    <Switch>
      <Route path="/sign-in">
        <Link to="./sign-up" className="header__link">Регистрация</Link>
      </Route>
      <Route path="/sign-up">
        <Link to="./sign-in" className="header__link">Войти</Link>
      </Route>
    </Switch>;

  // Добавление блока с информацией и кнопкой выхода после авторизации
  const headerBlock =
    <div className={`header__info ${isMenuOpen ? 'header__info_action_show' : ''}`}>
      <p className="header__user-email">{userEmail}</p>
      <button className="header__logout-btn" onClick={handleSignOut}>Выйти</button>
    </div>;

  // Обработчик открытия/закрытия мобильного меню
  function openMenu() {
    setMenuOpen(!isMenuOpen);
  }

  // Обработчик кнопки выхода из системы
  function handleSignOut() {
    setMenuOpen(false);
    onSignOut();
  }

  return (
    <header className={`header ${isMenuOpen ? '' : 'page__section'} ${loggedIn ? 'header_authorized' : ''}`}>
      <div className="header__container">
        <div className="header__logo"></div>
        {loggedIn ?
          <button className={`header__menu-btn ${isMenuOpen ?
            'header__menu-btn_action_close'
            : 'header__menu-btn_action_open'}`} onClick={openMenu}>
          </button>
          : ''}
      </div>
      {loggedIn ? headerBlock : headerLink}
    </header>
  );
}

export default memo(Header);