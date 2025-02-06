export function compareArrays<T>(oldArray: T[], newArray: T[], prop?: string) {
  // Find items to remove (present in oldArray but not in newArray)
  const itemsToRemove = oldArray.filter(
    (item) =>
      !newArray.some((newItem) => {
        if (prop) {
          return newItem[prop] === item[prop];
        } else {
          return newItem === item;
        }
      }),
  );

  // Find items to add (present in newArray but not in oldArray)
  const itemsToAdd = newArray.filter(
    (item) =>
      !oldArray.some((oldItem) => {
        if (prop) {
          return oldItem[prop] === item[prop];
        } else {
          return oldItem === item;
        }
      }),
  );

  // Return the items to remove and add
  return {
    itemsToRemove,
    itemsToAdd,
  };
}
