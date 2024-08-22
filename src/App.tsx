import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { App as AntdApp } from 'antd';
import { Authenticated, CanAccess, I18nProvider, Refine } from '@refinedev/core';
import { DevtoolsProvider } from "@refinedev/devtools";
import { dataProvider } from "./providers/dataProvider";
import { authProvider } from './providers/authProvider';
import { accessControlProvider } from './providers/accessControlProvider';
import { CatchAllNavigate, NavigateToResource } from '@refinedev/react-router-v6';
import Login from './pages/auth/login/login';
import { home, person } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import routerProvider from "@refinedev/react-router-v6";
import { Buffer } from "buffer";

setupIonicReact();
window.Buffer = window.Buffer || Buffer;

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const i18nProvider: I18nProvider = {
    translate: (key: string) => t(key),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };
  console.log('gg_client', import.meta.env.VITE_GOOGLE_CLIENT_ID)
  
  return  (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
         <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/" component={Login} />
              {/* <Redirect exact from="/" to="/login" /> */}
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </GoogleOAuthProvider>
      
  );
}
 

export default App;
