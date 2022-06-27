import { memo } from 'react';

function InfoTooltip(props) {
  const { isOpen, onClose, isRequestCompleted } = props;

  // Отображение статуса запроса
  const statusIcon = isRequestCompleted ? 'popup__status-icon_type_success' : 'popup__status-icon_type_error';
  const statusText = isRequestCompleted ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'

  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__overlay" onClick={onClose}></div>
      <div className="popup__container popup__container_content_form">
        <div className="popup__inputs popup__inputs_place_tooltip">
          <div className={`popup__status-icon ${statusIcon}`}></div>
          <button className="popup__close-btn" onClick={onClose} />
          <h2 className="popup__heading popup__heading_place_tooltip">{statusText}</h2>
        </div>
      </div>
    </div>
  );
}

export default memo(InfoTooltip);