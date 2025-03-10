import React from 'react';
import { IonContent, IonPage, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { home, flash, stopwatch, cog } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <IonPage className="w-full h-full">
      <IonContent className="w-full h-full safe-area-top">
        {/* Main Content Area */}
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 w-full overflow-y-auto pb-16 px-4">
            {children}
          </div>

          {/* Bottom Navigation */}
          <IonTabs className="w-full">
            <IonRouterOutlet></IonRouterOutlet>
            <IonTabBar slot="bottom" className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <IonTabButton tab="home" href="/webapp/dashboard" selected={location.pathname === '/webapp/dashboard'}
                className="py-1">
                <IonIcon icon={home} className="w-5 h-5" />
                <IonLabel className="text-xs mt-0.5">Home</IonLabel>
              </IonTabButton>

              <IonTabButton tab="energy" href="/webapp/energy" selected={location.pathname.startsWith('/webapp/energy')}
                className="py-1">
                <IonIcon icon={flash} className="w-5 h-5" />
                <IonLabel className="text-xs mt-0.5">Energy</IonLabel>
              </IonTabButton>

              <IonTabButton tab="focus" href="/webapp/focus" selected={location.pathname === '/webapp/focus'}
                className="py-1">
                <IonIcon icon={stopwatch} className="w-5 h-5" />
                <IonLabel className="text-xs mt-0.5">Focus</IonLabel>
              </IonTabButton>

              <IonTabButton tab="settings" href="/webapp/settings" selected={location.pathname === '/webapp/settings'}
                className="py-1">
                <IonIcon icon={cog} className="w-5 h-5" />
                <IonLabel className="text-xs mt-0.5">Settings</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MobileLayout;
