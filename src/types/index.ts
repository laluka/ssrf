import { RefObject } from 'react';

export interface StreamData {
  date: string;
  covered_links: string[];
  stream_name: string;
  stream_link: string;
}

export interface ClickOutsideHandler {
  (ref: RefObject<HTMLElement>, handler: () => void): void;
}
