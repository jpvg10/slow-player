import { ChildProcess, spawn } from 'child_process';
import { join } from 'path';
import EventEmitter from 'events';
import treeKill from 'tree-kill';
import { EEventTypes } from './utils/enums';
import { timestampToSeconds } from './utils/helpers';

const commandPath = join('bin', 'ffplay.exe');
const event = new EventEmitter();
let process: ChildProcess | null = null;

const play = (
  filePath: string,
  speedFactor: number = 1,
  startTime: string = '00:00'
): EventEmitter => {
  process = spawn(
    commandPath,
    [filePath, '-af', `atempo=${speedFactor}`, '-ss', startTime, '-loglevel', 'error', '-nodisp'],
    { shell: true }
  );

  process.stderr?.on('data', (data: Buffer) => {
    console.log(data.toString());
  });

  let t = timestampToSeconds(startTime);
  event.emit(EEventTypes.TIME, t);

  const timer = setInterval(() => {
    t++;
    event.emit(EEventTypes.TIME, t);
  }, 1000 / speedFactor);

  process.on('close', (code) => {
    clearInterval(timer);
    event.emit(EEventTypes.TIME, t);
    console.log(`child process exited with code ${code}`);
  });

  return event;
};

const pause = () => {
  if (process) {
    console.log('kill');
    treeKill(process.pid);
    process = null;
  }
};

export { play, pause };
