const { getMap } = require("./mapFetcher");
const { organizeMegaVerseData } = require("./dataOrganizer");
const { postEntity } = require("./api");
const { candidateId } = require("./config");

async function postCometh(comethArray) {
  for (const cometh of comethArray) {
    const direction = cometh.value.split("_")[0].toLowerCase();
    await postEntity("comeths", {
      candidateId,
      row: cometh.rowIndex,
      column: cometh.columnIndex,
      direction,
    });
  }
  console.log("Completed posting Comeths on the map.");
}

async function postPoly(polyanetArray) {
  for (const poly of polyanetArray) {
    await postEntity("polyanets", {
      candidateId,
      row: poly.rowIndex,
      column: poly.columnIndex,
    });
  }
  console.log("Completed posting Polyanets on the map.");
}

async function postSoloons(soloonsArray) {
  for (const sol of soloonsArray) {
    const color = sol.value.split("_")[0].toLowerCase();
    await postEntity("soloons", {
      candidateId,
      row: sol.rowIndex,
      column: sol.columnIndex,
      color,
    });
  }
  console.log("Completed posting Soloons on the map.");
}

async function main() {
  try {
    const data = await getMap();
    const { polyanetArray, soloonsArray, comethArray } =
      organizeMegaVerseData(data);

    await postCometh(comethArray);
    await postPoly(polyanetArray);
    await postSoloons(soloonsArray);

    console.log("Finished organizing and posting data.");
  } catch (error) {
    console.error("An error occurred in the main function:", error);
    throw error;
  }
}

main();
