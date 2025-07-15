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
    <div className="profile-photo-selector">
      <div className="profile-circle">
        {image || previewUrl ? (
          <img
            src={previewUrl || preview || URL.createObjectURL(image)}
            alt="Profile preview"
            className="profile-image"
          />
        ) : (
          <LuUser className="default-icon" />
        )}
      </div>

      <button
        type="button"
        onClick={onChooseFile}
        className="upload-button"
        title="Upload Photo"
        aria-label="Upload profile photo"
      >
        <LuUpload className="upload-icon" />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="file-input"
      />

      {(image || previewUrl) && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="remove-button"
          aria-label="Remove profile photo"
        >
          <LuTrash className="remove-icon" />
          Remove
        </button>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;

<style jsx>{`
  .profile-photo-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    margin-bottom: 1.5rem;
  }

  .profile-circle {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #d1d5db;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
  }

  .profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .default-icon {
    width: 1.75rem;
    height: 1.75rem;
  }

  .upload-button {
    position: absolute;
    bottom: -0.25rem;
    left: 2.75rem;
    background-color: #4f46e5;
    color: white;
    border-radius: 50%;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .upload-button:hover {
    background-color: #4338ca;
  }

  .upload-icon {
    width: 1rem;
    height: 1rem;
  }

  .file-input {
    display: none;
  }

  .remove-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background-color: #ef4444;
    color: white;
    border-radius: 0.375rem;
    border: none;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .remove-button:hover {
    background-color: #dc2626;
  }

  .remove-icon {
    width: 1rem;
    height: 1rem;
  }
`}</style>;
