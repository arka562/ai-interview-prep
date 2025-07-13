import React from "react";

const SpinnerLoader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin">
        Loading...
      </div>
    </div>
  );
};

export default SpinnerLoader;
