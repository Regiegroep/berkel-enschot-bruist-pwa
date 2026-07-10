# Berkel-Enschot Bruist PWA
## Developer Specification

**Project:** Berkel-Enschot Bruist PWA  
**Versie:** 0.6  
**Status:** In ontwikkeling

---

# Doel

Ontwikkel een Progressive Web App (PWA) waarmee bezoekers van Berkel-Enschot Bruist eenvoudig het festivalprogramma kunnen bekijken, filteren, opslaan en gebruiken tijdens het festival.

De applicatie moet:

- snel zijn;
- mobiel geoptimaliseerd zijn;
- offline bruikbaar zijn;
- eenvoudig beheerd kunnen worden via Google Sheets.

---

# Kernprincipes

## Geen accounts

Bezoekers hoeven niet in te loggen.

Favorieten en persoonlijke planning worden lokaal opgeslagen.

---

## Eén bron van waarheid

Alle content komt uit Google Sheets.

Geen CMS.

Geen dubbele invoer.

---

## Mobile First

De primaire gebruiker gebruikt een smartphone tijdens het festival.

Desktop is ondersteunend.

---

## Offline First

Na een eerste bezoek blijven programma en persoonlijke planning zoveel mogelijk beschikbaar zonder internet.

---

# Hoofdonderdelen

1. Home
2. Programma
3. Mijn Programma
4. Plattegrond
5. Informatie

---

# Programma

Per activiteit minimaal:

- titel
- afbeelding
- datum
- begin
- einde
- locatie
- categorie
- omschrijving

---

# Functionaliteiten

## Programma

- overzicht
- zoeken
- filteren
- detailpagina

## Mijn Programma

- favorieten
- persoonlijke planning
- tijdconflicten signaleren

## Plattegrond

- locaties
- koppeling met activiteiten
- route naar locatie

## Informatie

- bereikbaarheid
- parkeren
- EHBO
- toiletten
- contact

---

# Gegevensbron

Google Spreadsheet.

De spreadsheet vormt de enige contentbron.

---

# Opslag gebruiker

Lokale opslag.

Geen persoonsgegevens.

---

# Technische voorkeur

Framework:

- React
- Vite

PWA:

- Service Worker
- Manifest

Hosting:

- Vercel of Netlify

---

# Buiten scope versie 1.0

- accounts
- betalingen
- ticketing
- reserveringen
- AI-aanbevelingen
- meertaligheid

---

# Doel versie 1.0

Een stabiele digitale festivalgids die volledig beheerd kan worden via Google Sheets.
