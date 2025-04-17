import { useState, useCallback } from 'react';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
    document.body.style.overflow = 'auto';
  }, []);

  const toggleModal = useCallback((data = null) => {
    setIsOpen(prev => !prev);
    setModalData(data);
  }, []);

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    toggleModal
  };
};

export default useModal;