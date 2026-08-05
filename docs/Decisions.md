# Berkel-Enschot Bruist PWA
## Besluitenregister

**Versie:** 1.0 / R10.00  
**Status:** Actueel voor v1.0  
**Bijgewerkt:** augustus 2026

Dit document bevat de belangrijkste projectbesluiten voor de ontwikkeling en het beheer van de Berkel-Enschot Bruist PWA.

Besluiten in dit document gelden als uitgangspunt voor versie 1.0 en voor regulier beheer daarna. Wijzigingen worden alleen doorgevoerd als daar een duidelijke functionele of technische reden voor is.

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
De meeste bezoekers gebruiken de PWA tijdens het festival op hun telefoon. Tablet en desktop blijven ondersteund.

**Status**  
Definitief

---

## ADR-003 – Google Sheets als contentbron

**Besluit**  
Google Sheets is de centrale bron voor de dynamische inhoud van de PWA.

**Reden**
- het communicatieteam kan zelfstandig wijzigingen doorvoeren;
- geen apart CMS nodig;
- geen dubbele invoer;
- lage beheerlast.

**Nuance**  
Vaste PWA-afbeeldingen, plattegronden, app-iconen en technische configuratie staan in de repository en niet in Google Sheets.

**Status**  
Definitief

---

## ADR-004 – Geen gebruikersaccounts

**Besluit**  
Bezoekers hoeven geen account aan te maken en niet in te loggen.

**Reden**
- lagere drempel;
- geen wachtwoordbeheer;
- minder verwerking van persoonsgegevens;
- lagere technische complexiteit.

**Gevolg**  
Persoonlijke keuzes worden niet tussen apparaten gesynchroniseerd.

**Status**  
Definitief

---

## ADR-005 – Lokale opslag / Mijn Bruist

**Besluit**  
De keuzes in Mijn Bruist worden lokaal op het apparaat van de bezoeker opgeslagen.

**Reden**
- geen backend nodig;
- snelle werking;
- persoonlijke planning blijft op hetzelfde apparaat beschikbaar;
- past bij het uitgangspunt zonder accounts.

**Status**  
Definitief

---

## ADR-006 – Offline en updategedrag

**Besluit**  
De PWA gebruikt een service worker en cache om de app robuust te laten functioneren en om eerder geladen onderdelen beschikbaar te houden wanneer de verbinding wegvalt.

Voor HTML, JavaScript, CSS en manifest wordt online eerst geprobeerd de actuele versie op te halen, met cache als terugval. De PWA controleert op nieuwe versies en kan de bezoeker melden dat een nieuwe versie beschikbaar is.

**Status**  
Definitief

---

## ADR-007 – Eén bron van waarheid

**Besluit**  
Dynamische festivalinformatie wordt niet op meerdere plaatsen handmatig beheerd.

Google Sheets is leidend voor programma- en festivalinformatie. Alleen onderdelen met publicatiestatus **Definitief** worden in het programma aan bezoekers getoond.

**Status**  
Definitief

---

## ADR-008 – Plattegrond

**Besluit**  
De PWA gebruikt eigen festivalplattegronden als primaire kaartweergave.

**Uitwerking v1.0**
- Buiten;
- Begane grond;
- Souterrain;
- locaties met markers;
- activiteiten per geselecteerde locatie;
- koppeling van kaart naar programmakaart en omgekeerd.

**Status**  
Definitief

---

## ADR-009 – Geen apart CMS

**Besluit**  
Voor versie 1.0 wordt geen apart beheersysteem ontwikkeld.

Google Sheets vervult de benodigde beheerfunctie.

**Status**  
Definitief

---

## ADR-010 – GitHub eenvoudig gebruiken

**Besluit**  
GitHub wordt gebruikt als centrale opslag voor broncode en projectdocumentatie.

**Werkwijze**
- branch `main`;
- kleine, overzichtelijke wijzigingen;
- lokaal testen met Live Server;
- daarna commit en push;
- geen onnodig complexe Git-workflow.

**Reden**  
De repository moet veiligheid en overzicht bieden zonder onnodige technische complexiteit.

**Status**  
Definitief

---

## ADR-011 – Geen onnodige functionaliteit

**Besluit**  
Nieuwe functies worden alleen toegevoegd wanneer zij aantoonbaar bijdragen aan bezoekerservaring, bruikbaarheid, beheer, betrouwbaarheid of toegankelijkheid.

**Status**  
Definitief

---

## ADR-012 – Buiten scope versie 1.0

Niet opgenomen in v1.0:
- bezoekersaccounts;
- betalingen of eigen ticketverkoop;
- complexe reserveringsmodule;
- AI-aanbevelingen;
- synchronisatie tussen apparaten;
- meertaligheid;
- complexe routeoptimalisatie;
- live druktemeting;
- apart beheerdersdashboard.

Externe links voor aanmelden, reserveren of bestellen kunnen wél vanuit een programmakaart worden aangeboden.

**Status**  
Definitief

---

## ADR-013 – Programmafilters v1.0

**Besluit**  
De zichtbare filters voor het festival 2026 zijn:
- Onderdeel;
- Locatie;
- Dag.

Categorieën en Tags blijven in Google Sheets en de datastructuur aanwezig en worden op programmakaarten gebruikt, maar zijn in v1.0 niet als zichtbare filters nodig.

**Reden**  
Een compact filterscherm werkt op mobiel beter en deze drie filters zijn voor dit festival voldoende.

**Status**  
Definitief

---

## ADR-014 – Beheerbare Festivalinfo-opmaak

**Besluit**  
Festivalinfo ondersteunt eenvoudige tussenkoppen vanuit Google Sheets via `## Tussenkop` op een eigen regel.

E-mailadressen in Festivalinfo worden klikbaar weergegeven.

**Reden**  
Hiermee blijft de inhoud beheerbaar in Google Sheets zonder een complex opmaaksysteem.

**Status**  
Definitief

---

## ADR-015 – Afbeeldingen

**Besluit**  
Afbeeldingen die via Google Sheets worden geladen, worden bij voorkeur eerst in de Mediabibliotheek van de Berkel-Enschot Bruist-website geplaatst. De URL van de afbeelding wordt vervolgens in Google Sheets opgenomen.

Vaste PWA-afbeeldingen worden in de repository beheerd. Bij vervanging wordt bij voorkeur dezelfde bestandsnaam en verhouding behouden.

**Status**  
Definitief
