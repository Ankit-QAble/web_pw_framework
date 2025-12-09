import * as fs from 'fs';
import * as path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { Logger } from './Logger';

export interface VisualCompareResult {
  baselinePath: string;
  actualPath: string;
  diffPath: string;
  diffPixels: number;
  diffRatio: number;
  passed: boolean;
}

export interface VisualCompareOptions {
  /**
   * Threshold for considering images equal.
   * If thresholdType is 'percent', this is a value between 0 and 1 (e.g. 0.01 = 1% pixels may differ).
   * If thresholdType is 'pixel', this is an absolute number of pixels that may differ.
   */
  threshold?: number;
  thresholdType?: 'pixel' | 'percent';
}

export class VisualComparator {
  private logger: Logger;

  constructor(loggerName: string = 'VisualComparator') {
    this.logger = new Logger(loggerName);
  }

  /**
   * Compare two PNG images on disk using pixelmatch.
   * If baseline does not exist, it will be created from actual and comparison will be skipped (first-run behaviour).
   */
  async compareOrCreateBaseline(
    baselinePath: string,
    actualPath: string,
    diffPath: string,
    options: VisualCompareOptions = {}
  ): Promise<VisualCompareResult> {
    const { threshold = 0.01, thresholdType = 'percent' } = options;

    // Ensure directories exist
    this.ensureDirectory(path.dirname(baselinePath));
    this.ensureDirectory(path.dirname(actualPath));
    this.ensureDirectory(path.dirname(diffPath));

    // If no baseline yet, take this actual as baseline and treat as passed
    if (!fs.existsSync(baselinePath)) {
      this.logger.info(`Baseline image not found. Creating new baseline at: ${baselinePath}`);
      fs.copyFileSync(actualPath, baselinePath);

      return {
        baselinePath,
        actualPath,
        diffPath,
        diffPixels: 0,
        diffRatio: 0,
        passed: true,
      };
    }

    const baselinePng = PNG.sync.read(fs.readFileSync(baselinePath));
    const actualPng = PNG.sync.read(fs.readFileSync(actualPath));

    if (baselinePng.width !== actualPng.width || baselinePng.height !== actualPng.height) {
      this.logger.warn(
        `Image size mismatch. Baseline: ${baselinePng.width}x${baselinePng.height}, Actual: ${actualPng.width}x${actualPng.height}`
      );
    }

    const width = Math.min(baselinePng.width, actualPng.width);
    const height = Math.min(baselinePng.height, actualPng.height);

    const diffPng = new PNG({ width, height });

    const diffPixels = pixelmatch(
      baselinePng.data,
      actualPng.data,
      diffPng.data,
      width,
      height,
      {
        threshold: 0.1, // pixelmatch internal threshold (sensitivity), not our pass/fail one
      }
    );

    const totalPixels = width * height;
    const diffRatio = totalPixels > 0 ? diffPixels / totalPixels : 0;

    fs.writeFileSync(diffPath, PNG.sync.write(diffPng));

    let passed: boolean;
    if (thresholdType === 'pixel') {
      passed = diffPixels <= threshold;
    } else {
      passed = diffRatio <= threshold;
    }

    this.logger.info(
      `Visual comparison result – diffPixels: ${diffPixels}, diffRatio: ${(diffRatio * 100).toFixed(
        3
      )}%, passed: ${passed}`
    );

    return {
      baselinePath,
      actualPath,
      diffPath,
      diffPixels,
      diffRatio,
      passed,
    };
  }

  private ensureDirectory(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}


