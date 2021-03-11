import EventEmitter from 'events';

export interface IPlayer {
  songLength: number;
  events: EventEmitter;
  play: (speedFactor?: number, startTime?: string) => void;
  pause: () => void;
}
