import React from 'react';

export function PageFrame({ children, className = '', footer, footerClassName = '' }) {
  return (
    <div className={`standard-page ${className}`}>
      <header>
        <h1>NeverWord</h1>
        <h3>Trap your opponent with your vocabulary!</h3>
      </header>
      {children}
      <footer className={footerClassName}>{footer}</footer>
    </div>
  );
}
