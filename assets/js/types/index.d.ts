/**
 * Application Type Definitions
 */

// Theme System
export interface ThemeConfig {
  isDark: boolean;
  systemPreference: boolean;
  userPreference?: boolean;
}

// Form Types
export interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FormSubmissionResult {
  success: boolean;
  error?: string;
  retryCount?: number;
  timestamp: number;
}

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  backoffMultiplier: number;
  maxDelayMs: number;
}

// Web Vitals
export interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export interface VitalThresholds {
  good: number;
  needsImprovement: number;
}

// Navigation
export interface NavState {
  isOpen: boolean;
  currentSection?: string;
  lastScrollY: number;
}

// Effects
export interface EffectConfig {
  duration: number;
  delay: number;
  easing: string;
}

// Analytics
export interface AnalyticsEvent {
  eventName: string;
  parameters: Record<string, any>;
  timestamp: number;
}

export {};
