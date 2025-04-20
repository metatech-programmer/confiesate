import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, startAdornment, endAdornment, ...props }, ref) => {
    const id = props.id || props.name;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {startAdornment && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {startAdornment}
            </div>
          )}
          <input
            ref={ref}
            {...props}
            id={id}
            aria-invalid={!!error}
            aria-describedby={`${id}-error ${id}-helper`}
            className={twMerge(
              'block w-full rounded-md border-gray-300 shadow-sm focus:border-app-purple focus:ring-app-purple sm:text-sm',
              error && 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500',
              startAdornment && 'pl-10',
              endAdornment && 'pr-10',
              className
            )}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {endAdornment}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600" id={`${id}-error`} role="alert">
            {error}
          </p>
        )}
        {helperText && (
          <p className="text-sm text-gray-500" id={`${id}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
