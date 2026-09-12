import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sliders, Sun, Contrast, RefreshCw, Droplets, Check, Moon, Film, Palette, Sparkles } from 'lucide-react';
import { Layer, LayerFilter } from '../types';
import {
  cloneCanvas,
  applyGaussianBlurToCanvas,
  applyGrayscaleToCanvas,
  applySepiaToCanvas,
  applyHueSaturationToCanvas,
  applyHueToCanvas,
  applySaturationToCanvas,
  getAverageSaturation,
  applyNoiseToCanvas,
  getGaussianPerformanceStrategy,
  createGaussianKernel,
} from '../utils/canvasUtils';

interface AdjustmentsPanelProps {
  activeLayer?: Layer;
  onUpdateFilters: (filters: LayerFilter) => void;
  onUpdateLayerCanvas?: (canvas: HTMLCanvasElement, commit: boolean, label?: string) => void;
}

const DEFAULT_FILTERS: LayerFilter = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  blur: 0,
  invert: false,
};

const GAUSSIAN_BLUR_PRESETS = [
  { label: '0px', radius: 0, desc: 'Off' },
  { label: '2px', radius: 2, desc: 'Soft' },
  { label: '6px', radius: 6, desc: 'Med' },
  { label: '15px', radius: 15, desc: 'Strong' },
  { label: '25px', radius: 25, desc: 'Max' },
];

const GRAYSCALE_PRESETS = [
  { label: '0%', amount: 0, desc: 'Color' },
  { label: '25%', amount: 25, desc: 'Subtle' },
  { label: '50%', amount: 50, desc: 'Muted' },
  { label: '75%', amount: 75, desc: 'Deep' },
  { label: '100%', amount: 100, desc: 'B&W' },
];

const SEPIA_PRESETS = [
  { label: '0%', amount: 0, desc: 'Color' },
  { label: '25%', amount: 25, desc: 'Subtle' },
  { label: '50%', amount: 50, desc: 'Warm' },
  { label: '75%', amount: 75, desc: 'Rich' },
  { label: '100%', amount: 100, desc: 'Sepia' },
];

const SATURATION_PRESETS = [
  { label: 'Grayscale', sat: -100, desc: '-100% Mono' },
  { label: 'Muted', sat: -50, desc: '-50% Pastel' },
  { label: 'Natural', sat: 0, desc: 'Original' },
  { label: 'Enhanced', sat: 25, desc: '+25% Boost' },
  { label: 'Vivid', sat: 50, desc: '+50% Rich' },
  { label: 'Max Chroma', sat: 100, desc: '+100% (2×)' },
];

const HUE_PRESETS = [
  { label: 'Normal', hue: 0, desc: '0° Normal' },
  { label: 'Amber', hue: 35, desc: '+35° Warm' },
  { label: 'Gold', hue: 60, desc: '+60° Warm' },
  { label: 'Emerald', hue: 120, desc: '+120° Green' },
  { label: 'Cyan', hue: -60, desc: '-60° Cool' },
  { label: 'Azure', hue: -120, desc: '-120° Blue' },
  { label: 'Invert 180°', hue: 180, desc: '180° Complement' },
];

const HUE_SAT_PRESETS = [
  { label: 'Normal', hue: 0, sat: 0, desc: 'Original' },
  { label: 'Vibrant', hue: 0, sat: 45, desc: '+45% Sat' },
  { label: 'Desaturate', hue: 0, sat: -60, desc: '-60% Sat' },
  { label: 'Warm Glow', hue: 20, sat: 35, desc: '+20° / +35%' },
  { label: 'Cool Cyan', hue: -35, sat: 30, desc: '-35° / +30%' },
  { label: 'Neon Chroma', hue: 65, sat: 65, desc: '+65° / +65%' },
];

const NOISE_PRESETS = [
  { label: '0%', intensity: 0, desc: 'Off' },
  { label: '10%', intensity: 10, desc: 'Subtle' },
  { label: '25%', intensity: 25, desc: 'Med' },
  { label: '50%', intensity: 50, desc: 'Grain' },
  { label: '80%', intensity: 80, desc: 'Heavy' },
];

export const AdjustmentsPanel: React.FC<AdjustmentsPanelProps> = ({
  activeLayer,
  onUpdateFilters,
  onUpdateLayerCanvas,
}) => {
  const filters: LayerFilter = activeLayer?.filters || DEFAULT_FILTERS;

  // Effects state
  const [blurRadius, setBlurRadius] = useState<number>(0);
  const [grayscaleAmount, setGrayscaleAmount] = useState<number>(0);
  const [sepiaAmount, setSepiaAmount] = useState<number>(0);
  const [hueShift, setHueShift] = useState<number>(0); // -180 to 180 degrees
  const [satScale, setSatScale] = useState<number>(0); // -100 to 100 percent
  const [lightnessShift, setLightnessShift] = useState<number>(0); // -100 to 100 percent
  const [noiseIntensity, setNoiseIntensity] = useState<number>(0); // 0 to 100 percent
  const [noiseMonochromatic, setNoiseMonochromatic] = useState<boolean>(false);
  const [layerAvgSat, setLayerAvgSat] = useState<number>(0);

  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeLayerIdRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);

  // Measure average saturation of active layer canvas
  useEffect(() => {
    if (activeLayer?.canvas) {
      setLayerAvgSat(getAverageSaturation(activeLayer.canvas));
    }
  }, [activeLayer?.id, activeLayer?.canvas]);

  // Sync original canvas baseline when active layer changes or on clean state
  useEffect(() => {
    if (!activeLayer) {
      originalCanvasRef.current = null;
      activeLayerIdRef.current = null;
      setBlurRadius(0);
      setGrayscaleAmount(0);
      setSepiaAmount(0);
      setHueShift(0);
      setSatScale(0);
      setLightnessShift(0);
      setNoiseIntensity(0);
      setNoiseMonochromatic(false);
      return;
    }

    if (activeLayerIdRef.current !== activeLayer.id) {
      activeLayerIdRef.current = activeLayer.id;
      originalCanvasRef.current = cloneCanvas(activeLayer.canvas);
      setBlurRadius(0);
      setGrayscaleAmount(0);
      setSepiaAmount(0);
      setHueShift(0);
      setSatScale(0);
      setLightnessShift(0);
      setNoiseIntensity(0);
      setNoiseMonochromatic(false);
    } else if (
      blurRadius === 0 &&
      grayscaleAmount === 0 &&
      sepiaAmount === 0 &&
      hueShift === 0 &&
      satScale === 0 &&
      lightnessShift === 0 &&
      noiseIntensity === 0
    ) {
      originalCanvasRef.current = cloneCanvas(activeLayer.canvas);
    }
  }, [
    activeLayer?.id,
    activeLayer?.canvas,
    blurRadius,
    grayscaleAmount,
    sepiaAmount,
    hueShift,
    satScale,
    lightnessShift,
    noiseIntensity,
  ]);

  // Unified pipeline to apply Blur, Grayscale, Sepia, Hue/Saturation, and Noise to active layer canvas
  const applyPipelineEffects = useCallback(
    (
      radius: number,
      grayPct: number,
      sepiaPct: number,
      hueRot: number,
      satPct: number,
      lightPct: number = 0,
      commit: boolean = false,
      customLabel?: string,
      noisePct: number = noiseIntensity,
      noiseMono: boolean = noiseMonochromatic
    ) => {
      if (!activeLayer || !originalCanvasRef.current) return;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      const computeCanvas = () => {
        if (!originalCanvasRef.current) return null;
        let canvas = originalCanvasRef.current;
        if (radius > 0) {
          canvas = applyGaussianBlurToCanvas(canvas, radius);
        }
        if (grayPct > 0) {
          canvas = applyGrayscaleToCanvas(canvas, grayPct / 100);
        }
        if (sepiaPct > 0) {
          canvas = applySepiaToCanvas(canvas, sepiaPct / 100);
        }
        if (hueRot !== 0 || satPct !== 0 || lightPct !== 0) {
          canvas = applyHueSaturationToCanvas(canvas, hueRot, satPct, lightPct);
        }
        if (noisePct > 0) {
          canvas = applyNoiseToCanvas(canvas, noisePct, noiseMono);
        }
        if (
          radius === 0 &&
          grayPct === 0 &&
          sepiaPct === 0 &&
          hueRot === 0 &&
          satPct === 0 &&
          lightPct === 0 &&
          noisePct === 0
        ) {
          canvas = cloneCanvas(originalCanvasRef.current);
        }
        return canvas;
      };

      if (commit) {
        const targetCanvas = computeCanvas();
        if (!targetCanvas) return;

        let label = customLabel;
        if (!label) {
          const parts: string[] = [];
          if (noisePct > 0) {
            parts.push(`Add Noise (${Math.round(noisePct)}%${noiseMono ? ' Mono' : ''})`);
          }
          if (hueRot !== 0 && satPct === 0 && lightPct === 0) {
            parts.push(`Hue Shift (${hueRot > 0 ? '+' : ''}${Math.round(hueRot)}°)`);
          } else if (satPct !== 0 && hueRot === 0 && lightPct === 0) {
            parts.push(
              satPct === -100
                ? 'Desaturate (-100% HSL)'
                : `Saturation (${satPct > 0 ? '+' : ''}${Math.round(satPct)}%)`
            );
          } else if (hueRot !== 0 || satPct !== 0 || lightPct !== 0) {
            const sub: string[] = [];
            if (hueRot !== 0) sub.push(`Hue ${hueRot > 0 ? '+' : ''}${hueRot}°`);
            if (satPct !== 0) sub.push(`Sat ${satPct > 0 ? '+' : ''}${satPct}%`);
            if (lightPct !== 0) sub.push(`Light ${lightPct > 0 ? '+' : ''}${lightPct}%`);
            parts.push(`Hue/Sat (${sub.join(', ')})`);
          }
          if (sepiaPct > 0) {
            parts.push(sepiaPct >= 99.9 ? 'Sepia Tone' : `Sepia (${Math.round(sepiaPct)}%)`);
          }
          if (grayPct > 0) {
            parts.push(
              grayPct >= 99.9 ? 'Grayscale (B&W)' : `Grayscale (${Math.round(grayPct)}%)`
            );
          }
          if (radius > 0) {
            parts.push(`Gaussian Blur (${radius}px)`);
          }

          label = parts.length > 0 ? parts.join(' + ') : 'Reset Layer Effects';
        }

        onUpdateLayerCanvas?.(targetCanvas, true, label);
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        const targetCanvas = computeCanvas();
        if (targetCanvas) {
          onUpdateLayerCanvas?.(targetCanvas, false);
        }
      });
    },
    [activeLayer, onUpdateLayerCanvas, noiseIntensity, noiseMonochromatic]
  );

  // Gaussian Blur handlers
  const handleRadiusChange = (newRadius: number) => {
    const r = Math.max(0, Math.min(50, Math.round(newRadius * 2) / 2));
    setBlurRadius(r);
    applyPipelineEffects(r, grayscaleAmount, sepiaAmount, hueShift, satScale, lightnessShift, false);
  };

  const handleRadiusCommit = () => {
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      hueShift,
      satScale,
      lightnessShift,
      true,
      blurRadius === 0 ? 'Reset Gaussian Blur' : `Gaussian Blur (${blurRadius}px)`
    );
  };

  const handleBlurPresetSelect = (radius: number) => {
    setBlurRadius(radius);
    applyPipelineEffects(
      radius,
      grayscaleAmount,
      sepiaAmount,
      hueShift,
      satScale,
      lightnessShift,
      true,
      radius === 0 ? 'Reset Gaussian Blur' : `Gaussian Blur (${radius}px)`
    );
  };

  const handleResetBlur = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    setBlurRadius(0);
    applyPipelineEffects(0, grayscaleAmount, sepiaAmount, hueShift, satScale, lightnessShift, true, 'Reset Gaussian Blur');
  };

  const handleApplyBakeBlur = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    if (blurRadius > 0) {
      let intermediate = originalCanvasRef.current;
      if (grayscaleAmount > 0) {
        intermediate = applyGrayscaleToCanvas(intermediate, grayscaleAmount / 100);
      }
      if (sepiaAmount > 0) {
        intermediate = applySepiaToCanvas(intermediate, sepiaAmount / 100);
      }
      if (hueShift !== 0 || satScale !== 0 || lightnessShift !== 0) {
        intermediate = applyHueSaturationToCanvas(intermediate, hueShift, satScale, lightnessShift);
      }
      if (noiseIntensity > 0) {
        intermediate = applyNoiseToCanvas(intermediate, noiseIntensity, noiseMonochromatic);
      }
      const baked = applyGaussianBlurToCanvas(intermediate, blurRadius);
      originalCanvasRef.current = cloneCanvas(baked);
      onUpdateLayerCanvas?.(baked, true, `Apply Gaussian Blur (${blurRadius}px)`);
      setBlurRadius(0);
      if (grayscaleAmount > 0) setGrayscaleAmount(0);
      if (sepiaAmount > 0) setSepiaAmount(0);
      if (hueShift !== 0 || satScale !== 0 || lightnessShift !== 0) {
        setHueShift(0);
        setSatScale(0);
        setLightnessShift(0);
      }
      if (noiseIntensity > 0) setNoiseIntensity(0);
    }
  };

  // Grayscale (Luminance) handlers
  const handleGrayscaleChange = (newAmount: number) => {
    const g = Math.max(0, Math.min(100, Math.round(newAmount)));
    setGrayscaleAmount(g);
    applyPipelineEffects(blurRadius, g, sepiaAmount, hueShift, satScale, lightnessShift, false);
  };

  const handleGrayscaleCommit = () => {
    applyPipelineEffects(blurRadius, grayscaleAmount, sepiaAmount, hueShift, satScale, lightnessShift, true);
  };

  const handleGrayscalePresetSelect = (amount: number) => {
    setGrayscaleAmount(amount);
    applyPipelineEffects(
      blurRadius,
      amount,
      sepiaAmount,
      hueShift,
      satScale,
      lightnessShift,
      true,
      amount === 100
        ? 'Grayscale (Luminance B&W)'
        : amount === 0
        ? 'Reset Grayscale'
        : `Grayscale (${amount}%)`
    );
  };

  const handleConvertFullGrayscale = () => {
    setGrayscaleAmount(100);
    applyPipelineEffects(blurRadius, 100, sepiaAmount, hueShift, satScale, lightnessShift, true, 'Grayscale (Luminance B&W)');
  };

  const handleResetGrayscale = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    setGrayscaleAmount(0);
    applyPipelineEffects(blurRadius, 0, sepiaAmount, hueShift, satScale, lightnessShift, true, 'Reset Grayscale to Color');
  };

  const handleApplyBakeGrayscale = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    if (grayscaleAmount > 0) {
      let intermediate = originalCanvasRef.current;
      if (blurRadius > 0) {
        intermediate = applyGaussianBlurToCanvas(intermediate, blurRadius);
      }
      if (sepiaAmount > 0) {
        intermediate = applySepiaToCanvas(intermediate, sepiaAmount / 100);
      }
      if (hueShift !== 0 || satScale !== 0 || lightnessShift !== 0) {
        intermediate = applyHueSaturationToCanvas(intermediate, hueShift, satScale, lightnessShift);
      }
      if (noiseIntensity > 0) {
        intermediate = applyNoiseToCanvas(intermediate, noiseIntensity, noiseMonochromatic);
      }
      const baked = applyGrayscaleToCanvas(intermediate, grayscaleAmount / 100);
      originalCanvasRef.current = cloneCanvas(baked);
      onUpdateLayerCanvas?.(baked, true, `Bake Grayscale (${grayscaleAmount}%) into Layer`);
      setGrayscaleAmount(0);
      if (blurRadius > 0) setBlurRadius(0);
      if (sepiaAmount > 0) setSepiaAmount(0);
      if (hueShift !== 0 || satScale !== 0 || lightnessShift !== 0) {
        setHueShift(0);
        setSatScale(0);
        setLightnessShift(0);
      }
      if (noiseIntensity > 0) setNoiseIntensity(0);
    }
  };

  // Sepia handlers
  const handleSepiaChange = (newAmount: number) => {
    const s = Math.max(0, Math.min(100, Math.round(newAmount)));
    setSepiaAmount(s);
    applyPipelineEffects(blurRadius, grayscaleAmount, s, hueShift, satScale, lightnessShift, false);
  };

  const handleSepiaCommit = () => {
    applyPipelineEffects(blurRadius, grayscaleAmount, sepiaAmount, hueShift, satScale, lightnessShift, true);
  };

  const handleSepiaPresetSelect = (amount: number) => {
    setSepiaAmount(amount);
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      amount,
      hueShift,
      satScale,
      lightnessShift,
      true,
      amount === 100
        ? 'Sepia Tone (100%)'
        : amount === 0
        ? 'Reset Sepia'
        : `Sepia (${amount}%)`
    );
  };

  const handleConvertFullSepia = () => {
    setSepiaAmount(100);
    applyPipelineEffects(blurRadius, grayscaleAmount, 100, hueShift, satScale, lightnessShift, true, 'Sepia Tone');
  };

  const handleResetSepia = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    setSepiaAmount(0);
    applyPipelineEffects(blurRadius, grayscaleAmount, 0, hueShift, satScale, lightnessShift, true, 'Reset Sepia Tone');
  };

  const handleApplyBakeSepia = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    if (sepiaAmount > 0) {
      let intermediate = originalCanvasRef.current;
      if (blurRadius > 0) {
        intermediate = applyGaussianBlurToCanvas(intermediate, blurRadius);
      }
      if (grayscaleAmount > 0) {
        intermediate = applyGrayscaleToCanvas(intermediate, grayscaleAmount / 100);
      }
      if (hueShift !== 0 || satScale !== 0 || lightnessShift !== 0) {
        intermediate = applyHueSaturationToCanvas(intermediate, hueShift, satScale, lightnessShift);
      }
      if (noiseIntensity > 0) {
        intermediate = applyNoiseToCanvas(intermediate, noiseIntensity, noiseMonochromatic);
      }
      const baked = applySepiaToCanvas(intermediate, sepiaAmount / 100);
      originalCanvasRef.current = cloneCanvas(baked);
      onUpdateLayerCanvas?.(baked, true, `Bake Sepia (${sepiaAmount}%) into Layer`);
      setSepiaAmount(0);
      if (blurRadius > 0) setBlurRadius(0);
      if (grayscaleAmount > 0) setGrayscaleAmount(0);
      if (hueShift !== 0 || satScale !== 0 || lightnessShift !== 0) {
        setHueShift(0);
        setSatScale(0);
        setLightnessShift(0);
      }
      if (noiseIntensity > 0) setNoiseIntensity(0);
    }
  };

  // Hue / Saturation (HSL) handlers
  const handleHueChange = (val: number) => {
    const h = Math.max(-180, Math.min(180, Math.round(val)));
    setHueShift(h);
    applyPipelineEffects(blurRadius, grayscaleAmount, sepiaAmount, h, satScale, lightnessShift, false);
  };

  const handleHueCommit = () => {
    const label =
      hueShift === 0
        ? 'Reset Hue'
        : `Hue Shift (${hueShift > 0 ? '+' : ''}${hueShift}°)`;
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      hueShift,
      satScale,
      lightnessShift,
      true,
      label
    );
  };

  const handleHuePresetSelect = (preset: { label: string; hue: number; desc: string }) => {
    setHueShift(preset.hue);
    const label =
      preset.hue === 0
        ? 'Reset Hue'
        : `Hue Shift (${preset.hue > 0 ? '+' : ''}${preset.hue}°)`;
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      preset.hue,
      satScale,
      lightnessShift,
      true,
      label
    );
  };

  const handleResetHue = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    setHueShift(0);
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      0,
      satScale,
      lightnessShift,
      true,
      'Reset Hue'
    );
  };

  const handleApplyBakeHue = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    if (hueShift !== 0) {
      let intermediate = originalCanvasRef.current;
      if (blurRadius > 0) {
        intermediate = applyGaussianBlurToCanvas(intermediate, blurRadius);
      }
      if (grayscaleAmount > 0) {
        intermediate = applyGrayscaleToCanvas(intermediate, grayscaleAmount / 100);
      }
      if (sepiaAmount > 0) {
        intermediate = applySepiaToCanvas(intermediate, sepiaAmount / 100);
      }
      if (satScale !== 0 || lightnessShift !== 0) {
        intermediate = applyHueSaturationToCanvas(intermediate, 0, satScale, lightnessShift);
      }
      if (noiseIntensity > 0) {
        intermediate = applyNoiseToCanvas(intermediate, noiseIntensity, noiseMonochromatic);
      }
      const baked = applyHueToCanvas(intermediate, hueShift);
      originalCanvasRef.current = cloneCanvas(baked);
      onUpdateLayerCanvas?.(baked, true, `Bake Hue Shift (${hueShift > 0 ? '+' : ''}${hueShift}°) into Layer`);
      setHueShift(0);
    }
  };

  const handleSatChange = (val: number) => {
    const s = Math.max(-100, Math.min(100, Math.round(val)));
    setSatScale(s);
    applyPipelineEffects(blurRadius, grayscaleAmount, sepiaAmount, hueShift, s, lightnessShift, false);
  };

  const handleSatCommit = () => {
    const label =
      satScale === 0
        ? 'Reset Saturation'
        : satScale === -100
        ? 'Desaturate (-100% HSL)'
        : `Saturation (${satScale > 0 ? '+' : ''}${satScale}%)`;
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      hueShift,
      satScale,
      lightnessShift,
      true,
      label
    );
  };

  const handleSatPresetSelect = (preset: { label: string; sat: number; desc: string }) => {
    setSatScale(preset.sat);
    const label =
      preset.sat === 0
        ? 'Reset Saturation'
        : preset.sat === -100
        ? 'Desaturate (-100% HSL)'
        : `Saturation: ${preset.label} (${preset.sat > 0 ? '+' : ''}${preset.sat}%)`;
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      hueShift,
      preset.sat,
      lightnessShift,
      true,
      label
    );
  };

  const handleResetSaturation = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    setSatScale(0);
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      hueShift,
      0,
      lightnessShift,
      true,
      'Reset Saturation'
    );
  };

  const handleConvertFullDesaturate = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    setSatScale(-100);
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      hueShift,
      -100,
      lightnessShift,
      true,
      'Desaturate (-100% HSL)'
    );
  };

  const handleApplyBakeSaturation = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    if (satScale !== 0) {
      let intermediate = originalCanvasRef.current;
      if (blurRadius > 0) {
        intermediate = applyGaussianBlurToCanvas(intermediate, blurRadius);
      }
      if (grayscaleAmount > 0) {
        intermediate = applyGrayscaleToCanvas(intermediate, grayscaleAmount / 100);
      }
      if (sepiaAmount > 0) {
        intermediate = applySepiaToCanvas(intermediate, sepiaAmount / 100);
      }
      if (hueShift !== 0 || lightnessShift !== 0) {
        intermediate = applyHueSaturationToCanvas(intermediate, hueShift, 0, lightnessShift);
      }
      if (noiseIntensity > 0) {
        intermediate = applyNoiseToCanvas(intermediate, noiseIntensity, noiseMonochromatic);
      }
      const baked = applySaturationToCanvas(intermediate, satScale);
      originalCanvasRef.current = cloneCanvas(baked);
      onUpdateLayerCanvas?.(
        baked,
        true,
        `Bake Saturation (${satScale > 0 ? '+' : ''}${satScale}%) into Layer`
      );
      setSatScale(0);
      if (blurRadius > 0) setBlurRadius(0);
      if (grayscaleAmount > 0) setGrayscaleAmount(0);
      if (sepiaAmount > 0) setSepiaAmount(0);
      if (noiseIntensity > 0) setNoiseIntensity(0);
    }
  };

  const handleLightnessChange = (val: number) => {
    const l = Math.max(-100, Math.min(100, Math.round(val)));
    setLightnessShift(l);
    applyPipelineEffects(blurRadius, grayscaleAmount, sepiaAmount, hueShift, satScale, l, false);
  };

  const handleLightnessCommit = () => {
    applyPipelineEffects(blurRadius, grayscaleAmount, sepiaAmount, hueShift, satScale, lightnessShift, true);
  };

  const handleHueSatPresetSelect = (preset: { label: string; hue: number; sat: number; desc: string }) => {
    const h = preset.hue;
    const s = preset.sat;
    setHueShift(h);
    setSatScale(s);
    setLightnessShift(0);
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      h,
      s,
      0,
      true,
      preset.label === 'Normal' ? 'Reset Hue/Saturation' : `Hue/Sat: ${preset.label}`
    );
  };

  const handleResetHueSat = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    setHueShift(0);
    setSatScale(0);
    setLightnessShift(0);
    applyPipelineEffects(blurRadius, grayscaleAmount, sepiaAmount, 0, 0, 0, true, 'Reset Hue/Saturation');
  };

  const handleApplyBakeHueSat = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    if (hueShift !== 0 || satScale !== 0 || lightnessShift !== 0) {
      let intermediate = originalCanvasRef.current;
      if (blurRadius > 0) {
        intermediate = applyGaussianBlurToCanvas(intermediate, blurRadius);
      }
      if (grayscaleAmount > 0) {
        intermediate = applyGrayscaleToCanvas(intermediate, grayscaleAmount / 100);
      }
      if (sepiaAmount > 0) {
        intermediate = applySepiaToCanvas(intermediate, sepiaAmount / 100);
      }
      if (noiseIntensity > 0) {
        intermediate = applyNoiseToCanvas(intermediate, noiseIntensity, noiseMonochromatic);
      }
      const baked = applyHueSaturationToCanvas(intermediate, hueShift, satScale, lightnessShift);
      originalCanvasRef.current = cloneCanvas(baked);
      onUpdateLayerCanvas?.(
        baked,
        true,
        `Bake Hue/Sat (Hue: ${hueShift > 0 ? '+' : ''}${hueShift}°, Sat: ${satScale > 0 ? '+' : ''}${satScale}%) into Layer`
      );
      setHueShift(0);
      setSatScale(0);
      setLightnessShift(0);
      if (blurRadius > 0) setBlurRadius(0);
      if (grayscaleAmount > 0) setGrayscaleAmount(0);
      if (sepiaAmount > 0) setSepiaAmount(0);
      if (noiseIntensity > 0) setNoiseIntensity(0);
    }
  };

  // Add Noise handlers
  const handleNoiseChange = (newIntensity: number, mono = noiseMonochromatic) => {
    const val = Math.max(0, Math.min(100, Math.round(newIntensity)));
    setNoiseIntensity(val);
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      hueShift,
      satScale,
      lightnessShift,
      false,
      undefined,
      val,
      mono
    );
  };

  const handleNoiseCommit = () => {
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      hueShift,
      satScale,
      lightnessShift,
      true,
      undefined,
      noiseIntensity,
      noiseMonochromatic
    );
  };

  const handleNoisePresetSelect = (intensity: number) => {
    setNoiseIntensity(intensity);
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      hueShift,
      satScale,
      lightnessShift,
      true,
      intensity === 0
        ? 'Reset Noise'
        : `Add Noise (${intensity}%${noiseMonochromatic ? ' Mono' : ''})`,
      intensity,
      noiseMonochromatic
    );
  };

  const handleToggleMonochromatic = (mono: boolean) => {
    setNoiseMonochromatic(mono);
    if (noiseIntensity > 0) {
      applyPipelineEffects(
        blurRadius,
        grayscaleAmount,
        sepiaAmount,
        hueShift,
        satScale,
        lightnessShift,
        true,
        `Add Noise (${noiseIntensity}%${mono ? ' Mono' : ' Color'})`,
        noiseIntensity,
        mono
      );
    }
  };

  const handleResetNoise = () => {
    if (!activeLayer || !originalCanvasRef.current) return;
    setNoiseIntensity(0);
    applyPipelineEffects(
      blurRadius,
      grayscaleAmount,
      sepiaAmount,
      hueShift,
      satScale,
      lightnessShift,
      true,
      'Reset Noise Filter',
      0,
      noiseMonochromatic
    );
  };

  const handleApplyBakeNoise = () => {
    if (!activeLayer || !originalCanvasRef.current || noiseIntensity <= 0) return;
    let intermediate = originalCanvasRef.current;
    if (blurRadius > 0) {
      intermediate = applyGaussianBlurToCanvas(intermediate, blurRadius);
    }
    if (grayscaleAmount > 0) {
      intermediate = applyGrayscaleToCanvas(intermediate, grayscaleAmount / 100);
    }
    if (sepiaAmount > 0) {
      intermediate = applySepiaToCanvas(intermediate, sepiaAmount / 100);
    }
    if (hueShift !== 0 || satScale !== 0 || lightnessShift !== 0) {
      intermediate = applyHueSaturationToCanvas(intermediate, hueShift, satScale, lightnessShift);
    }
    const baked = applyNoiseToCanvas(intermediate, noiseIntensity, noiseMonochromatic);
    originalCanvasRef.current = cloneCanvas(baked);
    onUpdateLayerCanvas?.(
      baked,
      true,
      `Add Noise (${noiseIntensity}%${noiseMonochromatic ? ' Monochromatic' : ''})`
    );
    setNoiseIntensity(0);
    if (blurRadius > 0) setBlurRadius(0);
    if (grayscaleAmount > 0) setGrayscaleAmount(0);
    if (sepiaAmount > 0) setSepiaAmount(0);
    if (hueShift !== 0 || satScale !== 0 || lightnessShift !== 0) {
      setHueShift(0);
      setSatScale(0);
      setLightnessShift(0);
    }
  };

  // Standard CSS Filter adjustments
  const handleChange = (key: keyof LayerFilter, value: any) => {
    onUpdateFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleResetAll = () => {
    onUpdateFilters({ ...DEFAULT_FILTERS });
    if (!activeLayer || !originalCanvasRef.current) return;
    setBlurRadius(0);
    setGrayscaleAmount(0);
    setSepiaAmount(0);
    setHueShift(0);
    setSatScale(0);
    setLightnessShift(0);
    setNoiseIntensity(0);
    setNoiseMonochromatic(false);
    const pristine = cloneCanvas(originalCanvasRef.current);
    onUpdateLayerCanvas?.(pristine, true, 'Reset All Adjustments');
  };

  const applyPreset = (preset: 'bw' | 'sepia' | 'cyberpunk' | 'vibrant') => {
    if (preset === 'bw') {
      handleConvertFullGrayscale();
    } else if (preset === 'sepia') {
      handleConvertFullSepia();
    } else if (preset === 'cyberpunk') {
      onUpdateFilters({ ...filters, saturation: 50, contrast: 30, hue: -40 });
    } else if (preset === 'vibrant') {
      onUpdateFilters({ ...filters, saturation: 40, contrast: 15, brightness: 5 });
    }
  };

  const blurStrategy =
    activeLayer?.canvas && blurRadius > 0
      ? getGaussianPerformanceStrategy(
          activeLayer.canvas.width,
          activeLayer.canvas.height,
          blurRadius
        )
      : null;
  const blurKernel = blurStrategy
    ? createGaussianKernel(blurStrategy.effectiveRadius)
    : null;

  return (
    <div
      id="adjustments-panel"
      className="flex flex-col h-full bg-[#2b2b2b] text-xs text-gray-300 select-none overflow-y-auto p-2.5 space-y-3"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-black pb-1.5">
        <span className="flex items-center gap-1.5 font-medium text-gray-300 text-[11px]">
          <Sliders className="h-3 w-3 text-cyan-400" />
          Layer Adjustments
        </span>
        <button
          id="btn-reset-all-adjustments"
          onClick={handleResetAll}
          title="Reset all adjustments, sepia, grayscale, and blur to default"
          className="flex items-center gap-1 rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-1.5 py-0.5 text-[10px] text-gray-300 cursor-pointer transition-colors"
        >
          <RefreshCw className="h-2.5 w-2.5" /> Reset All
        </button>
      </div>

      {!activeLayer && (
        <div className="text-gray-500 text-center py-6 text-[11px]">
          Select a layer to adjust properties.
        </div>
      )}

      {activeLayer && (
        <>
          {/* Dedicated Saturation Adjustment Filter Section */}
          <div
            id="saturation-filter-card"
            className="rounded border border-black bg-[#232323] p-2.5 space-y-2.5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-pink-300 text-[11px]">
                <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                <span>Saturation (HSL Filter)</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  id="badge-saturation-status"
                  className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                    satScale !== 0
                      ? satScale > 0
                        ? 'bg-pink-950/80 border-pink-700/80 text-pink-300'
                        : 'bg-neutral-800 border-neutral-600 text-neutral-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}
                >
                  {satScale !== 0
                    ? `${satScale > 0 ? '+' : ''}${satScale}% ${satScale > 0 ? 'Vivid' : 'Muted'}`
                    : 'Natural (0%)'}
                </span>
                {satScale !== 0 && (
                  <button
                    id="btn-reset-saturation"
                    onClick={handleResetSaturation}
                    title="Reset saturation to 0% natural baseline"
                    className="flex items-center gap-0.5 rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-gray-200 cursor-pointer"
                  >
                    <RefreshCw className="h-2 w-2" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* HSL Mathematical Transformation Breakdown */}
            <div className="text-[8.5px] text-pink-200/90 bg-[#1f1418] px-2 py-1.5 rounded border border-pink-950/70 font-mono space-y-0.5">
              <div className="flex justify-between items-center text-gray-400 border-b border-pink-950/50 pb-0.5 mb-0.5">
                <span className="text-gray-400">HSL Pixel Calculation:</span>
                <span className="text-[8px] text-pink-300/90 font-mono">
                  Multiplier: {(1 + satScale / 100).toFixed(2)}×
                </span>
              </div>
              <div className="text-pink-300/90 tracking-tight leading-tight">
                RGB ➔ (H, S, L) ➔ S&apos; = clamp(S × (1 + Sat%), 0, 1) ➔ RGB&apos;
              </div>
              <div className="flex justify-between items-center text-[8px] text-gray-400 pt-0.5">
                <span>Active Layer Saturation:</span>
                <span className="text-pink-200 font-semibold">~{layerAvgSat}% Average Chroma</span>
              </div>
            </div>

            {/* Saturation Slider & Stepper Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <span>Saturation Level</span>
                </span>
                <div className="flex items-center gap-1">
                  <input
                    id="saturation-number-input"
                    data-testid="saturation-number-input"
                    type="number"
                    min="-100"
                    max="100"
                    step="1"
                    value={satScale}
                    onChange={(e) => handleSatChange(Number(e.target.value))}
                    onBlur={handleSatCommit}
                    className="w-14 rounded bg-[#141414] border border-black px-1.5 py-0.5 text-right font-mono text-[10px] text-pink-300 focus:border-pink-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-gray-500">%</span>
                </div>
              </div>

              {/* Slider with desaturated-to-vivid gradient track */}
              <input
                id="saturation-slider"
                data-testid="saturation-slider"
                type="range"
                min="-100"
                max="100"
                step="1"
                value={satScale}
                onChange={(e) => handleSatChange(Number(e.target.value))}
                onPointerUp={handleSatCommit}
                onTouchEnd={handleSatCommit}
                onKeyUp={handleSatCommit}
                style={{
                  background:
                    'linear-gradient(to right, #6b7280 0%, #9ca3af 25%, #60a5fa 50%, #ec4899 75%, #f43f5e 100%)',
                }}
                className="w-full h-2 cursor-pointer rounded appearance-none"
                title={`Saturation: ${satScale > 0 ? '+' : ''}${satScale}%`}
              />

              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>-100% (Mono)</span>
                <span>-50%</span>
                <span className={satScale === 0 ? 'text-pink-400 font-semibold' : ''}>0% (Natural)</span>
                <span>+50%</span>
                <span>+100% (2×)</span>
              </div>
            </div>

            {/* Quick Saturation Presets */}
            <div className="space-y-1">
              <span className="text-[9px] font-medium text-gray-400">Presets</span>
              <div className="grid grid-cols-3 gap-1">
                {SATURATION_PRESETS.map((p) => {
                  const isSelected = satScale === p.sat;
                  return (
                    <button
                      key={p.label}
                      id={`btn-preset-sat-${p.label.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => handleSatPresetSelect(p)}
                      className={`flex flex-col items-center justify-center py-1 px-1 rounded border text-[9.5px] transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-pink-900/60 border-pink-500 text-pink-200 font-semibold shadow-xs'
                          : 'bg-[#1a1a1a] border-black/80 text-gray-300 hover:bg-[#333] hover:text-white'
                      }`}
                      title={`${p.label} - ${p.desc}`}
                    >
                      <span className="leading-tight">{p.label}</span>
                      <span className="text-[8px] text-gray-400 font-mono">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1-Click Action & Bake Buttons */}
            <div className="flex gap-1 pt-0.5">
              {satScale > -100 && (
                <button
                  id="btn-convert-desaturate-full"
                  onClick={handleConvertFullDesaturate}
                  className="flex-1 flex items-center justify-center gap-1 rounded bg-[#2b2b2b] hover:bg-[#383838] border border-black px-2 py-1 text-[10px] font-medium text-gray-200 transition-colors cursor-pointer"
                  title="Directly desaturate layer to 100% monochrome grayscale via HSL calculation"
                >
                  <Moon className="h-3 w-3 text-gray-400" />
                  <span>Desaturate (Mono)</span>
                </button>
              )}

              {satScale !== 0 && (
                <button
                  id="btn-bake-saturation"
                  onClick={handleApplyBakeSaturation}
                  className="flex-1 flex items-center justify-center gap-1 rounded bg-pink-700/80 hover:bg-pink-600 border border-pink-500/80 px-2 py-1 text-[10px] font-medium text-white transition-colors cursor-pointer shadow-xs"
                  title="Permanently bake HSL saturation pixel calculation into layer canvas"
                >
                  <Check className="h-3 w-3" />
                  <span>Bake Saturation</span>
                </button>
              )}
            </div>
          </div>

          {/* Dedicated Hue Adjustment (Color Shift) Section */}
          <div
            id="hue-adjustment-card"
            data-testid="hue-adjustment-card"
            className="rounded border border-black bg-[#232323] p-2.5 space-y-2.5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-violet-300 text-[11px]">
                <Palette className="h-3.5 w-3.5 text-violet-400" />
                <span>Hue Adjustment (Color Shift)</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  id="badge-hue-status"
                  className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                    hueShift !== 0
                      ? 'bg-violet-950/80 border-violet-700/80 text-violet-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}
                >
                  {hueShift !== 0 ? `${hueShift > 0 ? '+' : ''}${hueShift}° Shift` : 'Normal (0°)'}
                </span>
                {hueShift !== 0 && (
                  <button
                    id="btn-reset-hue"
                    onClick={handleResetHue}
                    title="Reset hue channel back to 0° normal rotation"
                    className="flex items-center gap-0.5 rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-gray-200 cursor-pointer"
                  >
                    <RefreshCw className="h-2 w-2" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* HSL Mathematical Transformation Breakdown */}
            <div className="text-[8.5px] text-violet-200/90 bg-[#191524] px-2 py-1.5 rounded border border-violet-950/70 font-mono space-y-0.5">
              <div className="flex justify-between items-center text-gray-400 border-b border-violet-950/50 pb-0.5 mb-0.5">
                <span className="text-gray-400">HSL Hue Channel Shift:</span>
                <span className="text-[8px] text-violet-300/90 font-mono">
                  ΔHue: {hueShift > 0 ? '+' : ''}{hueShift}°
                </span>
              </div>
              <div className="text-violet-300/90 tracking-tight leading-tight">
                RGB ➔ (H, S, L) ➔ H&apos; = (H + ΔHue + 360°) mod 360° ➔ RGB&apos;
              </div>
              <div className="flex justify-between items-center text-[8px] text-gray-400 pt-0.5">
                <span>Active Layer Operation:</span>
                <span className="text-violet-200 font-semibold">Per-pixel color-shifting in HSL space</span>
              </div>
            </div>

            {/* Hue Slider & Stepper Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 inline-block" />
                  <span>Hue Channel Rotation</span>
                </span>
                <div className="flex items-center gap-1">
                  <input
                    id="hue-shift-number-input"
                    data-testid="hue-shift-number-input"
                    type="number"
                    min="-180"
                    max="180"
                    step="1"
                    value={hueShift}
                    onChange={(e) => handleHueChange(Number(e.target.value))}
                    onBlur={handleHueCommit}
                    className="w-14 rounded bg-[#141414] border border-black px-1.5 py-0.5 text-right font-mono text-[10px] text-violet-300 focus:border-violet-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-gray-500">°</span>
                </div>
              </div>

              {/* Slider with full spectrum rainbow track */}
              <input
                id="hue-shift-slider"
                data-testid="hue-shift-slider"
                type="range"
                min="-180"
                max="180"
                step="1"
                value={hueShift}
                onChange={(e) => handleHueChange(Number(e.target.value))}
                onPointerUp={handleHueCommit}
                onTouchEnd={handleHueCommit}
                onKeyUp={handleHueCommit}
                style={{
                  background:
                    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                }}
                className="w-full h-2 cursor-pointer rounded appearance-none"
                title={`Hue: ${hueShift > 0 ? '+' : ''}${hueShift}°`}
              />

              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>-180°</span>
                <span>-90°</span>
                <span className={hueShift === 0 ? 'text-violet-400 font-semibold' : ''}>0° (Normal)</span>
                <span>+90°</span>
                <span>+180°</span>
              </div>
            </div>

            {/* Quick Hue Presets */}
            <div className="space-y-1">
              <span className="text-[9px] font-medium text-gray-400">Hue Presets</span>
              <div className="grid grid-cols-4 gap-1">
                {HUE_PRESETS.map((p) => {
                  const isSelected = hueShift === p.hue;
                  return (
                    <button
                      key={p.label}
                      id={`btn-preset-hue-${p.label.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => handleHuePresetSelect(p)}
                      className={`flex flex-col items-center justify-center py-1 px-1 rounded border text-[9.5px] transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-violet-900/60 border-violet-500 text-violet-200 font-semibold shadow-xs'
                          : 'bg-[#1a1a1a] border-black/80 text-gray-300 hover:bg-[#333] hover:text-white'
                      }`}
                      title={`${p.label} - ${p.desc}`}
                    >
                      <span className="leading-tight">{p.label}</span>
                      <span className="text-[8px] text-gray-400 font-mono">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hue Bake Button */}
            {hueShift !== 0 && (
              <div className="pt-0.5">
                <button
                  id="btn-bake-hue"
                  onClick={handleApplyBakeHue}
                  className="w-full flex items-center justify-center gap-1 rounded bg-violet-700/80 hover:bg-violet-600 border border-violet-500/80 px-2 py-1 text-[10px] font-medium text-white transition-colors cursor-pointer shadow-xs"
                  title="Permanently bake HSL hue channel shift into layer canvas buffer"
                >
                  <Check className="h-3 w-3" />
                  <span>Bake Hue Shift into Layer</span>
                </button>
              </div>
            )}
          </div>

          {/* Lightness Offset Section */}
          <div
            id="lightness-filter-card"
            className="rounded border border-black bg-[#232323] p-2.5 space-y-2.5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-emerald-300 text-[11px]">
                <Sun className="h-3.5 w-3.5 text-emerald-400" />
                <span>Lightness Offset</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  id="badge-lightness-status"
                  className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                    lightnessShift !== 0
                      ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}
                >
                  {lightnessShift !== 0 ? `${lightnessShift > 0 ? '+' : ''}${lightnessShift}%` : 'Default (0%)'}
                </span>
                {lightnessShift !== 0 && (
                  <button
                    id="btn-reset-lightness"
                    onClick={() => {
                      setLightnessShift(0);
                      applyPipelineEffects(blurRadius, grayscaleAmount, sepiaAmount, hueShift, satScale, 0, true, 'Reset Lightness');
                    }}
                    title="Reset lightness offset back to 0%"
                    className="flex items-center gap-0.5 rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-gray-200 cursor-pointer"
                  >
                    <RefreshCw className="h-2 w-2" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Lightness Shift Slider & Numeric Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>Lightness Offset</span>
                <div className="flex items-center gap-1">
                  <input
                    id="lightness-shift-number-input"
                    type="number"
                    min="-100"
                    max="100"
                    step="1"
                    value={lightnessShift}
                    onChange={(e) => handleLightnessChange(Number(e.target.value))}
                    onBlur={handleLightnessCommit}
                    className="w-14 rounded bg-[#141414] border border-black px-1.5 py-0.5 text-right font-mono text-[10px] text-emerald-300 focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-gray-500">%</span>
                </div>
              </div>

              <input
                id="lightness-shift-slider"
                type="range"
                min="-100"
                max="100"
                step="1"
                value={lightnessShift}
                onChange={(e) => handleLightnessChange(Number(e.target.value))}
                onPointerUp={handleLightnessCommit}
                onTouchEnd={handleLightnessCommit}
                onKeyUp={handleLightnessCommit}
                className="w-full h-1.5 cursor-pointer accent-emerald-400 bg-[#161616] rounded appearance-none"
                title={`Lightness: ${lightnessShift > 0 ? '+' : ''}${lightnessShift}%`}
              />

              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>-100% (Dark)</span>
                <span className={lightnessShift === 0 ? 'text-emerald-400 font-semibold' : ''}>0%</span>
                <span>+100% (Light)</span>
              </div>
            </div>
          </div>

          {/* Sepia Filter (Pixel Transformation) Section */}
          <div
            id="sepia-filter-card"
            className="rounded border border-black bg-[#232323] p-2.5 space-y-2.5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-amber-200 text-[11px]">
                <Film className="h-3.5 w-3.5 text-amber-500" />
                <span>Sepia Tone</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  id="badge-sepia-status"
                  className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                    sepiaAmount > 0
                      ? 'bg-amber-950/80 border-amber-700/80 text-amber-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}
                >
                  {sepiaAmount > 0 ? `${sepiaAmount}% Sepia` : 'Off'}
                </span>
                {sepiaAmount > 0 && (
                  <button
                    id="btn-reset-sepia"
                    onClick={handleResetSepia}
                    title="Reset sepia to original colors"
                    className="flex items-center gap-0.5 rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-gray-200 cursor-pointer"
                  >
                    <RefreshCw className="h-2 w-2" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Formula Explanation Badge */}
            <div className="text-[8.5px] text-amber-300/85 bg-[#191815] px-2 py-1.5 rounded border border-amber-950/60 font-mono space-y-0.5">
              <div className="flex justify-between items-center text-gray-400 border-b border-amber-950/40 pb-0.5 mb-0.5">
                <span className="text-gray-400">Sepia Matrix:</span>
                <span className="text-[8px] text-amber-500/80">Pixel Transform</span>
              </div>
              <div className="text-amber-200/90 tracking-tight leading-tight">
                r = 0.393R + 0.769G + 0.189B
              </div>
              <div className="text-amber-200/90 tracking-tight leading-tight">
                g = 0.349R + 0.686G + 0.168B
              </div>
              <div className="text-amber-200/90 tracking-tight leading-tight">
                b = 0.272R + 0.534G + 0.131B
              </div>
            </div>

            {/* Sepia Intensity Slider & Numeric Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>Intensity / Amount</span>
                <div className="flex items-center gap-1">
                  <input
                    id="sepia-amount-number-input"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={sepiaAmount}
                    onChange={(e) => handleSepiaChange(Number(e.target.value))}
                    onBlur={handleSepiaCommit}
                    className="w-14 rounded bg-[#141414] border border-black px-1.5 py-0.5 text-right font-mono text-[10px] text-amber-200 focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-gray-500">%</span>
                </div>
              </div>

              <input
                id="sepia-amount-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={sepiaAmount}
                onChange={(e) => handleSepiaChange(Number(e.target.value))}
                onPointerUp={handleSepiaCommit}
                onTouchEnd={handleSepiaCommit}
                onKeyUp={handleSepiaCommit}
                className="w-full h-1.5 cursor-pointer accent-amber-500 bg-[#161616] rounded appearance-none"
                title={`Sepia: ${sepiaAmount}%`}
              />

              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>0% (Color)</span>
                <span>50%</span>
                <span>100% (Sepia)</span>
              </div>
            </div>

            {/* Quick Sepia Presets */}
            <div className="space-y-1">
              <span className="text-[9px] font-medium text-gray-400">Presets</span>
              <div className="grid grid-cols-5 gap-1">
                {SEPIA_PRESETS.map((p) => {
                  const isSelected = sepiaAmount === p.amount;
                  return (
                    <button
                      key={p.label}
                      id={`btn-preset-sepia-${p.amount}`}
                      onClick={() => handleSepiaPresetSelect(p.amount)}
                      className={`flex flex-col items-center justify-center rounded py-1 border text-[9px] transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-700 border-amber-500 text-white font-semibold'
                          : 'bg-[#181818] border-black text-gray-400 hover:bg-[#2e2e2e] hover:text-amber-200'
                      }`}
                      title={`${p.label} - ${p.desc}`}
                    >
                      <span>{p.label}</span>
                      <span className="text-[8px] opacity-70">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1-Click Action & Bake Buttons */}
            <div className="flex gap-1 pt-0.5">
              {sepiaAmount < 100 && (
                <button
                  id="btn-convert-sepia-full"
                  onClick={handleConvertFullSepia}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded bg-amber-800 hover:bg-amber-700 text-white font-medium py-1 px-2 text-[10px] shadow transition-colors cursor-pointer border border-amber-600/50"
                  title="Directly convert layer pixels to 100% Sepia using the transformation matrix"
                >
                  <Film className="h-3 w-3 text-amber-300" />
                  <span>Convert to Sepia (100%)</span>
                </button>
              )}

              {sepiaAmount > 0 && (
                <button
                  id="btn-bake-sepia"
                  onClick={handleApplyBakeSepia}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium py-1 px-2 text-[10px] shadow transition-colors cursor-pointer"
                  title="Permanently bake sepia transformation into this layer's canvas pixels"
                >
                  <Check className="h-3 w-3" />
                  <span>Bake into Layer</span>
                </button>
              )}
            </div>
          </div>

          {/* Grayscale (Luminance B&W) Section */}
          <div
            id="grayscale-filter-card"
            className="rounded border border-black bg-[#232323] p-2.5 space-y-2.5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-gray-200 text-[11px]">
                <Moon className="h-3.5 w-3.5 text-neutral-300" />
                <span>Grayscale (Luminance)</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  id="badge-grayscale-status"
                  className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                    grayscaleAmount > 0
                      ? 'bg-neutral-800 border-neutral-600 text-neutral-200'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}
                >
                  {grayscaleAmount > 0 ? `${grayscaleAmount}% B&W` : 'Off'}
                </span>
                {grayscaleAmount > 0 && (
                  <button
                    id="btn-reset-grayscale"
                    onClick={handleResetGrayscale}
                    title="Reset grayscale to original color"
                    className="flex items-center gap-0.5 rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-gray-200 cursor-pointer"
                  >
                    <RefreshCw className="h-2 w-2" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Formula Explanation Badge */}
            <div className="flex items-center justify-between text-[9px] text-gray-400 bg-[#191919] px-2 py-1 rounded border border-black/60 font-mono">
              <span className="text-gray-400">Formula:</span>
              <span className="text-cyan-300/90 tracking-tight">
                Y = 0.299R + 0.587G + 0.114B
              </span>
            </div>

            {/* Grayscale Intensity Slider & Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>Intensity / Amount</span>
                <div className="flex items-center gap-1">
                  <input
                    id="grayscale-amount-number-input"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={grayscaleAmount}
                    onChange={(e) => handleGrayscaleChange(Number(e.target.value))}
                    onBlur={handleGrayscaleCommit}
                    className="w-14 rounded bg-[#141414] border border-black px-1.5 py-0.5 text-right font-mono text-[10px] text-gray-200 focus:border-cyan-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-gray-500">%</span>
                </div>
              </div>

              <input
                id="grayscale-amount-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={grayscaleAmount}
                onChange={(e) => handleGrayscaleChange(Number(e.target.value))}
                onPointerUp={handleGrayscaleCommit}
                onTouchEnd={handleGrayscaleCommit}
                onKeyUp={handleGrayscaleCommit}
                className="w-full h-1.5 cursor-pointer accent-neutral-300 bg-[#161616] rounded appearance-none"
                title={`Grayscale: ${grayscaleAmount}%`}
              />

              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>0% (Color)</span>
                <span>50%</span>
                <span>100% (B&W)</span>
              </div>
            </div>

            {/* Quick Grayscale Presets */}
            <div className="space-y-1">
              <span className="text-[9px] font-medium text-gray-400">Presets</span>
              <div className="grid grid-cols-5 gap-1">
                {GRAYSCALE_PRESETS.map((p) => {
                  const isSelected = grayscaleAmount === p.amount;
                  return (
                    <button
                      key={p.label}
                      id={`btn-preset-grayscale-${p.amount}`}
                      onClick={() => handleGrayscalePresetSelect(p.amount)}
                      className={`flex flex-col items-center justify-center rounded py-1 border text-[9px] transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-600 border-neutral-400 text-white font-semibold'
                          : 'bg-[#181818] border-black text-gray-400 hover:bg-[#2e2e2e] hover:text-gray-200'
                      }`}
                      title={`${p.label} - ${p.desc}`}
                    >
                      <span>{p.label}</span>
                      <span className="text-[8px] opacity-70">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1-Click Action & Bake Buttons */}
            <div className="flex gap-1 pt-0.5">
              {grayscaleAmount < 100 && (
                <button
                  id="btn-convert-grayscale-full"
                  onClick={handleConvertFullGrayscale}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-1 px-2 text-[10px] shadow transition-colors cursor-pointer border border-neutral-500/50"
                  title="Directly convert layer pixels to 100% Black and White using the luminance formula"
                >
                  <Moon className="h-3 w-3 text-neutral-200" />
                  <span>Convert to B&W (100%)</span>
                </button>
              )}

              {grayscaleAmount > 0 && (
                <button
                  id="btn-bake-grayscale"
                  onClick={handleApplyBakeGrayscale}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded bg-cyan-700 hover:bg-cyan-600 text-white font-medium py-1 px-2 text-[10px] shadow transition-colors cursor-pointer"
                  title="Permanently bake grayscale luminance conversion into this layer's canvas pixels"
                >
                  <Check className="h-3 w-3" />
                  <span>Bake into Layer</span>
                </button>
              )}
            </div>
          </div>

          {/* Gaussian Blur Section */}
          <div
            id="gaussian-blur-filter-card"
            className="rounded border border-black bg-[#232323] p-2.5 space-y-2.5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-gray-200 text-[11px]">
                <Droplets className="h-3.5 w-3.5 text-blue-400" />
                <span>Gaussian Blur</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="rounded bg-blue-950/70 border border-blue-800/60 px-1.5 py-0.5 font-mono text-[10px] text-blue-300 font-semibold">
                  {blurRadius.toFixed(1)} px
                </span>
                {blurRadius > 0 && (
                  <button
                    id="btn-reset-gaussian-blur"
                    onClick={handleResetBlur}
                    title="Reset blur radius to 0"
                    className="flex items-center gap-0.5 rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-gray-200 cursor-pointer"
                  >
                    <RefreshCw className="h-2 w-2" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Radius Slider & Numeric Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>Blur Radius</span>
                <div className="flex items-center gap-1">
                  <input
                    id="gaussian-blur-radius-number-input"
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={blurRadius}
                    onChange={(e) => handleRadiusChange(Number(e.target.value))}
                    onBlur={handleRadiusCommit}
                    className="w-14 rounded bg-[#141414] border border-black px-1.5 py-0.5 text-right font-mono text-[10px] text-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-gray-500">px</span>
                </div>
              </div>

              <input
                id="gaussian-blur-radius-slider"
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={blurRadius}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                onPointerUp={handleRadiusCommit}
                onTouchEnd={handleRadiusCommit}
                onKeyUp={handleRadiusCommit}
                className="w-full h-1.5 cursor-pointer accent-blue-500 bg-[#161616] rounded appearance-none"
                title={`Gaussian Blur Radius: ${blurRadius}px`}
              />

              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>0px (Sharp)</span>
                <span>25px</span>
                <span>50px</span>
              </div>
            </div>

            {/* Quick Radius Presets */}
            <div className="space-y-1">
              <span className="text-[9px] font-medium text-gray-400">Radius Presets</span>
              <div className="grid grid-cols-5 gap-1">
                {GAUSSIAN_BLUR_PRESETS.map((p) => {
                  const isSelected = Math.abs(blurRadius - p.radius) < 0.1;
                  return (
                    <button
                      key={p.label}
                      id={`btn-preset-blur-${p.radius}`}
                      onClick={() => handleBlurPresetSelect(p.radius)}
                      className={`flex flex-col items-center justify-center rounded py-1 border text-[9px] transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 border-blue-400 text-white font-semibold'
                          : 'bg-[#181818] border-black text-gray-400 hover:bg-[#2e2e2e] hover:text-gray-200'
                      }`}
                      title={`${p.label} - ${p.desc}`}
                    >
                      <span>{p.label}</span>
                      <span className="text-[8px] opacity-70">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Convolution Matrix Information & Performance Details */}
            {blurRadius > 0 && blurStrategy && blurKernel && (
              <div
                id="gaussian-convolution-matrix-info"
                className="rounded bg-[#181818] border border-black p-2 space-y-1.5 text-[9px] text-gray-400"
              >
                <div className="flex items-center justify-between text-gray-300 font-medium">
                  <span className="flex items-center gap-1 text-blue-400">
                    <span>Convolution Matrix</span>
                  </span>
                  <span className="font-mono text-[9px] bg-[#121212] px-1 py-0.5 rounded border border-black text-blue-300">
                    {blurKernel.size} × {blurKernel.size} Kernel (σ = {blurStrategy.sigma.toFixed(2)})
                  </span>
                </div>

                <div className="flex items-center justify-between text-[8.5px]">
                  <span className="text-gray-500">Separable passes:</span>
                  <span className="font-mono text-gray-300">
                    2 × {blurKernel.size} taps/px ({blurKernel.size * 2} ops)
                  </span>
                </div>

                <div className="flex items-center justify-between text-[8.5px]">
                  <span className="text-gray-500">Sampling optimization:</span>
                  <span
                    className={`font-mono ${
                      blurStrategy.samplingFactor < 1 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {blurStrategy.samplingFactor < 1
                      ? `Adaptive ${Math.round(1 / blurStrategy.samplingFactor)}× subsample (${blurStrategy.scaledWidth}×${blurStrategy.scaledHeight})`
                      : '1:1 full resolution matrix'}
                  </span>
                </div>

                {/* Center Kernel Weights Preview */}
                <div className="pt-0.5">
                  <div className="flex items-center justify-between text-[8px] text-gray-500 pb-0.5">
                    <span>Matrix Center Weights:</span>
                    <span className="font-mono">Σ = 1.000</span>
                  </div>
                  <div className="grid grid-cols-5 gap-0.5 font-mono text-[8px] text-center">
                    {Array.from({ length: Math.min(5, blurKernel.size) }).map((_, idx) => {
                      const offset = idx - Math.floor(Math.min(5, blurKernel.size) / 2);
                      const kIdx = blurKernel.radius + offset;
                      const weight = blurKernel.kernel[kIdx] || 0;
                      return (
                        <div
                          key={idx}
                          className="bg-[#121212] rounded px-1 py-0.5 border border-black text-blue-200 truncate"
                          title={`Offset ${offset >= 0 ? '+' : ''}${offset}: weight ${weight.toFixed(4)}`}
                        >
                          {weight.toFixed(3)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Bake / Apply to Canvas button */}
            {blurRadius > 0 && (
              <div className="pt-0.5">
                <button
                  id="btn-bake-gaussian-blur"
                  onClick={handleApplyBakeBlur}
                  className="flex w-full items-center justify-center gap-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium py-1 px-2 text-[10px] shadow transition-colors cursor-pointer"
                  title="Permanently bake current Gaussian blur into this layer's canvas"
                >
                  <Check className="h-3 w-3" />
                  <span>Apply to Layer Canvas</span>
                </button>
              </div>
            )}
          </div>

          {/* Add Noise Filter Card */}
          <div
            id="noise-filter-card"
            className="rounded border border-black bg-[#232323] p-2.5 space-y-2.5 shadow-sm"
          >
            {/* Header: Title & Status Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-purple-300 text-[11px]">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>Add Noise</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  id="badge-noise-status"
                  className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                    noiseIntensity > 0
                      ? 'bg-purple-950/80 border-purple-700/80 text-purple-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}
                >
                  {noiseIntensity > 0
                    ? `${noiseIntensity}% ${noiseMonochromatic ? 'Mono' : 'Color'}`
                    : 'Off'}
                </span>
                {noiseIntensity > 0 && (
                  <button
                    id="btn-reset-noise"
                    onClick={handleResetNoise}
                    title="Reset noise filter to 0%"
                    className="flex items-center gap-0.5 rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-1.5 py-0.5 text-[9px] text-gray-400 hover:text-gray-200 cursor-pointer"
                  >
                    <RefreshCw className="h-2 w-2" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Formula / Technical explanation badge */}
            <div className="text-[8.5px] text-purple-300/85 bg-[#18141f] px-2 py-1.5 rounded border border-purple-950/60 font-mono space-y-0.5">
              <div className="flex justify-between items-center text-gray-400 border-b border-purple-950/40 pb-0.5 mb-0.5">
                <span className="text-gray-400">Random RGB Perturbation:</span>
                <span className="text-[8px] text-purple-400/90">Pixel Data</span>
              </div>
              <div className="text-purple-200/90 tracking-tight leading-tight">
                RGB&apos; = clamp(RGB ± (Random × Intensity × 255), 0, 255)
              </div>
            </div>

            {/* User-Defined Intensity Slider & Numeric Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <span>Noise Intensity</span>
                </span>
                <div className="flex items-center gap-1">
                  <input
                    id="noise-intensity-number-input"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={noiseIntensity}
                    onChange={(e) => handleNoiseChange(Number(e.target.value))}
                    onBlur={handleNoiseCommit}
                    className="w-14 rounded bg-[#141414] border border-black px-1.5 py-0.5 text-right font-mono text-[10px] text-purple-300 focus:border-purple-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-gray-500">%</span>
                </div>
              </div>

              <input
                id="noise-intensity-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={noiseIntensity}
                onChange={(e) => handleNoiseChange(Number(e.target.value))}
                onPointerUp={handleNoiseCommit}
                onTouchEnd={handleNoiseCommit}
                onKeyUp={handleNoiseCommit}
                className="w-full h-1.5 cursor-pointer accent-purple-400 bg-[#161616] rounded appearance-none"
                title={`Noise Intensity: ${noiseIntensity}%`}
              />

              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>0% (Clean)</span>
                <span className={noiseIntensity === 25 ? 'text-purple-400 font-semibold' : ''}>25%</span>
                <span className={noiseIntensity === 50 ? 'text-purple-400 font-semibold' : ''}>50%</span>
                <span>100% (Max)</span>
              </div>
            </div>

            {/* Monochromatic Toggle Option */}
            <div className="flex items-center justify-between py-0.5 text-[10px] text-gray-300 border-t border-black/40 pt-1.5">
              <label htmlFor="noise-monochromatic-toggle" className="flex items-center gap-1.5 cursor-pointer">
                <input
                  id="noise-monochromatic-toggle"
                  type="checkbox"
                  checked={noiseMonochromatic}
                  onChange={(e) => handleToggleMonochromatic(e.target.checked)}
                  className="h-3.5 w-3.5 cursor-pointer accent-purple-500 rounded"
                />
                <span>Monochromatic (Uniform Film Grain)</span>
              </label>
              <span className="text-[9px] text-gray-500 font-mono">
                {noiseMonochromatic ? 'Mono' : 'Color'}
              </span>
            </div>

            {/* Intensity Presets */}
            <div className="space-y-1">
              <span className="text-[9px] font-medium text-gray-400">Presets</span>
              <div className="grid grid-cols-5 gap-1">
                {NOISE_PRESETS.map((p) => {
                  const isSelected = noiseIntensity === p.intensity;
                  return (
                    <button
                      key={p.label}
                      id={`btn-preset-noise-${p.intensity}`}
                      onClick={() => handleNoisePresetSelect(p.intensity)}
                      className={`flex flex-col items-center justify-center rounded py-1 border text-[9px] transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-purple-900/60 border-purple-500 text-purple-200 font-semibold shadow-xs'
                          : 'bg-[#1a1a1a] border-black/80 text-gray-300 hover:bg-[#333] hover:text-white'
                      }`}
                      title={`${p.label} - ${p.desc}`}
                    >
                      <span className="leading-tight">{p.label}</span>
                      <span className="text-[8px] text-gray-400 font-mono">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons: Bake Noise */}
            {noiseIntensity > 0 && (
              <div className="pt-0.5">
                <button
                  id="btn-bake-noise"
                  onClick={handleApplyBakeNoise}
                  className="flex w-full items-center justify-center gap-1 rounded bg-purple-700/80 hover:bg-purple-600 border border-purple-500/80 px-2 py-1 text-[10px] font-medium text-white transition-colors cursor-pointer shadow-xs"
                  title="Permanently bake current noise filter into this layer's canvas buffer"
                >
                  <Check className="h-3 w-3" />
                  <span>Bake Noise into Layer</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick 1-click Filter Presets */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-medium text-gray-400">Quick Looks</span>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => applyPreset('sepia')}
                className="rounded bg-[#1a1a1a] hover:bg-amber-700 hover:text-white border border-black px-2 py-1 text-[10px] text-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-1"
                title="Convert to standard Sepia tone using pixel matrix transformation"
              >
                <Film className="h-2.5 w-2.5 text-amber-400" />
                <span>Vintage Sepia</span>
              </button>
              <button
                onClick={() => applyPreset('bw')}
                className="rounded bg-[#1a1a1a] hover:bg-neutral-600 hover:text-white border border-black px-2 py-1 text-[10px] text-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-1"
                title="Convert to true Black & White using luminance formula"
              >
                <Moon className="h-2.5 w-2.5 text-neutral-300" />
                <span>B & W Film</span>
              </button>
              <button
                onClick={() => applyPreset('vibrant')}
                className="rounded bg-[#1a1a1a] hover:bg-blue-600 hover:text-white border border-black px-2 py-1 text-[10px] text-gray-300 transition-colors cursor-pointer"
              >
                Vibrant
              </button>
              <button
                onClick={() => applyPreset('cyberpunk')}
                className="rounded bg-[#1a1a1a] hover:bg-fuchsia-700 hover:text-white border border-black px-2 py-1 text-[10px] text-gray-300 transition-colors cursor-pointer"
              >
                Cyber Glow
              </button>
            </div>
          </div>

          {/* Color & Tone Sliders */}
          <div className="space-y-2.5 pt-1">
            {/* Brightness */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] text-gray-300">
                <span className="flex items-center gap-1">
                  <Sun className="h-3 w-3 text-amber-400" /> Brightness
                </span>
                <span className="font-mono text-gray-400">{filters.brightness}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={filters.brightness}
                onChange={(e) => handleChange('brightness', Number(e.target.value))}
                className="w-full h-1 cursor-pointer accent-blue-500"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] text-gray-300">
                <span className="flex items-center gap-1">
                  <Contrast className="h-3 w-3 text-blue-400" /> Contrast
                </span>
                <span className="font-mono text-gray-400">{filters.contrast}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={filters.contrast}
                onChange={(e) => handleChange('contrast', Number(e.target.value))}
                className="w-full h-1 cursor-pointer accent-blue-500"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] text-gray-300">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-pink-400" /> Saturation (HSL Pixel)
                </span>
                <span className="font-mono text-pink-300">{satScale > 0 ? '+' : ''}{satScale}%</span>
              </div>
              <input
                id="bottom-saturation-slider"
                type="range"
                min="-100"
                max="100"
                value={satScale}
                onChange={(e) => handleSatChange(Number(e.target.value))}
                onPointerUp={handleSatCommit}
                onTouchEnd={handleSatCommit}
                onKeyUp={handleSatCommit}
                className="w-full h-1 cursor-pointer accent-pink-500"
              />
            </div>

            {/* Hue Rotate */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] text-gray-300">
                <span>Hue Rotate</span>
                <span className="font-mono text-gray-400">{filters.hue}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={filters.hue}
                onChange={(e) => handleChange('hue', Number(e.target.value))}
                className="w-full h-1 cursor-pointer accent-blue-500"
              />
            </div>

            {/* Invert */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-gray-300">Invert Negative</span>
              <input
                type="checkbox"
                checked={filters.invert}
                onChange={(e) => handleChange('invert', e.target.checked)}
                className="h-3.5 w-3.5 cursor-pointer accent-blue-500 rounded"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
