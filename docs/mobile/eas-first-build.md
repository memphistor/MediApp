# Pierwszy build EAS (credentials)

Projekt: **@thememphistor/mediapp** · `projectId`: `e6240fd1-1ad9-4b3f-ad9a-6be8762d538b`

Pierwszy build **iOS preview** wymaga trybu **interaktywnego** (brak certyfikatów internal distribution w non-interactive):

```bash
cd apps/mobile
npx eas-cli build --profile preview --platform ios
```

Postępuj według promptów EAS (Apple Developer, provisioning). Po sukcesie kolejne buildy mogą używać `--non-interactive`.

Android preview (zwykle bez lokalnego JDK):

```bash
npx eas-cli build --profile preview --platform android --non-interactive
```

Backup keystore Android po pierwszym buildzie:

```bash
npx eas-cli credentials
```

Dashboard: https://expo.dev/accounts/thememphistor/projects/mediapp
