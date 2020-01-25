import {FonbetParsingService} from "../bookmakers/fonbet/FonbetParsingService";
import {CommonFormats} from "../types/Odds";


const main = () => {

  const fps = new FonbetParsingService();
  fps.subscribeToSports([CommonFormats.Sport.TENNIS]);

  fps.on("factor", (factor: CommonFormats.Factor) => {
      console.log(factor);
  })

};

main();
