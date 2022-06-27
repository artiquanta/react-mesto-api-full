import { memo } from 'react';

function PopupError(props) {
  const { errorData } = props;

  return (
    <div className={`popup-error ${errorData.status ? 'popup-error_opened' : ''}`}>
      <div className="popup-error__container">
        <p className="popup-error__title">К сожалению, при выполнении запроса произошла ошибка.</p>
        <p className="popup-error__description">{errorData.statusText}</p>
        <p className="popup-error__code">Код ошибки: {errorData.status}</p>
      </div>
    </div>
  );
}

export default memo(PopupError);