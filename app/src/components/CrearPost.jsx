import React, { useState } from "react";
import Modal from "./Modal";

const CrearPost = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    board: "",
    tags: [],
    allowComments: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [allowComments, setAllowComments] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAllowComments = () => {
    setAllowComments(!allowComments);
    setFormData((prev) => ({
      ...prev,
      allowComments: !prev.allowComments,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex justify-between items-center mb-4 ">
          <h1 className="text-[20px] leading-[26px] font-semibold  ">
            Crear publicación
          </h1>
          <button
            className="bg-app-red/80 md:hover:scale-110 active:scale-110 transition-all  text-white font-semibold px-4 py-2 rounded-full text-[16px] md:hover:bg-app-red active:bg-app-red border"
            type="submit"
          >
            Publicar
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm text-app-bluePurple font-open-sans">
          <div className="flex flex-col md:flex-row gap-8 ">
            {/* Sección izquierda */}
            <div className="w-full md:w-1/2">
              <div
                className={`
                bg-[#E9E9E9] rounded-2xl overflow-hidden
                ${imagePreview ? "p-0" : "p-4"}
                flex items-center justify-center
                h-[150px] md:min-h-[480px]
                relative
              `}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full p-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-xl"
                      onClick={() => setImagePreview(null)}
                    />
                    <button
                      className="absolute top-0 right-2 w-8 h-8 bg-white/80 text-app-red rounded-full flex items-center justify-center shadow-md font-lacquer border border-app-red md:hover:scale-95 transition-all active:scale-95 md:hover:bg-app-red active:bg-app-red md:hover:text-white active:text-white  "
                      onClick={() => setImagePreview(null)}
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <div className="text-center w-full ">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      required
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5v14m-7-7h14"
                          stroke="#5F5F5F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-xs text-[#5F5F5F] space-y-4 mt-4">
                        <p className="font-medium">
                          Elige un archivo o arrástralo y<br />
                          colócalo aquí
                        </p>
                        <p className="text-[11px] leading-[16px]">
                          Recomendamos usar archivos .jpg de alta calidad
                          <br />
                          con un tamaño inferior a 20 MB.
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Sección derecha */}
            <div className="w-full md:w-1/2">
              <div className="space-y-6">
                <div className="border p-2 rounded-xl  border-app-purple/30">
                  <input
                    type="text"
                    name="title"
                    placeholder="Agrega un título"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-0 py-2 text-[16px] placeholder-[#6D6D6D] focus:outline-none border-none  font-semibold"
                    required
                  />
                </div>

                <div className="border p-2 rounded-xl  border-app-purple/30">
                  <textarea
                    required
                    name="description"
                    placeholder="Agrega una descripción detallada"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-0 py-2 text-[16px] placeholder-[#6D6D6D] focus:outline-none resize-none border-none"
                  />
                </div>

                <div>
                  <button
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="flex items-center text-[16px] text-[#111111] font-medium"
                  >
                    Más opciones
                    <svg
                      className={`ml-1 transform transition-transform ${
                        showMoreOptions ? "rotate-180" : ""
                      }`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="m6 9 6 6 6-6"
                        stroke="#111111"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {showMoreOptions && (
                    <div className="mt-4">
                      <label className="flex items-center justify-between py-2">
                        <span className="text-[16px] text-[#111111]">
                          Permite que la gente comente
                        </span>
                        <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out">
                          <input
                            type="checkbox"
                            name="allowComments"
                            checked={formData.allowComments}
                            onChange={handleChange}
                            id="allowComments"
                            onClick={handleAllowComments}
                            className="opacity-0 w-0 h-0"
                            required
                          />
                          <span
                            className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ease-in-out ${
                              allowComments
                                ? "bg-[#0074E8]"
                                : "bg-[#E9E9E9]"
                            }`}
                          >
                            <span
                              className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                                allowComments
                                  ? "translate-x-4"
                                  : "translate-x-0.5"
                              } transform top-0.5`}
                            ></span>
                          </span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CrearPost;
