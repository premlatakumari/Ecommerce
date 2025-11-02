import mongoose from 'mongoose';

export const validateObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName} format`);
  }
  return new mongoose.Types.ObjectId(id);
};

export const validateObjectIdString = (id, fieldName) => {
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error(`Invalid ${fieldName} format`);
  }
  return id;
};

export const validateDateFormat = (date) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format");
  }
  return parsedDate;
};

export const validateRequiredFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") {
      return `${key} is required`;
    }
  }
  return null;
};