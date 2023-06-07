export const getOnlyClassCode = (message: string) => {
  const regex = /\bSala: (\w+)\b/;

  const classCode = message.match(regex);

  return classCode[1];
};
