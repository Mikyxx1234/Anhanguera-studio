import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const handleClick = () => {
    window.open('https://api.whatsapp.com/send?phone=5511992793249', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 animate-pulse"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}