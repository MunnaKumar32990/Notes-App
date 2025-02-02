import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

const Toast = ({ isShown, msg, type, onClose }) => {
  useEffect(() => {
    if (!isShown) return; // Prevent running when hidden

    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isShown]); 

  if (!isShown) return null; // Do not render if not shown

  return (
    <div className={`fixed top-20 right-6 transition-all duration-700 ${
      isShown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
    }`}>
      <div className={`relative min-w-52 bg-white border shadow-2xl rounded-md flex items-center p-3 after:w-[5px] after:h-full ${
        type === "delete" ? "after:bg-red-500" : "after:bg-green-500"
      } after:absolute after:left-0 after:top-0 after:rounded-l-lg`}>
        
        {/* Icon */}
        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
          type === "delete" ? "bg-red-50" : "bg-green-50"
        }`}>
          {type === "delete" ? (
            <MdDeleteOutline className="text-xl text-red-500" />
          ) : (
            <LuCheck className="text-xl text-green-500" />
          )}
        </div>

        {/* Message */}
        <p className="ml-3 text-sm text-slate-800">{msg}</p>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-black">
          ✖
        </button>
      </div>
    </div>
  );
};

export default Toast;
