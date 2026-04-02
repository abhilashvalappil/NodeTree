import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'blue' | 'emerald';
  inputSize?: 'sm' | 'md';
  hasError?: boolean;
}

const BASE_STYLES = "outline-none transition-all text-slate-700 bg-slate-50";

const SIZE_STYLES = {
  sm: "px-3 py-1.5 text-sm rounded w-48",
  md: "px-4 py-2.5 rounded-lg flex-1"
};

const VARIANT_STYLES = {
  blue: "border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
  emerald: "border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', variant = 'blue', inputSize = 'md', hasError, ...props }, ref) => {
    
    const errorStyles = hasError 
      ? "!border-red-400 focus:!border-red-500 focus:!ring-red-200" 
      : "";

    const combinedClassName = [
      BASE_STYLES,
      SIZE_STYLES[inputSize],
      VARIANT_STYLES[variant],
      errorStyles,
      className
    ].filter(Boolean).join(' ');

    return (
      <input
        ref={ref}
        className={combinedClassName}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
