import { memo } from 'react';

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copyright">&copy; 2020 Mesto Russia</p>
    </footer>
  );
}

export default memo(Footer);