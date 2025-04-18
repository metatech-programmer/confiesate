import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-dvw h-dvh z-[70] flex backdrop-blur-sm">
      <div
        className="w-full h-full absolute top-0 left-0 z-[70] bg-app-bluePurple/90"
        onClick={onClose}
      />

      <div className="w-dvw transition-all h-max m-auto px-4 py-8 md:py-4 animate-expand scale-95 z-[80] text-white bg-app-bluePurple rounded-3xl drop-shadow-sm shadow-app-bluePurple">
        <button
          className="absolute -top-2 -left-2 bg-app-red rounded-2xl h-7 w-7 font-bold flex items-center justify-center"
          onClick={onClose}
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
