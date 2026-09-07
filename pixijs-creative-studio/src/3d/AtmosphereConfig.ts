import * as THREE from 'three';
import { TimeOfDayPreset, TimeOfDayAtmosphere } from '../types';

export const TIME_PRESETS: Record<TimeOfDayPreset, TimeOfDayAtmosphere> = {
  dawn: {
    preset: 'dawn',
    label: 'Dawn',
    hour: 7.5,
    timeString: '07:30 AM',
    description: 'Soft amber sunlight streaming through tall cathedral windows with morning mist',
    icon: '🌅',
  },
  day: {
    preset: 'day',
    label: 'Day',
    hour: 13.0,
    timeString: '01:00 PM',
    description: 'Clear azure procedural sky with radiant natural lecture hall daylight',
    icon: '☀️',
  },
  sunset: {
    preset: 'sunset',
    label: 'Sunset',
    hour: 18.5,
    timeString: '06:30 PM',
    description: 'Fiery coral and vermilion sky with dramatic long golden rays and warm sconces',
    icon: '🌇',
  },
  night: {
    preset: 'night',
    label: 'Night',
    hour: 21.5,
    timeString: '09:30 PM',
    description: 'Cosmic deep navy sky with twinkling stars, cool moonlight and high-contrast stage spotlights',
    icon: '🌙',
  },
};

interface Keyframe {
  hour: number;
  topColor: number;
  horizonColor: number;
  bottomColor: number;
  sunColor: number;
  sunPos: [number, number, number];
  sunIntensity: number;
  starsOpacity: number;
  ambientColor: number;
  ambientIntensity: number;
  mainLightColor: number;
  mainLightIntensity: number;
  windowLightColor: number;
  windowLightIntensity: number;
  sconceIntensity: number;
  stageSpotMultiplier: number;
  fogColor: number;
  fogDensity: number;
  shaftOpacity: number;
  shaftColor: number;
}

const KEYFRAMES: Keyframe[] = [
  // 00:00 Midnight
  {
    hour: 0.0,
    topColor: 0x02050e,
    horizonColor: 0x090f1d,
    bottomColor: 0x02040a,
    sunColor: 0x93c5fd,
    sunPos: [-18, 22, -4],
    sunIntensity: 0.35,
    starsOpacity: 1.0,
    ambientColor: 0x0a101f,
    ambientIntensity: 0.32,
    mainLightColor: 0x1e293b,
    mainLightIntensity: 0.3,
    windowLightColor: 0x38bdf8,
    windowLightIntensity: 0.28,
    sconceIntensity: 1.5,
    stageSpotMultiplier: 1.35,
    fogColor: 0x040812,
    fogDensity: 0.018,
    shaftOpacity: 0.04,
    shaftColor: 0x38bdf8,
  },
  // 06:00 Pre-dawn
  {
    hour: 6.0,
    topColor: 0x0c1a2f,
    horizonColor: 0x4a2840,
    bottomColor: 0x070c18,
    sunColor: 0xfda4af,
    sunPos: [-28, 2, -10],
    sunIntensity: 0.6,
    starsOpacity: 0.6,
    ambientColor: 0x1e1e38,
    ambientIntensity: 0.4,
    mainLightColor: 0x334155,
    mainLightIntensity: 0.5,
    windowLightColor: 0xf472b6,
    windowLightIntensity: 0.5,
    sconceIntensity: 1.2,
    stageSpotMultiplier: 1.2,
    fogColor: 0x181326,
    fogDensity: 0.016,
    shaftOpacity: 0.08,
    shaftColor: 0xfb7185,
  },
  // 07:45 Dawn / Morning
  {
    hour: 7.75,
    topColor: 0x1e3a5f,
    horizonColor: 0xfba778,
    bottomColor: 0x0f172a,
    sunColor: 0xffedd5,
    sunPos: [-28, 8, -6],
    sunIntensity: 1.3,
    starsOpacity: 0.0,
    ambientColor: 0xc7d2fe,
    ambientIntensity: 0.58,
    mainLightColor: 0xfed7aa,
    mainLightIntensity: 1.0,
    windowLightColor: 0xfb923c,
    windowLightIntensity: 1.1,
    sconceIntensity: 0.65,
    stageSpotMultiplier: 1.0,
    fogColor: 0x27273a,
    fogDensity: 0.012,
    shaftOpacity: 0.22,
    shaftColor: 0xfed7aa,
  },
  // 12:30 - 13:30 Midday Sun
  {
    hour: 13.0,
    topColor: 0x0284c7,
    horizonColor: 0xbae6fd,
    bottomColor: 0x1e293b,
    sunColor: 0xfffbf0,
    sunPos: [-14, 28, 2],
    sunIntensity: 1.6,
    starsOpacity: 0.0,
    ambientColor: 0xe0f2fe,
    ambientIntensity: 0.78,
    mainLightColor: 0xfff7ed,
    mainLightIntensity: 1.4,
    windowLightColor: 0x7dd3fc,
    windowLightIntensity: 1.0,
    sconceIntensity: 0.25,
    stageSpotMultiplier: 0.9,
    fogColor: 0x0f172a,
    fogDensity: 0.009,
    shaftOpacity: 0.12,
    shaftColor: 0xffffff,
  },
  // 17:00 Late Afternoon
  {
    hour: 17.0,
    topColor: 0x0369a1,
    horizonColor: 0xfde047,
    bottomColor: 0x1e293b,
    sunColor: 0xfef08a,
    sunPos: [-24, 12, 6],
    sunIntensity: 1.45,
    starsOpacity: 0.0,
    ambientColor: 0xfef9c3,
    ambientIntensity: 0.65,
    mainLightColor: 0xfef08a,
    mainLightIntensity: 1.2,
    windowLightColor: 0xfacc15,
    windowLightIntensity: 1.1,
    sconceIntensity: 0.45,
    stageSpotMultiplier: 0.95,
    fogColor: 0x172554,
    fogDensity: 0.010,
    shaftOpacity: 0.18,
    shaftColor: 0xfef08a,
  },
  // 18.5 Golden Sunset
  {
    hour: 18.5,
    topColor: 0x2e1065,
    horizonColor: 0xea580c,
    bottomColor: 0x0c0617,
    sunColor: 0xff6618,
    sunPos: [-28, 4.5, 10],
    sunIntensity: 1.8,
    starsOpacity: 0.1,
    ambientColor: 0xf472b6,
    ambientIntensity: 0.52,
    mainLightColor: 0xf97316,
    mainLightIntensity: 0.95,
    windowLightColor: 0xf97316,
    windowLightIntensity: 1.5,
    sconceIntensity: 1.15,
    stageSpotMultiplier: 1.18,
    fogColor: 0x1c0c28,
    fogDensity: 0.013,
    shaftOpacity: 0.26,
    shaftColor: 0xf97316,
  },
  // 20:30 Dusk / Twilight
  {
    hour: 20.5,
    topColor: 0x0d0b24,
    horizonColor: 0x2e1065,
    bottomColor: 0x05040f,
    sunColor: 0x818cf8,
    sunPos: [-24, 12, -2],
    sunIntensity: 0.55,
    starsOpacity: 0.8,
    ambientColor: 0x1e1b4b,
    ambientIntensity: 0.38,
    mainLightColor: 0x312e81,
    mainLightIntensity: 0.45,
    windowLightColor: 0x6366f1,
    windowLightIntensity: 0.45,
    sconceIntensity: 1.4,
    stageSpotMultiplier: 1.3,
    fogColor: 0x0a0918,
    fogDensity: 0.016,
    shaftOpacity: 0.06,
    shaftColor: 0x818cf8,
  },
  // 21.5 - 23.5 Night Lecture
  {
    hour: 21.5,
    topColor: 0x030712,
    horizonColor: 0x0f172a,
    bottomColor: 0x020617,
    sunColor: 0x93c5fd,
    sunPos: [-20, 22, -4],
    sunIntensity: 0.4,
    starsOpacity: 1.0,
    ambientColor: 0x0d1527,
    ambientIntensity: 0.35,
    mainLightColor: 0x38bdf8,
    mainLightIntensity: 0.35,
    windowLightColor: 0x60a5fa,
    windowLightIntensity: 0.32,
    sconceIntensity: 1.5,
    stageSpotMultiplier: 1.35,
    fogColor: 0x060a14,
    fogDensity: 0.018,
    shaftOpacity: 0.04,
    shaftColor: 0x60a5fa,
  },
  // 24:00 (wraps to 00:00)
  {
    hour: 24.0,
    topColor: 0x02050e,
    horizonColor: 0x090f1d,
    bottomColor: 0x02040a,
    sunColor: 0x93c5fd,
    sunPos: [-18, 22, -4],
    sunIntensity: 0.35,
    starsOpacity: 1.0,
    ambientColor: 0x0a101f,
    ambientIntensity: 0.32,
    mainLightColor: 0x1e293b,
    mainLightIntensity: 0.3,
    windowLightColor: 0x38bdf8,
    windowLightIntensity: 0.28,
    sconceIntensity: 1.5,
    stageSpotMultiplier: 1.35,
    fogColor: 0x040812,
    fogDensity: 0.018,
    shaftOpacity: 0.04,
    shaftColor: 0x38bdf8,
  },
];

export interface AtmosphereResult {
  topColor: THREE.Color;
  horizonColor: THREE.Color;
  bottomColor: THREE.Color;
  sunColor: THREE.Color;
  sunPos: THREE.Vector3;
  sunIntensity: number;
  starsOpacity: number;
  ambientColor: THREE.Color;
  ambientIntensity: number;
  mainLightColor: THREE.Color;
  mainLightIntensity: number;
  windowLightColor: THREE.Color;
  windowLightIntensity: number;
  sconceIntensity: number;
  stageSpotMultiplier: number;
  fogColor: THREE.Color;
  fogDensity: number;
  shaftOpacity: number;
  shaftColor: THREE.Color;
  closestPreset: TimeOfDayPreset;
  timeFormatted: string;
}

export function calculateAtmosphere(hour: number): AtmosphereResult {
  // Normalize hour to 0..24
  let h = hour % 24;
  if (h < 0) h += 24;

  // Find bounding keyframes
  let k1 = KEYFRAMES[0];
  let k2 = KEYFRAMES[KEYFRAMES.length - 1];

  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (h >= KEYFRAMES[i].hour && h <= KEYFRAMES[i + 1].hour) {
      k1 = KEYFRAMES[i];
      k2 = KEYFRAMES[i + 1];
      break;
    }
  }

  const range = k2.hour - k1.hour;
  const t = range > 0.0001 ? (h - k1.hour) / range : 0;
  // Smoothstep interpolation for soft non-linear natural lighting transitions
  const smoothT = t * t * (3 - 2 * t);

  const topColor = new THREE.Color(k1.topColor).lerp(new THREE.Color(k2.topColor), smoothT);
  const horizonColor = new THREE.Color(k1.horizonColor).lerp(new THREE.Color(k2.horizonColor), smoothT);
  const bottomColor = new THREE.Color(k1.bottomColor).lerp(new THREE.Color(k2.bottomColor), smoothT);
  const sunColor = new THREE.Color(k1.sunColor).lerp(new THREE.Color(k2.sunColor), smoothT);

  const sunPos = new THREE.Vector3(
    THREE.MathUtils.lerp(k1.sunPos[0], k2.sunPos[0], smoothT),
    THREE.MathUtils.lerp(k1.sunPos[1], k2.sunPos[1], smoothT),
    THREE.MathUtils.lerp(k1.sunPos[2], k2.sunPos[2], smoothT)
  );

  const sunIntensity = THREE.MathUtils.lerp(k1.sunIntensity, k2.sunIntensity, smoothT);
  const starsOpacity = THREE.MathUtils.lerp(k1.starsOpacity, k2.starsOpacity, smoothT);

  const ambientColor = new THREE.Color(k1.ambientColor).lerp(new THREE.Color(k2.ambientColor), smoothT);
  const ambientIntensity = THREE.MathUtils.lerp(k1.ambientIntensity, k2.ambientIntensity, smoothT);

  const mainLightColor = new THREE.Color(k1.mainLightColor).lerp(new THREE.Color(k2.mainLightColor), smoothT);
  const mainLightIntensity = THREE.MathUtils.lerp(k1.mainLightIntensity, k2.mainLightIntensity, smoothT);

  const windowLightColor = new THREE.Color(k1.windowLightColor).lerp(new THREE.Color(k2.windowLightColor), smoothT);
  const windowLightIntensity = THREE.MathUtils.lerp(k1.windowLightIntensity, k2.windowLightIntensity, smoothT);

  const sconceIntensity = THREE.MathUtils.lerp(k1.sconceIntensity, k2.sconceIntensity, smoothT);
  const stageSpotMultiplier = THREE.MathUtils.lerp(k1.stageSpotMultiplier, k2.stageSpotMultiplier, smoothT);

  const fogColor = new THREE.Color(k1.fogColor).lerp(new THREE.Color(k2.fogColor), smoothT);
  const fogDensity = THREE.MathUtils.lerp(k1.fogDensity, k2.fogDensity, smoothT);

  const shaftOpacity = THREE.MathUtils.lerp(k1.shaftOpacity, k2.shaftOpacity, smoothT);
  const shaftColor = new THREE.Color(k1.shaftColor).lerp(new THREE.Color(k2.shaftColor), smoothT);

  // Determine closest preset
  let closestPreset: TimeOfDayPreset = 'day';
  if (h >= 5.5 && h < 10.5) closestPreset = 'dawn';
  else if (h >= 10.5 && h < 16.5) closestPreset = 'day';
  else if (h >= 16.5 && h < 20.0) closestPreset = 'sunset';
  else closestPreset = 'night';

  // Format time string e.g. "08:45 AM"
  const totalMinutes = Math.floor(h * 60);
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const timeFormatted = `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;

  return {
    topColor,
    horizonColor,
    bottomColor,
    sunColor,
    sunPos,
    sunIntensity,
    starsOpacity,
    ambientColor,
    ambientIntensity,
    mainLightColor,
    mainLightIntensity,
    windowLightColor,
    windowLightIntensity,
    sconceIntensity,
    stageSpotMultiplier,
    fogColor,
    fogDensity,
    shaftOpacity,
    shaftColor,
    closestPreset,
    timeFormatted,
  };
}
