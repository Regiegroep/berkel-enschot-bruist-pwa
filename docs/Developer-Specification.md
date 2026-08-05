# Berkel-Enschot Bruist PWA
## Developer Specification

**Project:** Berkel-Enschot Bruist PWA  
**Versie:** 1.0 / R10.00  
**Status:** Functioneel afgeronde basisversie  
**Bijgewerkt:** augustus 2026

---

# Doel

De Berkel-Enschot Bruist PWA is een mobiele digitale festivalgids waarmee bezoekers het programma kunnen bekijken, zoeken en filteren, activiteiten kunnen bewaren in Mijn Bruist, praktische informatie kunnen raadplegen en locaties op festivalplattegronden kunnen vinden.

De toepassing moet:
- snel en mobiel bruikbaar zijn;
- zonder account werken;
- zoveel mogelijk vanuit Google Sheets beheerd kunnen worden;
- robuust omgaan met tijdelijke verbindingsproblemen;
- eenvoudig te onderhouden en te publiceren zijn.

---

# Technische architectuur

De huidige v1.0 is een statische webapplicatie op basis van:
- HTML;
- CSS;
- vanilla JavaScript;
- Google Sheets als dynamische gegevensbron;
- `manifest.json`;
- `service-worker.js`.

De eerdere voorkeur voor React/Vite is niet toegepast in de uiteindelijke v1.0. De bestaande statische opzet is bewust eenvoudig gehouden.

Belangrijke bestanden:
- `index.html`
- `js/app.js`
- `js/screens.js`
- `js/store.js`
- `js/googleSheets.js`
- `css/style.css`
- `css/variables.css`
- `service-worker.js`
- `manifest.json`

---

# Kernprincipes

## Mobile first
Smartphone is de primaire gebruikssituatie. Desktop en tablet blijven bruikbaar.

## Geen accounts
Bezoekers loggen niet in. Mijn Bruist wordt lokaal opgeslagen.

## Eén bron van waarheid
Dynamische festivalcontent wordt vanuit Google Sheets geladen. Vaste technische assets en vaste PWA-afbeeldingen staan in de repository.

## Eenvoudig beheer
Normale contentwijzigingen mogen geen codewijziging vereisen.

## Kleine technische stappen
Codewijzigingen worden beperkt gehouden, lokaal getest en pas daarna gecommit en gepusht.

---

# Hoofdonderdelen

1. Home
2. Programma
3. Festivalinfo
4. Mijn Bruist
5. Plattegrond

---

# Programma

De programmadataset ondersteunt onder meer:
- ID;
- titel;
- korte omschrijving;
- omschrijving;
- datum;
- begintijd;
- optionele eindtijd;
- categorie;
- festivalonderdeel;
- locatie;
- organisatie;
- tags;
- doelgroep;
- afbeelding;
- publicatiestatus;
- optionele externe actie/link.

Alleen status **Definitief** wordt aan bezoekers getoond.

## Sortering
Primair op datum, daarna starttijd en daarna titel.

## Zoeken
Zoeken kan over meerdere velden, waaronder titel, omschrijving, categorie, festivalonderdeel, locatie, dag/datum en tags.

## Filters v1.0
Zichtbaar:
- Onderdeel;
- Locatie;
- Dag.

Categorieën en Tags blijven beschikbaar in het datamodel voor later gebruik.

## Tijdnotatie
Tijden worden weergegeven als `00:00`. Als geen echte eindtijd is ingevuld, wordt alleen de begintijd getoond.

---

# Mijn Bruist

Functionaliteit:
- activiteit toevoegen/verwijderen;
- persoonlijke festivalkeuzes lokaal bewaren;
- overlap tussen gekozen activiteiten signaleren;
- relevante externe actieknop tonen;
- locatie openen op de plattegrond.

Er is geen synchronisatie tussen apparaten.

---

# Festivalinfo

Festivalinfo wordt vanuit Google Sheets geladen.

Ondersteund:
- overzichtskaarten;
- detailpagina;
- algemene afbeelding als fallback;
- `## Tussenkop` op een eigen regel;
- lege regels;
- klikbare e-mailadressen.

---

# Plattegrond

Drie kaartlagen:
- Buiten;
- Begane grond;
- Souterrain.

Een locatie kan activiteiten tonen. Vanuit de activiteitenlijst kan naar de volledige programmakaart worden genavigeerd. Vanuit programmakaarten kan de betreffende locatie op de kaart worden geopend.

Plattegrondafbeeldingen zijn vaste assets. Bij vervanging moeten verhouding en uitsnede behouden blijven omdat markers op vaste posities staan.

---

# Afbeeldingen

## Via Google Sheets
Programma- en contentafbeeldingen worden bij voorkeur eerst in de Mediabibliotheek van de Berkel-Enschot Bruist-website geplaatst. De URL wordt in Google Sheets opgenomen.

## Vaste assets
Vaste afbeeldingen staan in `images`. Voor gewone liggende sfeerbeelden is circa 1600 × 900 px (16:9) een praktisch werkformaat. App-iconen behouden hun bestaande vierkante afmetingen en bestandsnamen.

---

# PWA, cache en updates

De PWA gebruikt een service worker.

Belangrijk gedrag:
- actuele app-code wordt online eerst opgehaald;
- cache fungeert als fallback;
- afbeeldingen kunnen efficiënt uit cache worden geladen;
- bij een nieuwe service worker kan de gebruiker de melding **Nieuwe versie beschikbaar** krijgen;
- updatecontrole vindt ook plaats wanneer de app opnieuw actief wordt.

Wijzigingen aan service worker/cache moeten altijd ook op een reeds geïnstalleerde PWA worden getest.

---

# Ontwikkel- en publicatiewerkwijze

1. Gebruik de actuele lokale GitHub/PWA-map als basis.
2. Wijzig één functie of een klein aantal samenhangende bestanden.
3. Test met Live Server.
4. Controleer gewijzigde bestanden.
5. Commit met duidelijke omschrijving.
6. Push naar `main`.
7. Controleer de gepubliceerde versie.
8. Test mobiele/PWA-functionaliteit als de wijziging daarop invloed heeft.

ZIP-bestanden zijn alleen tijdelijke overdrachtsmiddelen en geen bron van waarheid.

---

# Buiten scope v1.0

- accounts;
- betalingen/eigen ticketing;
- complexe reserveringsmodule;
- AI-aanbevelingen;
- meertaligheid;
- synchronisatie tussen apparaten;
- complexe routeoptimalisatie;
- live druktemeting;
- apart beheerdersdashboard.

---

# Documentatie

Bij de repository horen:
- `README.md`
- `CHANGELOG.md`
- `RELEASE_NOTES.md`
- `UPDATE.md`
- `VERSION.txt`
- `docs/Decisions.md`
- `docs/Developer-Specification.md`
- `docs/PRODUCTLOG.md`
- `docs/Roadmap.md`

Daarnaast zijn een beheerhandleiding en technische/projectdocumentatie voor v1.0 beschikbaar.
