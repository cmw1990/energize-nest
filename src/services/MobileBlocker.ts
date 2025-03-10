import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';
import { Storage } from '@capacitor/storage';

export interface BlockingRule {
  id: string;
  appPackage?: string;
  schedule?: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  isActive: boolean;
}

export class MobileBlocker {
  private static instance: MobileBlocker;
  private rules: BlockingRule[] = [];
  private isActive = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): MobileBlocker {
    if (!MobileBlocker.instance) {
      MobileBlocker.instance = new MobileBlocker();
    }
    return MobileBlocker.instance;
  }

  private async initialize() {
    // Load saved rules
    const { value } = await Storage.get({ key: 'blockingRules' });
    if (value) {
      this.rules = JSON.parse(value);
    }

    // Load active state
    const { value: activeState } = await Storage.get({ key: 'blockerActive' });
    this.isActive = activeState === 'true';

    if (Capacitor.isNativePlatform()) {
      // Monitor app state changes
      App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          this.checkCurrentApp();
        }
      });
    }
  }

  public async addRule(rule: Omit<BlockingRule, 'id'>): Promise<string> {
    const id = Date.now().toString();
    const newRule: BlockingRule = {
      ...rule,
      id,
      isActive: true
    };

    this.rules.push(newRule);
    await this.saveRules();
    return id;
  }

  public async removeRule(id: string): Promise<void> {
    this.rules = this.rules.filter(rule => rule.id !== id);
    await this.saveRules();
  }

  public async updateRule(id: string, updates: Partial<BlockingRule>): Promise<void> {
    const index = this.rules.findIndex(rule => rule.id === id);
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates };
      await this.saveRules();
    }
  }

  public async toggleBlocking(active: boolean): Promise<void> {
    this.isActive = active;
    await Storage.set({ key: 'blockerActive', value: active.toString() });
    
    if (active) {
      await this.checkCurrentApp();
    }
  }

  private async saveRules(): Promise<void> {
    await Storage.set({
      key: 'blockingRules',
      value: JSON.stringify(this.rules)
    });
  }

  private isWithinSchedule(schedule: BlockingRule['schedule']): boolean {
    if (!schedule) return true;

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    if (!schedule.days.includes(currentDay)) return false;

    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
    return currentTime >= schedule.startTime && currentTime <= schedule.endTime;
  }

  private async checkCurrentApp(): Promise<void> {
    if (!this.isActive || !Capacitor.isNativePlatform()) return;

    try {
      const appInfo = await App.getInfo();
      const matchingRules = this.rules.filter(rule => {
        return rule.isActive && 
               rule.appPackage === appInfo.package &&
               this.isWithinSchedule(rule.schedule);
      });

      if (matchingRules.length > 0) {
        await this.blockApp();
      }
    } catch (error) {
      console.error('Error checking current app:', error);
    }
  }

  private async blockApp(): Promise<void> {
    // Trigger haptic feedback
    await Haptics.impact({ style: ImpactStyle.Heavy });

    // Show blocking notification
    await LocalNotifications.schedule({
      notifications: [{
        title: 'App Blocked',
        body: 'This app is currently blocked by Well-Charged',
        id: 1,
        schedule: { at: new Date(Date.now()) },
        sound: null,
        attachments: null,
        actionTypeId: '',
        extra: null
      }]
    });

    // Attempt to exit the app
    await App.exitApp();
  }

  public async getBlockingStats(): Promise<{
    totalBlocked: number;
    todayBlocked: number;
    mostBlockedApps: { package: string; count: number }[];
  }> {
    const { value } = await Storage.get({ key: 'blockingStats' });
    return value ? JSON.parse(value) : {
      totalBlocked: 0,
      todayBlocked: 0,
      mostBlockedApps: []
    };
  }
}
