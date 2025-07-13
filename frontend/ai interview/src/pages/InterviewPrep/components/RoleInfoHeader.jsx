import React from "react";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{role}</h2>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Experience:</strong> {experience}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Topics to Focus:</strong>{" "}
        {Array.isArray(topicsToFocus)
          ? topicsToFocus.join(", ")
          : topicsToFocus}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Questions:</strong> {questions}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Description:</strong> {description || "N/A"}
      </p>
      <p className="text-sm text-gray-400 mt-2">
        <strong>Last Updated:</strong> {lastUpdated}
      </p>
    </div>
  );
};

export default RoleInfoHeader;
