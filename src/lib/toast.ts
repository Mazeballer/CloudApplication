import { toast } from 'sonner';

export const notify = {
  success: (msg: string) =>
    toast.success(msg, {
      style: {
        background: '#126851ff',
        color: '#ECFDF5',
        border: '1px solid #047857',
      },
    }),

  warning: (msg: string) =>
    toast.warning(msg, {
      style: {
        background: '#7e3c17ff',
        color: '#FEF3C7',
        border: '1px solid #F59E0B',
      },
    }),

  error: (msg: string) =>
    toast.error(msg, {
      style: {
        background: '#831a1aff',
        color: '#FEE2E2',
        border: '1px solid #DC2626',
      },
    }),

  info: (msg: string) =>
    toast(msg, {
      style: {
        background: '#1760a8ff',
        color: '#E6F0FF',
        border: '1px solid #0056A6',
      },
    }),
};
