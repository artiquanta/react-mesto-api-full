import { memo, useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
  const { isOpen, onClose, onAddPlace, isProcessing } = props;
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  // Состояния валидации
  const [formValid, setFormValidity] = useState(false);
  const [inputValidity, setInputValidity] = useState({ title: false, link: false });
  const [inputErrorText, setInputErrorText] = useState({ title: '', link: '' }); // текст ошибки валидации  
  const [primaryValidation, setPrimaryValidation] = useState({ title: true, link: true }); // первоначальная валидация

  const submitButtonStatus = isProcessing ? 'Создание...' : 'Создать';

  // Возвращение формы модального окна к исходному состоянию
  useEffect(() => {
    setPrimaryValidation(state => {
      return { ...state, title: true, link: true }
    });
    setInputValidity(state => {
      return { ...state, title: false, link: false }
    });
    setFormValidity(false);
    setTitle('');
    setLink('');
  }, [isOpen])

  // При изменении состояния валидности полей ввода, обновляем состояние валидности формы
  useEffect(() => {
    (inputValidity.title && inputValidity.link) ?
      setFormValidity(true)
      : setFormValidity(false);
  }, [inputValidity]);

  function handleChange(evt) {
    switch (evt.target.name) {
      case 'title':
        setTitle(evt.target.value);
        break;
      case 'link':
        setLink(evt.target.value);
        break;
      default:
        break;
    };

    if (evt.target.validity.valid) {
      setInputValidity({ ...inputValidity, [evt.target.name]: true });
      setInputErrorText({ ...inputErrorText, [evt.target.name]: '' });
      setPrimaryValidation({ ...primaryValidation, [evt.target.name]: true });
    } else {
      setInputValidity({ ...inputValidity, [evt.target.name]: false });
      setInputErrorText({ ...inputErrorText, [evt.target.name]: [evt.target.validationMessage] });
      setPrimaryValidation({ ...primaryValidation, [evt.target.name]: false });
    }
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onAddPlace({
      name: title,
      link: link
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      heading='Новое место'
      isLeftSideHeading
      extraButtonClass={false}
      submitButtonStatus={submitButtonStatus}
      formValid={formValid}
    >
      <>
        <label className="popup__field">
          <input type="text" placeholder="Название" name="title" className={`popup__input ${(inputValidity.title || primaryValidation.title) ? '' : 'popup__input_state_error'}`}
            id="place-input" minLength="2" maxLength="30" required value={title} onChange={handleChange} />
          <span className={`popup__input-error ${(inputValidity.title || primaryValidation.title) ? '' : 'popup__input-error_active'}`}>{inputErrorText.title}</span>
        </label>
        <label className="popup__field popup__field_position_bottom">
          <input type="url" placeholder="Сслыка на картинку" name="link" className={`popup__input ${(inputValidity.link || primaryValidation.link) ? '' : 'popup__input_state_error'}`}
            id="link-input" required value={link} onChange={handleChange} />
          <span className={`popup__input-error ${(inputValidity.link || primaryValidation.link) ? '' : 'popup__input-error_active'}`}>{inputErrorText.link}</span>
        </label>
      </>
    </PopupWithForm>
  );
}

export default memo(AddPlacePopup);