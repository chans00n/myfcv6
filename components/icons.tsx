'use client';

import {
  CreditCard,
  type LucideIcon,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  creditCard: CreditCard,
  visa: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.57 7.37l-2.67 6.36h-1.73l-1.34-5.18-.28-1.07c-.48.97-1.18 1.86-2.06 2.66l1.46 3.59h1.73l2.67-6.36h1.73zm2.33 6.36h-1.73l1.73-6.36h1.73l-1.73 6.36zm-9.77-4.67c-.06-.91-.85-1.64-1.76-1.69h-2.66l-.02.09 2.67 6.27h1.73l.67-1.59.95-2.24c.34-.8.52-1.64.52-2.49 0-.09 0-.18-.01-.27l-1.09-.08z" />
    </svg>
  ),
  mastercard: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-.5 4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm1 3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-2 3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm3 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
    </svg>
  ),
  amex: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14.5h-9c-.83 0-1.5-.67-1.5-1.5V9c0-.83.67-1.5 1.5-1.5h9c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5zM8 10v4h1.5v-1.5h2V14H13v-4h-1.5v1.5h-2V10H8z" />
    </svg>
  ),
} as const; 