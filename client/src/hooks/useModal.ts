import { useState, useCallback } from 'react';

const useModal = <T>(initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState<T | null>(null);

  const openModal = useCallback((data: T | null = null) => {
    setModalData(data);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
    document.body.style.overflow = 'auto';
  }, []);

  return {
    isOpen,
    modalData,
    openModal,
    closeModal
  };
};

export default useModal;