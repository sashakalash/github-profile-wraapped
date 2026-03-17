declare global {
  interface Window {
    __nprogress_start?: () => void;
  }
}

export {};
