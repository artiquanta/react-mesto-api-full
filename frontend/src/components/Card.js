import { memo, useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(props) {
  const { card, onCardClick, onCardLike, onCardDelete } = props;
  const currentUser = useContext(CurrentUserContext);

  // Открытие модального окна просмотра изображения карточки
  function handleImageClick() {
    onCardClick(card);
  }

  // Добавление / удаление лайка карточки места
  function handleLikeClick() {
    onCardLike(card);
  }

  // Удаление карточки места
  function handleDeleteClick() {
    onCardDelete(card._id);
  }

  return (
    <li className="cards__item">
      {card.owner._id === currentUser._id ? <button className="cards__remove-btn" onClick={handleDeleteClick} /> : ''}
      <img className="cards__image" src={card.link} alt={`${card.name}.`} onClick={handleImageClick} />
      <div className="cards__description">
        <h2 className="cards__place">{card.name}</h2>
        <div className="cards__likes">
          <button className={`cards__like-btn ${card.likes.some(like => like._id === currentUser._id) ? 'cards__like-btn_active' : ''}`} onClick={handleLikeClick} />
          <p className="cards__like-count">{card.likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default memo(Card);