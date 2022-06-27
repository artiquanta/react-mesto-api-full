import { memo } from 'react';
import PopupWithForm from './PopupWithForm';

function PopupWithConfiramtion(props) {
  const { isOpen, onClose, onCardDelete, isProcessing } = props;
  const submitButtonStatus = isProcessing ? 'Удаление...' : 'Да';

  function handleSubmit(evt) {
    evt.preventDefault();
    onCardDelete();
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      heading='Вы уверены?'
      isleftSideHeading
      extraButtonClass='popup__submit-btn_place_confirmation'
      submitButtonStatus={submitButtonStatus}
      formValid />
  );
}

export default memo(PopupWithConfiramtion);