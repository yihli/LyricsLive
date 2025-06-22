import { extractTime } from '../src/utils/lyrics';

describe('findSyncedLyrics()', ()=> {

});

describe('extractTime()', () => {
    it('should return the correct milliseconds if timestamp exists', () => {
        expect(extractTime('[01:23.45] lyrice line lalalal')).toBe(83450)
        expect(extractTime('[01:23.45]')).toBe(83450);
        expect(extractTime('[12:34.56]')).toBe(754560);
        expect(extractTime('[99:59.99]')).toBe(5999990);
        expect(extractTime('[00:00.00]')).toBe(0);
    });

    it('should throw an error for invalid formats', () => {
        expect(() => extractTime('01:23.45')).toThrow('Invalid LRC timestamp format');
        expect(() => extractTime('[abc]')).toThrow('Invalid LRC timestamp format');
        expect(() => extractTime('[]')).toThrow('Invalid LRC timestamp format');
        expect(() => extractTime('[99:99]')).toThrow('Invalid LRC timestamp format');
    });

    it('should handle single-digit minutes, seconds, and hundredths', () => {
        expect(extractTime('[1:2.3]')).toBe(62030);
    });
});

