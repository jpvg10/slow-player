import { ChildProcess, spawn } from 'child_process';
import { join } from 'path';
import EventEmitter from 'events';
import treeKill from 'tree-kill';
import { EEventTypes } from './utils/enums';
import { timestampToSeconds } from './utils/helpers';
import { IPlayer } from './utils/interfaces';

const ffplayPath = join('bin', 'ffplay.exe');
const ffprobePath = join('bin', 'ffprobe.exe');

const openFile = (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const probeProcess = spawn(
      ffprobePath,
      [filePath, '-hide_banner', '-print_format', 'json', '-show_entries', 'format=duration'],
      { shell: true }
    );

    let output = '';
    let errorMessage = '';
    let parsedOutput: any;

    probeProcess.stdout?.on('data', (data: Buffer) => {
      output += data.toString();
    });

    probeProcess.stdout?.on('end', () => {
      parsedOutput = JSON.parse(output) as any;
    });

    probeProcess.stderr?.on('data', (data: Buffer) => {
      errorMessage = data.toString();
    });

    probeProcess.on('close', (code: number) => {
      // console.log(`child process exited with code ${code}`);
      if (code === 0 && parsedOutput?.format?.duration) {
        resolve(parsedOutput.format.duration);
      } else {
        reject(errorMessage || 'The file cannot be played');
      }
    });
  });
};

export const createPlayer = async (filePath: string): Promise<IPlayer> => {
  let playProcess: ChildProcess | null = null;
  const events = new EventEmitter();
  const songLength = await openFile(filePath);

  const pause = () => {
    if (playProcess) {
      treeKill(playProcess.pid);
      playProcess = null;
    }
  };

  const play = (speedFactor: number = 1, startTime: string = '00:00') => {
    playProcess = spawn(
      ffplayPath,
      [filePath, '-af', `atempo=${speedFactor}`, '-ss', startTime, '-loglevel', 'error', '-nodisp'],
      { shell: true }
    );

    /* playProcess.stderr?.on('data', (data: Buffer) => {
      console.log(data.toString());
    }); */

    let t = timestampToSeconds(startTime);
    events.emit(EEventTypes.TIME, t);

    const timer = setInterval(() => {
      t++;
      if (t > songLength) {
        events.emit(EEventTypes.SONG_END);
        pause();
      } else {
        events.emit(EEventTypes.TIME, t);
      }
    }, 1000 / speedFactor);

    playProcess.on('close', (code: number) => {
      // console.log(`child process exited with code ${code}`);
      clearInterval(timer);
    });
  };

  const player: IPlayer = {
    songLength,
    events,
    play,
    pause
  };

  return player;
};
