# UPDATE v1.0 / R10.00

Deze instructie is bedoeld voor toekomstige wijzigingen aan de BEB-PWA.

## Belangrijk uitgangspunt: werk in kleine stappen

Voer bij voorkeur één wijziging of een klein aantal logisch samenhangende wijzigingen tegelijk uit.

Een praktische cyclus is:

1. Maak de wijziging in de lokale map van de BEB-PWA.
2. Start of ververs Live Server.
3. Test de wijziging op desktop en, waar relevant, in mobiele weergave.
4. Controleer of bestaande functies nog werken.
5. Controleer met Git/GitHub welke bestanden daadwerkelijk zijn gewijzigd.
6. Commit met een korte, duidelijke omschrijving.
7. Push naar GitHub.
8. Controleer de gepubliceerde versie.
9. Test bij PWA-, cache- of service-workerwijzigingen ook een reeds geïnstalleerde mobiele PWA.

Ga pas daarna door met de volgende wijziging.

## Contentwijzigingen

Normale festivalinhoud wordt zoveel mogelijk in Google Sheets aangepast. Hiervoor is geen code-update nodig.

Belangrijke tabbladen/gegevens:
- Programma
- Categorieën
- Festivalonderdelen
- Locaties
- Organisaties
- Festivalinfo

Let op:
- Alleen status `Definitief` wordt in Programma gepubliceerd.
- Laat `eindtijd` leeg als er geen echte eindtijd is.
- Wijzig bestaande ID's niet zonder noodzaak.
- Verander kolom- of tabbladnamen niet zonder te controleren of de code daarop is gebaseerd.
- Gebruik bij Festivalinfo `## Tussenkop` op een eigen regel.
- Plaats programma-afbeeldingen bij voorkeur eerst in de Mediabibliotheek van de Berkel-Enschot Bruist-website en gebruik daarna de URL in Google Sheets.

## Vaste PWA-afbeeldingen

Afbeeldingen die niet uit Google Sheets komen staan in de map `images`.

Bij vervangen:
- behoud bij voorkeur dezelfde bestandsnaam;
- gebruik voor gewone liggende sfeerbeelden circa 1600 × 900 px (16:9);
- behoud bij plattegronden exact dezelfde verhouding en uitsnede en controleer daarna alle markerposities;
- behoud bij app-iconen de bestaande vierkante pixelafmetingen en bestandsnamen.

## Codewijzigingen

Veelgebruikte bestanden:
- `index.html`
- `js/app.js`
- `js/screens.js`
- `js/store.js`
- `js/googleSheets.js`
- `css/style.css`
- `css/variables.css`
- `service-worker.js`
- `manifest.json`

Vervang nooit meerdere bestanden alleen omdat ze in een oude ZIP samen geleverd zijn. Gebruik steeds de actuele GitHub-versie als basis en neem alleen de bedoelde wijziging over.

## Service worker en updates

Bij wijzigingen aan `service-worker.js`:
- geef de cache indien nodig een nieuwe versie/naam;
- test de gepubliceerde versie, niet alleen Live Server;
- open een reeds geïnstalleerde PWA;
- controleer of `Nieuwe versie beschikbaar` verschijnt wanneer dat van toepassing is;
- controleer na bijwerken of de nieuwste JS/CSS daadwerkelijk actief is.

## Afronding van een update

Een update is pas klaar als:
- Live Server goed werkt;
- de bedoelde bestanden zijn gecommit;
- GitHub is gepusht;
- de online versie is gecontroleerd;
- mobiele/PWA-functies zijn getest als de wijziging daarop invloed heeft.
