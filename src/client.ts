import { play, pause } from './player';
import { EEventTypes } from './utils/enums';
import { secondsToTimestamp } from './utils/helpers';

const filePath = 'sample.mp3';
const speedFactor = 1;
const startTime = '00:00';

const player = play(filePath, speedFactor, startTime);

player.on(EEventTypes.TIME, (t: number) => {
  console.log(secondsToTimestamp(t));
});

setTimeout(async () => {
  pause();
}, 10000);
