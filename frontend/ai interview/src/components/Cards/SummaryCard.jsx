import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { initial } from "../../utils/helper"; // assuming this returns a string initial

const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      onClick={onSelect}
      className="cursor-pointer relative rounded-xl p-5 text-white shadow-md transition-transform hover:scale-[1.02]"
      style={{ background: colors?.bgcolor || "#2563eb" }}
    >
      {/* Styled Initial Badge */}
      <div className="w-10 h-10 mb-3 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl font-bold uppercase">
        {initial(role || "")}
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-3 right-3 text-white hover:text-red-400"
      >
        <FiTrash2 className="text-xl" />
      </button>

      {/* Role */}
      <h3 className="text-xl font-semibold mb-1 capitalize">{role}</h3>

      {/* Experience */}
      <p className="text-sm mb-2">Experience: {experience}</p>

      {/* Questions */}
      <p className="text-sm mb-2">Questions: {questions}</p>

      {/* Topics to focus */}
      <p className="text-sm mb-2">
        Topics: {topicsToFocus?.join?.(", ") || topicsToFocus}
      </p>

      {/* Description */}
      <p className="text-sm mb-2 truncate">Description: {description}</p>

      {/* Last Updated */}
      <p className="text-xs mt-3 text-gray-100">Updated: {lastUpdated}</p>
    </div>
  );
};

export default SummaryCard;
