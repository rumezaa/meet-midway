import React, { useState } from 'react';

export default function PreferenceItem({ idx, children, isRanked, onClick, color }) {
  return (
    <div
      className={`uppercase flex items-center justify-center px-4 py-1 rounded-lg cursor-pointer ${color} text-white ${!isRanked && 'opacity-50'}`}
      onClick={onClick}
    >
      {isRanked && <span className="text-gray-500">{idx}&nbsp;</span>}
      {children}
    </div>
  );
};