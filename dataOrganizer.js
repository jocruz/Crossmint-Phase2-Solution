const organizeMegaVerseData = (megaVerseTwo) => {
  const polyanetArray = [];
  const soloonsArray = [];
  const comethArray = [];

  megaVerseTwo.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (value.includes("POLYANET")) {
        polyanetArray.push({ value, rowIndex, columnIndex });
      } else if (value.includes("SOLOON")) {
        soloonsArray.push({ value, rowIndex, columnIndex });
      } else if (value.includes("COMETH")) {
        comethArray.push({ value, rowIndex, columnIndex });
      }
    });
  });
  return { polyanetArray, soloonsArray, comethArray };
};

module.exports = { organizeMegaVerseData };
