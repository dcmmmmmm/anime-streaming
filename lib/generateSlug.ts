// Add this function at the top of the file after imports
const generateSlug = (title: string): string => {
  const slug = title
  .toLowerCase() // Convert the title to lowercase
  .replace(/\s+/g, "-") // Replace spaces with dashes
  .replace(/[^\w\-]+/g, "") // Remove non-word characters except dashes
  .replace(/\-\-+/g, "-") // Replace multiple consecutive dashes with a single dash
  .replace(/^\-+/, "") // Remove dashes from the beginning
  .replace(/\-+$/, ""); // Remove dashes from the end

  return slug;
};

export default generateSlug;