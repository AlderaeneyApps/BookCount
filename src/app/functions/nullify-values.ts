export const nullifyValues = (data: Record<string, any>): Record<string, any> => {
  const outputData: Record<string, any> = {};
  Object.keys(data).forEach(key => {
    if (!data[key]) {
      outputData[key] = null;
    } else {
      outputData[key] = data[key];
    }
  });
  return outputData;
};
