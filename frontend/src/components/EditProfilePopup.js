import { memo, useContext, useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {
  const { isOpen, onClose, onUpdateUser, isProcessing } = props;
  const currentUser = useContext(CurrentUserContext);

  // Состояния значений полей ввода
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Состояния валидации
  const [formValid, setFormValidity] = useState(false);
  const [inputValidity, setInputValidity] = useState({ name: false, description: false });
  const [inputErrorText, setInputErrorText] = useState({ name: '', description: '' }); // текст ошибки валидации

  const submitButtonStatus = isProcessing ? 'Сохранение...' : 'Сохранить';

  // Заполнение формы
  useEffect(() => {
    setName(currentUser.name || '');
    setDescription(currentUser.about || '');
    setFormValidity(true);
    setInputValidity(state => {
      return { ...state, name: true, description: true }
    });
  }, [currentUser, isOpen])

  // При изменении состояния валидности полей ввода, обновляем состояние валидности формы
  useEffect(() => {
    (inputValidity.name && inputValidity.description) ?
      setFormValidity(true)
      : setFormValidity(false);
  }, [inputValidity]);

  // Обработчик полей ввода
  function handleChange(evt) {
    switch (evt.target.name) {
      case 'name':
        setName(evt.target.value);
        break;
      case 'description':
        setDescription(evt.target.value);
        break;
      default:
        break;
    };

    if (evt.target.validity.valid) {
      setInputValidity({ ...inputValidity, [evt.target.name]: true });
      setInputErrorText({ ...inputErrorText, [evt.target.name]: '' });
    } else {
      setInputValidity({ ...inputValidity, [evt.target.name]: false });
      setInputErrorText({ ...inputErrorText, [evt.target.name]: [evt.target.validationMessage] });
    }
  }

  // Обработчик отправки формы
  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateUser({
      name,
      about: description
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      heading='Редактировать профиль'
      isLeftSideHeading={false}
      extraButtonClass={false}
      submitButtonStatus={submitButtonStatus}
      formValid={formValid}
    >
      <>
        <label className="popup__field">
          <input type="text" placeholder="Имя" name="name" className={`popup__input ${inputValidity.name ? '' : 'popup__input_state_error'}`}
            id="author-input" minLength="2" maxLength="40" required value={name} onChange={handleChange} />
          <span className={`popup__input-error ${inputValidity.name ? '' : 'popup__input-error_active'}`}>{inputErrorText.name}</span>
        </label>
        <label className="popup__field popup__field_position_bottom">
          <input type="text" placeholder="О себе" name="description" className={`popup__input ${inputValidity.description ? '' : 'popup__input_state_error'}`}
            id="activity-input" minLength="2" maxLength="200" required value={description} onChange={handleChange} />
          <span className={`popup__input-error ${inputValidity.description ? '' : 'popup__input-error_active'}`}>{inputErrorText.description}</span>
        </label>
      </>
    </PopupWithForm>
  );
}

export default memo(EditProfilePopup);