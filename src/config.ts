export type PRESET_NAME =
  | 'flat'
  | 'acoustic'
  | 'bassbooster'
  | 'bassreducer'
  | 'classical'
  | 'dance'
  | 'deep'
  | 'electronic'
  | 'hiphop'
  | 'jazz'
  | 'latin'
  | 'loudness'
  | 'lounge'
  | 'piano'
  | 'pop'
  | 'rb'
  | 'rock'
  | 'treblebooster'
  | 'treblereducer'
  | 'vocalbooster'; // | 'perfect' | 'explosion'

export const FREQUENCIES = [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const;

// prettier-ignore
export const PRESETS: Record<PRESET_NAME, [number, number, number, number, number, number, number, number, number, number]> = {
  flat         : [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  acoustic     : [ 6,  6,  5,  1,  3,  2,  4,  5,  4,  2],
  bassbooster  : [ 6,  5,  3,  2,  1,  0,  0,  0,  0,  0],
  bassreducer  : [-6, -5, -3, -2, -1,  0,  0,  0,  0,  0],
  classical    : [ 5,  4,  3,  2, -1, -1,  0,  2,  3,  4],
  dance        : [ 4,  7,  6,  0,  2,  4,  6,  5,  4,  0],
  deep         : [ 6,  3,  2,  0,  3,  2,  1, -2, -4, -6],
  electronic   : [ 5,  4,  1,  0, -2,  2,  1,  1,  2,  6],
  hiphop       : [ 6,  5,  2,  3, -2, -2,  2, -1,  2,  3],
  jazz         : [ 5,  3,  1,  2, -1, -1,  0,  1,  3,  5],
  latin        : [ 5,  3,  0,  0, -2, -2, -2,  0,  3,  5],
  loudness     : [ 6,  5,  0,  0, -2,  0, -1, -6,  6,  2],
  lounge       : [-3, -1,  0,  2,  5,  3,  0, -2,  2,  1],
  piano        : [ 3,  2,  0,  2,  3,  1,  3,  5,  3,  4],
  pop          : [-2, -1,  0,  2,  5,  5,  2,  0, -1, -2],
  rb           : [ 3,  7,  6,  2, -3, -1,  3,  3,  3,  4],
  rock         : [ 6,  5,  3,  2, -1, -2,  0,  3,  4,  5],
  treblebooster: [ 0,  0,  0,  0,  0,  1,  2,  3,  5,  6],
  treblereducer: [ 0,  0,  0,  0,  0, -1, -2, -3, -5, -6],
  vocalbooster : [-1, -3, -3,  1,  5,  5,  3,  1,  0, -1]
  // perfect   : [ 0,  0,  9,  7,  6,  5,  7,  9,  0,  0],
  // explosion : [ 0,  0,  9,  7,  6,  5,  7,  4,  0,  0],
};

export const MIN_FREQUENCY = 20;
export const MAX_FREQUENCY = 20000;

export const isPresetName = (presetName: string): presetName is PRESET_NAME => {
  const presetNames = Object.keys(PRESETS);

  return presetNames.includes(presetName);
};
