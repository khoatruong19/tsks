import React from "react";

const CollectionTodayTask = () => {
  return (
    <div className="flex gap-4 p-4">
      <label className="container">
        <input type="checkbox" />
        <span className="checkmark border-[3px] border-primaryColor"></span>
      </label>
      <div>
        <p className="text-lg font-medium text-textColor/95">Do homeword</p>
        <p className="text-sm text-red-500">Today 12:00</p>
      </div>
    </div>
  );
};

export default CollectionTodayTask;
