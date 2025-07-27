import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-purple-700 blur-sm opacity-40 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loading;
