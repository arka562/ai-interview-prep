import React, { useRef, useState } from "react";
import { LuUpload, LuTrash, LuUser } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      if (setPreview) setPreview(preview);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (setPreview) setPreview(null);
    if (inputRef.current) inputRef.current.value = null;
  };

  const onChooseFile = () => inputRef.current.click();

  return (
    <div className="flex items-center gap-4 relative">
      {/* Profile Circle */}
      <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-400">
        {image || previewUrl ? (
          <img
            src={previewUrl || preview || URL.createObjectURL(image)}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <LuUser size={28} />
        )}
      </div>

      {/* Upload Button - Positioned Just Outside the Circle */}
      <button
        type="button"
        onClick={onChooseFile}
        className="absolute -bottom-1 left-11 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition"
        title="Upload Photo"
      >
        <LuUpload size={16} />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Remove Button */}
      {(image || previewUrl) && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
        >
          <LuTrash size={16} />
          Remove
        </button>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
