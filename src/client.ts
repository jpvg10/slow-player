import { createPlayer } from './player';
import { EEventTypes } from './utils/enums';
import { secondsToTimestamp } from './utils/helpers';
import { IPlayer } from './utils/interfaces';

const filePath = 'sample.mp3';
const speedFactor = 1;
const startTime = '00:00';

createPlayer(filePath)
  .then((player: IPlayer) => {
    console.log('Song length:', secondsToTimestamp(player.songLength));

    player.events.on(EEventTypes.TIME, (t: number) => {
      console.log(secondsToTimestamp(t));
    });

    player.events.on(EEventTypes.SONG_END, () => {
      console.log('Song ended');
    });

    player.play(speedFactor, startTime);

    setTimeout(() => {
      player.pause();
    }, 10000);
  })
  .catch((error: any) => {
    console.log('Error:', error);
  });
