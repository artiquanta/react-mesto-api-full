import { memo } from 'react';

function Loader(props) {
  const { isLoading } = props;

  return (
    <div className={`loader ${isLoading ? 'loader_opened' : ''}`}>
      <div className="loader__logo"></div>
      <p className="loader__description">Подождите, идёт загрузка...</p>
    </div>
  );
}

export default memo(Loader);