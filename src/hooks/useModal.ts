import { create } from 'zustand';

type ModalType = 'SCHEDULE_TASK' | 'CREATE_CURRICULUM' | 'VIEW_INSIGHT' | null;

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  data: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  openModal: (type, data = null) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: null }),
}));
