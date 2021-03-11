import { secondsToTimestamp, timestampToSeconds } from './helpers';

describe('helpers', () => {
  describe('secondsToTimestamp', () => {
    it('should handle less than 10 seconds', () => {
      const timestamp = secondsToTimestamp(5);
      expect(timestamp).toBe('00:05');
    });

    it('should handle less than 1 minute', () => {
      const timestamp = secondsToTimestamp(40);
      expect(timestamp).toBe('00:40');
    });

    it('should handle less than 10 minutes', () => {
      const s = 6 * 60 + 50;
      const timestamp = secondsToTimestamp(s);
      expect(timestamp).toBe('06:50');
    });

    it('should handle less than 1 hour', () => {
      const s = 45 * 60 + 30;
      const timestamp = secondsToTimestamp(s);
      expect(timestamp).toBe('45:30');
    });

    it('should handle less than 10 hours', () => {
      const t = 2 * 60 * 60 + 20 * 60 + 30;
      const timestamp = secondsToTimestamp(t);
      expect(timestamp).toBe('02:20:30');
    });

    it('should handle more than 10 hours', () => {
      const t = 15 * 60 * 60 + 25 * 60 + 10;
      const timestamp = secondsToTimestamp(t);
      expect(timestamp).toBe('15:25:10');
    });

    it('should throw with negative numbers', () => {
      expect(() => {
        secondsToTimestamp(-1);
      }).toThrow();
    });
  });

  describe('timestampToSeconds', () => {
    it('should handle SS', () => {
      const s = timestampToSeconds('05');
      expect(s).toBe(5);
    });

    it('should handle MM:SS', () => {
      const s = timestampToSeconds('20:35');
      const t = 20 * 60 + 35;
      expect(s).toBe(t);
    });

    it('should handle HH:MM:SS', () => {
      const s = timestampToSeconds('03:10:40');
      const t = 3 * 60 * 60 + 10 * 60 + 40;
      expect(s).toBe(t);
    });

    it('should handle leading :', () => {
      let s = timestampToSeconds('::05');
      expect(s).toBe(5);
      s = timestampToSeconds(':10:24');
      const t = 10 * 60 + 24;
      expect(s).toBe(t);
    });

    it('should handle : in the middle', () => {
      const s = timestampToSeconds('03::12');
      const t = 3 * 60 * 60 + 12;
      expect(s).toBe(t);
    });

    it('should handle trailing :', () => {
      let s = timestampToSeconds('15::');
      let t = 15 * 60 * 60;
      expect(s).toBe(t);
      s = timestampToSeconds('06:20:');
      t = 6 * 60 * 60 + 20 * 60;
      expect(s).toBe(t);
    });

    it('should handle more than 60 seconds', () => {
      const s = timestampToSeconds('10:125');
      const t = 10 * 60 + 125;
      expect(s).toBe(t);
    });

    it('should handle more than 60 minutes', () => {
      const s = timestampToSeconds('02:75:16');
      const t = 2 * 60 * 60 + 75 * 60 + 16;
      expect(s).toBe(t);
    });

    it('should throw with more than 3 parts', () => {
      expect(() => {
        timestampToSeconds('01:01:01:01');
      }).toThrow();
    });

    it('should throw when some part is not a number', () => {
      expect(() => {
        timestampToSeconds('01:a:01');
      }).toThrow();
    });

    it('should throw when some part is a negative number', () => {
      expect(() => {
        timestampToSeconds('01:01:-01');
      }).toThrow();
    });
  });
});
