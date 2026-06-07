import React, { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";

const MediaPanel = ({ messages, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Filter messages that contain image media
  const mediaMessages = messages.filter((msg) => msg.image);

  return (
    <div className="w-full sm:w-80 h-full border-l border-border bg-background-secondary flex flex-col z-20 flex-shrink-0 absolute right-0 sm:relative sm:z-10 animate-slide-in">
      
      {/* Panel Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4 select-none flex-shrink-0 bg-background-tertiary">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-accent" />
          <span className="font-semibold text-text-primary text-sm">Shared Media</span>
          <span className="text-xs text-text-muted bg-background-hover px-2 py-0.5 rounded-full">
            {mediaMessages.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-background-hover text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
          title="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {mediaMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 select-none">
            <div className="w-12 h-12 rounded-xl bg-background-tertiary border border-border flex items-center justify-center text-text-muted mb-3">
              <ImageIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-text-primary">No media yet</p>
            <p className="text-xs text-text-muted mt-1 max-w-[200px]">
              Images sent in this conversation will show up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {mediaMessages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => setSelectedImage(msg.image)}
                className="aspect-square rounded-lg overflow-hidden border border-border bg-background-tertiary cursor-zoom-in group relative hover:border-accent/40 transition-all duration-200"
              >
                <img
                  src={msg.image}
                  alt="Shared media item"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Zoom Overlay */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center animate-fade-in p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
          
          <img
            src={selectedImage}
            alt="Full-size shared media item"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10 select-none cursor-default"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}

    </div>
  );
};

export default MediaPanel;
