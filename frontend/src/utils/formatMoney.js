export const formatNumberWithCommas = (number) => {
  // Check if the input is a valid number
  if (typeof number !== "number") {
    return "Invalid input";
  }

  // Use toLocaleString to format the number with commas
  return number.toLocaleString();
};
