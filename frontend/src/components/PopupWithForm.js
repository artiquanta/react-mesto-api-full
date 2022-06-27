import { memo } from 'react';

function PopupWithForm(props) {
  const { isOpen, onClose, onSubmit, children, heading, isLeftSideHeading, submitButtonStatus, extraButtonClass, formValid } = props;

  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__overlay" onClick={onClose}></div>
      <div className="popup__container popup__container_content_form">
        <button className="popup__close-btn" onClick={onClose} />
        <form className="popup__inputs" onSubmit={onSubmit} noValidate>
          <h2 className={`popup__heading ${isLeftSideHeading ? 'popup__heading_type_left-side' : ''}`}>{heading}</h2>
          {children}
          <button
            className={`popup__submit-btn ${extraButtonClass ? extraButtonClass : ''} ${formValid ? '' : 'popup__submit-btn_inactive'}`}
            type="submit" disabled={formValid ? false : true} >
            {submitButtonStatus}
          </button>
        </form>
      </div>
    </div>
  );
}

export default memo(PopupWithForm);