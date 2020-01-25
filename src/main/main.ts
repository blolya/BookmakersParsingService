import {FonbetParsingService} from "../bookmakers/fonbet/FonbetParsingService";
import {CommonFormats} from "../types/Odds";


const main = (): void => {

  const fps = new FonbetParsingService();
  fps.subscribeToSports([CommonFormats.Sport.TENNIS]);

  fps.on("factor", (factor: CommonFormats.Factor) => {
    if (factor.betType.type)
      console.log(factor);
  })

};

main();
