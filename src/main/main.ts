import {FonbetParsingService} from "../bookmakers/fonbet/FonbetParsingService";
import {CommonFormats} from "../types/Odds";


const main = (): void => {
  const fps = new FonbetParsingService();
  fps.subscribeToSports([CommonFormats.Sport.TENNIS]);

  fps.on("factor", (factor: any): void => {
    console.log(factor);
  })

};

main();
