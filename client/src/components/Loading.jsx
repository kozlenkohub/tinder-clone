import React from 'react';

const Loading = () => {
  const hearts = Array.from({ length: 20 });
  return (
    <div className="flex items-center justify-center h-screen overflow-hidden bg-opacity-5">
      <div className="relative w-64 h-64">
        {hearts.map((_, index) => {
          const angle = (360 / hearts.length) * index;
          const delay = (index * 0.2).toFixed(2); // Увеличили шаг задержки для плавности
          return (
            <div
              key={index}
              className="absolute top-1/2 left-1/2 w-6 h-6 text-red-500 fill-current animate-heart-move"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(100px) rotate(-${angle}deg)`,
                animationDelay: `${delay}s`,
              }}>
              <svg viewBox="0 0 32 29.6" className="w-full h-full">
                <path
                  d="M23.6,0c-3.4,0-6.4,1.8-8,4.5C13.8,1.8,10.8,0,7.4,0
                  C3.3,0,0,3.3,0,7.4c0,7.7,16,21.1,16,21.1s16-13.4,16-21.1
                  C32,3.3,28.7,0,24.6,0H23.6z"
                />
              </svg>
            </div>
          );
        })}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 32 29.6"
            className="w-32 h-32 text-red-500 fill-current animate-heart-pulse">
            <path
              d="M23.6,0c-3.4,0-6.4,1.8-8,4.5C13.8,1.8,10.8,0,7.4,0
              C3.3,0,0,3.3,0,7.4c0,7.7,16,21.1,16,21.1s16-13.4,16-21.1
              C32,3.3,28.7,0,24.6,0H23.6z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loading;
