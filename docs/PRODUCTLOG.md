# Berkel-Enschot Bruist PWA
## Productlog

Dit document beschrijft de ontwikkeling van de PWA vanuit functioneel perspectief. Het is nadrukkelijk geen technische changelog.

**Huidige versie:** v1.0 / R10.00  
**Status:** functioneel afgeronde basisversie

---

# v0.6 – Werkende programmakern

## Doel
Een werkende basisversie van de PWA.

## Opgeleverd
- Google Sheets-koppeling;
- programmaoverzicht;
- zoeken;
- filters;
- detailpagina;
- responsive layout;
- definitief ontwerp van Home.

## Bekende beperkingen op dat moment
- Mijn Bruist nog niet actief;
- Plattegrond nog niet actief;
- offline/updategedrag nog niet afgerond;
- publicatiestatus nog niet toegepast.

## Besluit
De programmakern vormde de stabiele basis voor verdere ontwikkeling.

---

# v0.7 t/m v0.95 – Uitbouw richting festivalversie

De eerder geplande tussenversies zijn tijdens de ontwikkeling niet als afzonderlijke formele releases afgehandeld. De functies zijn stapsgewijs toegevoegd en uiteindelijk samengebracht in v1.0.

## Programma
- publicatiestatus **Definitief** toegepast;
- sortering op datum, tijd en titel;
- zoeken uitgebreid;
- filters verfijnd;
- Tags en Categorieën in datastructuur behouden;
- zichtbare filters uiteindelijk beperkt tot Onderdeel, Locatie en Dag;
- tijdnotatie en ontbrekende eindtijd verbeterd;
- programmakaarten visueel verfijnd;
- optionele externe actieknoppen toegevoegd.

## Mijn Bruist
- persoonlijke selectie geactiveerd;
- lokale opslag;
- overlapwaarschuwing;
- compacte eigen programmakaarten;
- koppeling naar plattegrond.

## Festivalinfo
- praktische informatie als apart hoofdonderdeel;
- overzicht en detailpagina's;
- `## Tussenkop` vanuit Google Sheets;
- klikbare e-mailadressen;
- algemene afbeelding als fallback.

## Plattegrond
- Buiten, Begane grond en Souterrain;
- interactieve locaties;
- activiteiten per locatie;
- koppeling kaart ↔ programmakaart;
- compact locatiepaneel.

## PWA
- installeerbare PWA;
- installatiehulp;
- service worker;
- cache/offline fallback;
- melding **Nieuwe versie beschikbaar**;
- betrouwbaardere updatecontrole.

---

# v1.0 / R10.00 – Functioneel afgeronde basisversie

## Doel
Een stabiele en praktisch beheerbare festival-PWA voor Berkel-Enschot Bruist 2026.

## Opgeleverd
- Home;
- Programma;
- Mijn Bruist;
- Festivalinfo;
- Plattegrond;
- Google Sheets als centrale contentbron;
- mobiele vormgeving;
- installatie als PWA;
- update- en cachemechanisme;
- beheerhandleiding;
- technische/projectdocumentatie;
- repositorydocumentatie voor beheer en verdere ontwikkeling.

## Belangrijkste productbesluiten
- geen accounts;
- geen apart CMS;
- contentbeheer primair via Google Sheets;
- filters voor 2026 beperkt tot Onderdeel, Locatie en Dag;
- categorieën en tags blijven beschikbaar voor toekomstige festivals;
- technische wijzigingen in kleine stappen uitvoeren en testen;
- GitHub is de centrale bron voor code en projectdocumentatie.

## Status
Functioneel afgerond voor v1.0.

De inhoud van het festivalprogramma kan tot en tijdens de voorbereidingsfase via Google Sheets verder worden bijgewerkt zonder dat dit een nieuwe softwareversie hoeft te zijn.

---

# Mogelijke vervolgwensen na v1.0

Alleen oppakken wanneer er een concrete behoefte is:
- evaluatie op basis van gebruik tijdens het festival;
- verdere toegankelijkheidsverbeteringen;
- eventuele aanvullende filters voor een volgend festival;
- verfijning van plattegronden of routeondersteuning;
- eventuele meertaligheid;
- functies die nu bewust buiten scope zijn gehouden.

Uitgangspunt blijft: alleen toevoegen wanneer de meerwaarde opweegt tegen extra beheer en technische complexiteit.
