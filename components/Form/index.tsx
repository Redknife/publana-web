import React, { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';

export const Form = forwardRef<
  ElementRef<'form'>,
  ComponentPropsWithoutRef<'form'>
>((props, forwardedRef) => (
  <form
    {...props}
    ref={forwardedRef}
    className={clsx(props.className, 'w-full', 'space-y-4')}
  />
));
Form.displayName = 'Form';

export const Input = forwardRef<
  ElementRef<'input'>,
  ComponentPropsWithoutRef<'input'>
>((props, forwardedRef) => (
  <input
    {...props}
    ref={forwardedRef}
    className={clsx(
      props.className,
      'form-input',
      'px-4 py-3',
      'text-gray-800 dark:text-gray-100',
      'rounded-md',
      'border-2 border-gray-300 dark:border-gray-800',
      'focus:ring-amber-400 focus:border-amber-400 dark:focus:border-amber-400',
      'hover:border-amber-400 dark:hover:border-amber-400',
      'bg-white dark:bg-gray-800',
      'transition',
    )}
  />
));
Input.displayName = 'Input';

export const Textarea = forwardRef<
  ElementRef<'textarea'>,
  ComponentPropsWithoutRef<'textarea'>
>((props, forwardedRef) => (
  <textarea
    {...props}
    ref={forwardedRef}
    className={clsx(
      props.className,
      'form-input',
      'px-4 py-3',
      'text-gray-800 dark:text-gray-100',
      'rounded-md',
      'border-2 border-gray-300 dark:border-gray-800',
      'focus:ring-amber-400 focus:border-amber-400 dark:focus:border-amber-400',
      'hover:border-amber-400 dark:hover:border-amber-400',
      'bg-white dark:bg-gray-800',
      'transition',
    )}
  />
));
Textarea.displayName = 'Textarea';
