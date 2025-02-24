import { Storage } from '@capacitor/storage';

export interface AdBlockingRule {
  id: string;
  pattern: string;
  type: 'domain' | 'element' | 'network' | 'cosmetic';
  action: 'block' | 'allow';
  source?: string;
}

export class AdBlocker {
  private static instance: AdBlocker;
  private rules: AdBlockingRule[] = [];
  private elementFilters: string[] = [
    // Common ad container selectors
    '[id*="google_ads"]',
    '[id*="banner"]',
    '[class*="ad-container"]',
    '[class*="sponsored"]',
    '[aria-label*="Advertisement"]',
    '[data-ad]',
    '[id*="carbonads"]',
    'ins.adsbygoogle',
    '.ad-unit',
    '.advertisement',
    // Social media sponsored content
    '[data-testid*="promoted"]',
    '[aria-label*="Sponsored"]',
    '[data-ad-preview]',
    // Video ad containers
    '.video-ads',
    '.player-ads',
    '[class*="preroll"]',
    // Newsletter and popup ads
    '.newsletter-popup',
    '.popup-overlay[data-advertisement]',
    // Native advertising
    '[class*="native-ad"]',
    '[class*="promoted-content"]',
    // Sidebar ads
    '.sidebar-ads',
    '[class*="rail-ad"]',
    // Mobile-specific ads
    '.mobile-ad',
    '[class*="app-install"]'
  ];

  private networkFilters: string[] = [
    // Ad networks
    '*://*.doubleclick.net/*',
    '*://*.google-analytics.com/*',
    '*://*.googlesyndication.com/*',
    '*://*.googleadservices.com/*',
    '*://*.moatads.com/*',
    '*://*.facebook.com/tr/*',
    '*://*.amazon-adsystem.com/*',
    '*://pixel.advertising.com/*',
    '*://*.adnxs.com/*',
    '*://*.criteo.com/*',
    // Analytics and tracking
    '*://*.hotjar.com/*',
    '*://*.quantserve.com/*',
    '*://*.scorecardresearch.com/*',
    // Ad serving domains
    '*://*.serving-sys.com/*',
    '*://*.pubmatic.com/*',
    '*://*.taboola.com/*',
    '*://*.outbrain.com/*',
    '*://*.zedo.com/*',
    // Social media tracking
    '*://analytics.twitter.com/*',
    '*://*.facebook.com/plugins/*',
    // Video ad networks
    '*://*.spotxchange.com/*',
    '*://*.springserve.com/*',
    '*://*.innovid.com/*'
  ];

  private cosmeticFilters: Record<string, string[]> = {
    'youtube.com': [
      '#masthead-ad',
      '.ytd-rich-item-renderer.style-scope #content:has(.ytd-display-ad-renderer)',
      'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]'
    ],
    'facebook.com': [
      '[data-pagelet="RightRail"] > div:has([aria-label*="Sponsored"])',
      '[role="feed"] > div:has([aria-label*="Sponsored"])',
      '[data-pagelet="VideoChatHome"] div:has([aria-label*="Sponsored"])'
    ],
    'twitter.com': [
      '[data-testid="tweet"]:has([data-testid*="promoted"])',
      '[data-testid="placementTracking"]'
    ],
    'linkedin.com': [
      '.feed-shared-update-v2:has(.feed-shared-actor__sub-description:contains("Promoted"))',
      '.scaffold-layout__aside > div:has(.ad-banner-container)'
    ]
  };

  private constructor() {
    this.initialize();
  }

  public static getInstance(): AdBlocker {
    if (!AdBlocker.instance) {
      AdBlocker.instance = new AdBlocker();
    }
    return AdBlocker.instance;
  }

  private async initialize(): Promise<void> {
    await this.loadRules();
    this.setupMutationObserver();
  }

  private async loadRules(): Promise<void> {
    const { value } = await Storage.get({ key: 'adBlockingRules' });
    if (value) {
      this.rules = JSON.parse(value);
    }
  }

  private setupMutationObserver(): void {
    if (typeof window === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          this.processNewNodes(mutation.addedNodes);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private processNewNodes(nodes: NodeList): void {
    nodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        this.hideAdsInElement(node);
      }
    });
  }

  public hideAdsInElement(element: HTMLElement): void {
    // Apply element filters
    this.elementFilters.forEach(selector => {
      element.querySelectorAll(selector).forEach(ad => {
        if (ad instanceof HTMLElement && !ad.dataset.adBlocked) {
          ad.style.display = 'none';
          ad.dataset.adBlocked = 'true';
          this.logBlockedAd(ad);
        }
      });
    });

    // Apply site-specific cosmetic filters
    const hostname = window.location.hostname;
    if (this.cosmeticFilters[hostname]) {
      this.cosmeticFilters[hostname].forEach(selector => {
        element.querySelectorAll(selector).forEach(ad => {
          if (ad instanceof HTMLElement && !ad.dataset.adBlocked) {
            ad.style.display = 'none';
            ad.dataset.adBlocked = 'true';
            this.logBlockedAd(ad);
          }
        });
      });
    }
  }

  public shouldBlockRequest(url: string): boolean {
    return this.networkFilters.some(pattern => {
      const regex = new RegExp(
        pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')
      );
      return regex.test(url);
    });
  }

  private async logBlockedAd(element: HTMLElement): Promise<void> {
    const stats = await this.getStats();
    stats.totalBlocked++;
    stats.todayBlocked++;
    
    const domain = window.location.hostname;
    const domainStats = stats.byDomain[domain] || { blocked: 0 };
    domainStats.blocked++;
    stats.byDomain[domain] = domainStats;

    await Storage.set({
      key: 'adBlockingStats',
      value: JSON.stringify(stats)
    });
  }

  public async getStats(): Promise<{
    totalBlocked: number;
    todayBlocked: number;
    byDomain: Record<string, { blocked: number }>;
  }> {
    const { value } = await Storage.get({ key: 'adBlockingStats' });
    return value ? JSON.parse(value) : {
      totalBlocked: 0,
      todayBlocked: 0,
      byDomain: {}
    };
  }

  public async addCustomRule(rule: Omit<AdBlockingRule, 'id'>): Promise<string> {
    const id = Date.now().toString();
    const newRule: AdBlockingRule = { ...rule, id };
    this.rules.push(newRule);
    await this.saveRules();
    return id;
  }

  private async saveRules(): Promise<void> {
    await Storage.set({
      key: 'adBlockingRules',
      value: JSON.stringify(this.rules)
    });
  }

  public getElementFilters(): string[] {
    return this.elementFilters;
  }

  public getNetworkFilters(): string[] {
    return this.networkFilters;
  }

  public getCosmeticFilters(): Record<string, string[]> {
    return this.cosmeticFilters;
  }
}
