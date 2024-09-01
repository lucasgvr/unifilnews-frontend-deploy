import { cloneElement } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function ActiveLink({ children, activeClassName, ...rest }) {
  const location = useLocation();
  const className = location.pathname === rest.to ? activeClassName : '';

  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
}