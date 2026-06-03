export type ToastType =
  | "success"
  | "error"
  | "info";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastProps {
  toasts: ToastItem[];
  removeToast: (id: number) => void;
}