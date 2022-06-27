import { useContext, memo } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';

function Main(props) {
  const { cards, onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardLike, onCardDelete } = props;
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile content__profile">
        <div className="profile__info">
          <div className="profile__avatar" onClick={onEditAvatar}>
            <div className="profile__avatar-overlay"></div>
            <img src={`${currentUser.avatar}`} alt="Аватар профиля пользователя." className="profile__avatar-img" />
          </div>
          <div className="profile__author-info">
            <div className="profile__control">
              <h1 className="profile__author">{currentUser.name}</h1>
              <button className="profile__edit-btn" onClick={onEditProfile} />
            </div>
            <p className="profile__activity">{currentUser.about}</p>
          </div>
        </div>
        <button className="profile__add-btn" onClick={onAddPlace} />
      </section>
      <section className="cards-grid">
        <ul className="cards cards-grid__cards">
          {cards.map((card) =>
            <Card
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
              key={card._id}
            />
          )}
        </ul>
      </section>
    </main>
  );
}

export default memo(Main);