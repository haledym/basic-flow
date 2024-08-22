import { IonButton, IonCol, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react';
import './login.css';
import { useLogin } from '@refinedev/core';
import { CredentialResponse } from '../../../interfaces/google';
import { useHistory  } from "react-router-dom";
import { LogoIcon } from "../../../assets/icons";
// import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useEffect, useRef, useState } from 'react';


const Login: React.FC = () => {
  GoogleAuth.initialize({
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
    grantOfflineAccess: true,
  });
  const [user, setUser] = useState<any>(null);
  const history = useHistory();
  


  // const { mutate: login, isLoading } = useLogin<CredentialResponse>();

  const handleLoginSuccess = (res: CredentialResponse) => {
    console.log('Login Success:', res);
    if (res.credential) {
      // login(res);
    }
    // Handle the authentication response here
  };

  const handleLoginFailure = () => {
    console.error('Login Failure:');
    // Handle login failure here
  };
  const googleSignup = async () => {
    const googleUser = await GoogleAuth.signIn() as any;
    console.log('my user: ', googleUser);
    if(googleUser) setUser(googleUser)
    // this.userInfo = googleUser;
  }
  const GoogleButton = (): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (typeof window === "undefined" || !window.google || !divRef.current) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          ux_mode: "popup",
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: async (res: CredentialResponse) => {
            if (res.credential) {
              // login(res);
              console.log(res)
            }
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: "filled_blue",
          size: "large",
          type: "standard",
          shape: "pill",
        });
      } catch (error) {
        console.log(error);
      }
    }, []);

    return <div ref={divRef} />;
  };

  return (
    <IonPage>
      <IonContent className="ion-padding bg-white">
        {/* { !isLoading && <IonSpinner className="!max-h-screen"></IonSpinner>} */}
        <div
          style={{
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        > <h1>LOGIN</h1> <br/><br/>
          {/* <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            shape="pill"
            theme="filled_blue"
            size='large'
          /> */}
           <IonButton onClick={googleSignup}>Sign in</IonButton>
           {/* <GoogleButton /> */}
          {user && 
          <div>
            <p>Email: {user?.email}</p>
            <p>Name: {user?.name}</p>
            <p>Id: {user?.id}</p>
          </div>
          }
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
