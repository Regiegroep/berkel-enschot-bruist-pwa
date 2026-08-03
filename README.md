# Berkel-Enschot Bruist PWA

Digitale festivalgids voor Berkel-Enschot Bruist.

## Huidige versie

**v1.0 / R10.00**

Functioneel afgeronde basisversie voor het festival 2026.

## Belangrijkste functies

- Home met festivalintroductie en installatie-optie voor de PWA
- Actueel festivalprogramma vanuit Google Sheets
- Zoeken in het programma
- Filters: Onderdeel, Locatie en Dag
- Programmakaarten met details, afbeeldingen en optionele aanmeld-/bestellinks
- Mijn Bruist: persoonlijke selectie van activiteiten
- Waarschuwing bij overlappende activiteiten
- Festivalinfo met praktische informatie
- Ondersteuning van `## Tussenkop` in Festivalinfo
- Klikbare e-mailadressen
- Plattegronden: Buiten, Begane grond en Souterrain
- Locaties met activiteiten en koppeling terug naar Programma
- Installeerbare PWA met updatecontrole en offline fallback

## Contentbeheer

De dagelijkse festivalinhoud wordt zoveel mogelijk beheerd via Google Sheets.

Belangrijke gegevens:
- Programma
- Categorieën
- Festivalonderdelen
- Locaties
- Organisaties
- Festivalinfo

Alleen programmaonderdelen met status **Definitief** worden aan bezoekers getoond.

Categorieën en Tags blijven onderdeel van de datastructuur, maar zijn voor het festival 2026 niet als zichtbare programmafilters ingesteld.

Afbeeldingen die via Google Sheets worden gebruikt, worden bij voorkeur eerst in de Mediabibliotheek van de Berkel-Enschot Bruist-website geplaatst. De afbeeldings-URL wordt daarna in Google Sheets opgenomen.

## Technische opzet

De PWA is opgebouwd als statische webapp met:
- HTML
- CSS
- JavaScript
- Google Sheets als gegevensbron
- `manifest.json`
- `service-worker.js`

Belangrijkste bestanden:
- `index.html`
- `js/app.js`
- `js/screens.js`
- `js/store.js`
- `js/googleSheets.js`
- `css/style.css`
- `css/variables.css`
- `service-worker.js`
- `manifest.json`

Ontwikkeling en controle gebeuren lokaal in Visual Studio Code met Live Server. Publicatie verloopt via GitHub.

## PWA-updates

De app controleert op nieuwe versies. Als een nieuwe service worker beschikbaar is, kan de bezoeker de melding **Nieuwe versie beschikbaar** krijgen.

HTML, JavaScript, CSS en manifest gebruiken network-first: online wordt eerst de actuele versie opgehaald; offline wordt teruggevallen op de cache. Afbeeldingen kunnen vanuit cache worden geladen en op de achtergrond worden bijgewerkt.

## Beheer en onderhoud

Werk bij codewijzigingen in kleine stappen:
1. voer één beperkte wijziging uit;
2. test via Live Server;
3. controleer welke bestanden zijn gewijzigd;
4. commit met een duidelijke omschrijving;
5. push naar GitHub;
6. controleer de gepubliceerde webversie en waar relevant een reeds geïnstalleerde PWA.

Voor inhoudelijk beheer is een aparte beheerhandleiding beschikbaar. Voor techniek en onderhoud is er aparte technische/projectdocumentatie.
