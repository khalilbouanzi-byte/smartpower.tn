# Spower — Application Mobile (Standalone & 100% Locale)

Application mobile **Spower** fonctionnant entièrement en local, sans cloud et sans API externe.

---

## 1. Application Web Mobile (Prête à l'emploi)

* Fichiers :
  * [index.html](file:///c:/Users/Logan/Documents/smartpower/index.html) (Point d'entrée principal - application mobile)
  * [mobile.css](file:///c:/Users/Logan/Documents/smartpower/mobile.css) (Styles fidèles aux captures iOS/Spower)
  * [mobile.js](file:///c:/Users/Logan/Documents/smartpower/mobile.js) (Logique, télémétrie locale, scènes)

### Pour ouvrir sur votre smartphone :
Assurez-vous que votre téléphone est connecté au même réseau Wi-Fi, puis ouvrez dans votre navigateur mobile :
👉 **`http://192.168.1.10:8765/`**

---

## 2. Application Mobile Native React Native (Expo)

Le projet React Native complet se trouve dans le sous-dossier :
👉 [react-native-app/](file:///c:/Users/Logan/Documents/smartpower/react-native-app)

Pour le lancer avec Expo :
```bash
cd react-native-app
npm install
npx expo start
```
Puis scannez le QR code avec l'application **Expo Go** sur votre téléphone.
