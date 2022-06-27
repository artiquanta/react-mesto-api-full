import { memo } from 'react';

function ImagePopup(props) {
  const { card, onClose } = props;

  return (
    <div className={`popup popup_type_image ${card._id ? 'popup_opened' : ''}`}>
      <div className="popup__overlay" onClick={onClose}></div>
      <div className="popup__container popup__container_content_image">
        <button className="popup__close-btn" onClick={onClose} />
        <figure className="popup__figure">
          <img src={`${card.link}`} alt={`${card.name}.`} className="popup__photo" />
          <figcaption className="popup__caption">{card.name}</figcaption>
        </figure>
      </div>
    </div>
  );
}

export default memo(ImagePopup);