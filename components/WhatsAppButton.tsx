// src/components/WhatsAppButton.tsx

import React from "react";

const WHATSAPP_NUMBER = "5547989035173";

const DEFAULT_MESSAGE =
  "Olá, tenho interesse e gostaria de mais informações.";

const generateWhatsAppLink = (message?: string) => {
  const text = encodeURIComponent(message || DEFAULT_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
};

type WhatsAppButtonProps = {
  message?: string;
};

export default function WhatsAppButton({ message }: WhatsAppButtonProps) {
  const link = generateWhatsAppLink(message);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="
        fixed bottom-6 right-6 z-50
        flex items-center justify-center
        w-14 h-14
        bg-green-500 hover:bg-green-600
        text-white
        rounded-full
        shadow-lg
        transition-transform duration-200
        hover:scale-110
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-7 h-7 fill-current"
      >
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.638.86 5.074 2.313 7.047L4 29l7.137-2.253A11.93 11.93 0 0 0 16.001 27C22.627 27 28 21.627 28 15S22.627 3 16.001 3zm0 21.818c-2.2 0-4.25-.74-5.9-1.98l-.422-.317-4.236 1.336 1.378-4.13-.327-.424A9.79 9.79 0 0 1 6.182 15c0-5.418 4.401-9.818 9.819-9.818 5.418 0 9.818 4.4 9.818 9.818s-4.4 9.818-9.818 9.818zm5.42-7.356c-.296-.148-1.752-.864-2.024-.963-.272-.099-.47-.148-.669.149-.198.296-.768.963-.941 1.16-.173.198-.346.223-.642.074-.296-.148-1.252-.462-2.384-1.473-.881-.786-1.476-1.756-1.649-2.052-.173-.296-.018-.456.13-.604.134-.134.296-.346.444-.519.148-.173.198-.296.296-.494.099-.198.05-.371-.025-.519-.074-.148-.669-1.613-.916-2.207-.24-.576-.485-.497-.669-.506l-.57-.01c-.198 0-.519.074-.792.371s-1.04 1.016-1.04 2.479 1.064 2.875 1.213 3.074c.148.198 2.095 3.2 5.076 4.487.709.306 1.261.489 1.693.626.711.226 1.358.194 1.869.118.57-.085 1.752-.716 2-1.408.247-.692.247-1.285.173-1.408-.074-.124-.272-.198-.568-.346z" />
      </svg>
    </a>
  );
}
