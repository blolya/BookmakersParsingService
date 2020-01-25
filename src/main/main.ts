import {FonbetParsingService} from "../bookmakers/fonbet/FonbetParsingService";
import {CommonFormats} from "../types/Odds";


const main = () => {

  const fps = new FonbetParsingService();
  fps.subscribeToSports([CommonFormats.Sport.TENNIS]);

  fps.on("factor", (factor: CommonFormats.Factor) => {
    if (factor.extra.eventParentId === 19041117)
      if (factor.betType.type === CommonFormats.EBetType.WIN)
        console.log(factor);
  })

};

main();
