import React from 'react';
import styles from './Input.module.css';

type ValidationState = 'error' | 'warning' | 'success';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validation?: ValidationState;
  hint?: string;
}

export function Input({ validation, hint, className = '', ...props }: InputProps) {
  const wrapperClass = [
    styles.wrapper,
    validation ? styles[validation] : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      <input className={[styles.input, className].filter(Boolean).join(' ')} {...props} />
      {hint && (
        <span className={[styles.hint, validation ? styles[`hint-${validation}`] : ''].filter(Boolean).join(' ')}>
          {hint}
        </span>
      )}
    </div>
  );
}
