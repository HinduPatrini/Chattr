import React from "react";

const Avatar = ({ src, name = "?", size = "md", showOnline = false, isOnline = false }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-2xl",
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;
  const initial = name ? name.trim().charAt(0).toUpperCase() : "?";

  return (
    <div className={`relative inline-block ${selectedSize.split(" ")[0]} ${selectedSize.split(" ")[1]} flex-shrink-0`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover ring-2 ring-accent/20"
        />
      ) : (
        <div className={`w-full h-full rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white font-semibold select-none ring-2 ring-accent/20`}>
          {initial}
        </div>
      )}
      
      {showOnline && isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full border-2 border-background-secondary" />
      )}
    </div>
  );
};

export default Avatar;
