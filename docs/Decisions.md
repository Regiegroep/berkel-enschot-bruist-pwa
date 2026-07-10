# Berkel-Enschot Bruist PWA
## Besluitenregister

Dit document bevat de belangrijkste projectbesluiten voor de ontwikkeling van de Berkel-Enschot Bruist PWA.

Besluiten in dit document gelden als uitgangspunt voor versie 1.0. Wijzigingen worden alleen doorgevoerd als daar een duidelijke functionele of technische reden voor is.

---

## ADR-001 – Platform

**Besluit**  
De toepassing wordt ontwikkeld als Progressive Web App (PWA).

**Reden**

- geen publicatie via appstores nodig;
- direct toegankelijk via een webadres;
- installeerbaar op een telefoon;
- eenvoudig te actualiseren;
- lagere ontwikkel- en beheerkosten dan een native app.

**Status**  
Definitief

---

## ADR-002 – Mobile first

**Besluit**  
De PWA wordt primair ontworpen voor gebruik op een smartphone.

**Reden**  
De meeste bezoekers zullen de app tijdens het festival op hun telefoon gebruiken.

De toepassing moet daarnaast goed functioneren op tablet en desktop.

**Status**  
Definitief

---

## ADR-003 – Google Sheets als contentbron

**Besluit**  
Google Sheets wordt de centrale bron voor de inhoud van de PWA.

**Reden**

- het communicatieteam kan zelfstandig wijzigingen doorvoeren;
- geen apart CMS nodig;
- geen dubbele invoer;
- lage beheerlast.

**Status**  
Definitief

---

## ADR-004 – Geen gebruikersaccounts

**Besluit**  
Bezoekers hoeven geen account aan te maken en niet in te loggen.

**Reden**

- lagere drempel voor bezoekers;
- geen beheer van wachtwoorden;
- minder verwerking van persoonsgegevens;
- lagere technische complexiteit.

**Gevolg**  
Persoonlijke gegevens en voorkeuren worden niet tussen apparaten gesynchroniseerd.

**Status**  
Definitief

---

## ADR-005 – Lokale opslag

**Besluit**  
Favorieten en Mijn Programma worden lokaal op het apparaat van de bezoeker opgeslagen.

**Reden**

- geen backend nodig;
- snelle werking;
- persoonlijke planning blijft beschikbaar na het sluiten van de browser;
- ondersteuning van offline gebruik.

**Status**  
Definitief

---

## ADR-006 – Offline ondersteuning

**Besluit**  
De belangrijkste festivalinformatie moet na een eerste bezoek zoveel mogelijk offline beschikbaar blijven.

**Minimaal offline beschikbaar**

- app-interface;
- laatst geladen programma;
- locaties;
- praktische basisinformatie;
- Mijn Programma.

**Status**  
Definitief

---

## ADR-007 – Eén bron van waarheid

**Besluit**  
Festivalinformatie wordt niet op meerdere plaatsen handmatig beheerd.

**Reden**  
Dubbele invoer vergroot de kans op fouten en verouderde informatie.

De Google Spreadsheet is leidend voor alle dynamische content.

**Status**  
Definitief

---

## ADR-008 – Plattegrond

**Besluit**  
De PWA gebruikt een eigen interactieve festivalplattegrond als primaire kaartweergave.

**Reden**

- het festival speelt zich af in een compact gebied;
- een eigen kaart kan locaties en voorzieningen duidelijker tonen;
- de kaart kan aansluiten op de festivalvormgeving.

Externe navigatie via Google Maps of Apple Maps kan aanvullend worden aangeboden.

**Status**  
Definitief

---

## ADR-009 – Geen apart CMS

**Besluit**  
Voor versie 1.0 wordt geen apart beheersysteem ontwikkeld.

**Reden**

- Google Sheets vervult de benodigde beheerfunctie;
- een CMS zou extra kosten en beheer opleveren;
- de inhoudelijke omvang rechtvaardigt geen afzonderlijk systeem.

**Status**  
Definitief

---

## ADR-010 – GitHub eenvoudig gebruiken

**Besluit**  
GitHub wordt gebruikt als centrale opslag voor documentatie en broncode.

**Werkwijze**

- alleen de branch `main`;
- wijzigingen rechtstreeks committen naar `main`;
- geen pull requests;
- geen complexe workflows;
- voorlopig geen collaborators.

**Reden**  
De repository moet veiligheid en overzicht bieden zonder onnodige technische complexiteit.

**Status**  
Definitief

---

## ADR-011 – Geen onnodige functionaliteit

**Besluit**  
Nieuwe functies worden alleen toegevoegd wanneer zij aantoonbaar bijdragen aan:

- de bezoekerservaring;
- de bruikbaarheid tijdens het festival;
- eenvoudiger contentbeheer;
- betrouwbaarheid of toegankelijkheid.

**Reden**  
Versie 1.0 moet beheersbaar, stabiel en tijdig uitvoerbaar blijven.

**Status**  
Definitief

---

## ADR-012 – Buiten scope versie 1.0

De volgende functies maken geen deel uit van versie 1.0:

- bezoekersaccounts;
- betalingen;
- ticketverkoop;
- uitgebreide reserveringen;
- AI-aanbevelingen;
- synchronisatie tussen apparaten;
- meertaligheid;
- complexe routeoptimalisatie;
- live druktemeting;
- een apart beheerdersdashboard.

Deze functies kunnen voor latere versies opnieuw worden beoordeeld.

**Status**  
Definitief
