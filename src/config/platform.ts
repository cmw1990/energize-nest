export type Platform = 'webapp' | 'webtool' | 'mobile' | 'desktop' | 'extension';

interface PlatformConfig {
  basePath: string;
  useHashRouter: boolean;
}

const platformConfigs: Record<Platform, PlatformConfig> = {
  webapp: {
    basePath: '/',
    useHashRouter: false,
  },
  webtool: {
    basePath: '/tool',
    useHashRouter: false,
  },
  mobile: {
    basePath: '/mobile',
    useHashRouter: true,
  },
  desktop: {
    basePath: '/desktop',
    useHashRouter: true,
  },
  extension: {
    basePath: '/ext',
    useHashRouter: true,
  },
};

export function getPlatform(): Platform {
  const pathname = window.location.pathname;
  
  if (pathname.startsWith('/tool')) return 'webtool';
  if (pathname.startsWith('/mobile')) return 'mobile';
  if (pathname.startsWith('/desktop')) return 'desktop';
  if (pathname.startsWith('/ext')) return 'extension';
  
  return 'webapp';
}

export function getPlatformConfig(platform: Platform): PlatformConfig {
  return platformConfigs[platform];
}

export function getBasePath(platform: Platform): string {
  return platformConfigs[platform].basePath;
}

export function shouldUseHashRouter(platform: Platform): boolean {
  return platformConfigs[platform].useHashRouter;
}

export function isValidPlatform(platform: string): platform is Platform {
  return platform in platformConfigs;
}
