# CHANGELOG

## v1.0 / R10.00 — functioneel afgeronde basisversie

### Programma
- Sortering op datum, starttijd en titel.
- Zoekfunctie uitgebreid naar titel, omschrijving, categorie, festivalonderdeel, locatie, dag/datum en tags.
- Programmafilters vereenvoudigd naar Onderdeel, Locatie en Dag.
- Categorieën en Tags blijven in de datastructuur beschikbaar voor later gebruik.
- Compactere filterweergave voor mobiel.
- Tijdweergave genormaliseerd naar `00:00`.
- Bij ontbrekende eindtijd wordt alleen de begintijd getoond.
- Programmakaarten en detailweergave verder verfijnd.
- Optionele externe actieknoppen toegevoegd voor aanmelden, reserveren of bestellen.
- Actieknoppen sluiten qua accentkleur aan op de programmakaart.

### Mijn Bruist
- Persoonlijke selectie van programmaonderdelen.
- Programmakaarten in Mijn Bruist verfijnd.
- Omschrijving en externe actieknoppen toegevoegd waar van toepassing.
- Overlapwaarschuwing behouden.
- Koppeling naar de juiste locatie op de plattegrond.
- Koppeling vanuit locatie/kaart terug naar de volledige programmakaart.

### Festivalinfo
- Festivalinfo-overzicht en detailpagina's visueel verfijnd.
- Ondersteuning toegevoegd voor `## Tussenkop` vanuit Google Sheets.
- Automatische klikbare e-mailadressen toegevoegd.
- Algemene Festivalinfo-afbeelding als fallback wanneer een detailitem geen eigen afbeelding heeft.

### Plattegrond
- Drie kaartlagen: Buiten, Begane grond en Souterrain.
- Locatiemarkers en locatiekeuze verfijnd.
- Compact locatiepaneel met activiteiten per locatie.
- Tijdweergave in activiteitenlijst verbeterd.
- Doorklik vanuit activiteit naar volledige programmakaart.
- Link `Bekijk alle activiteiten op deze locatie ›` compacter en visueel rustiger gemaakt.

### Home en PWA
- Home visueel afgerond.
- Compacte installatiekaart toegevoegd voor mobiele bezoekers wanneer installatie relevant is.
- Installatiekaart verdwijnt wanneer de PWA geïnstalleerd is.
- Updatebanner `Nieuwe versie beschikbaar` toegevoegd.
- Service-worker-updatecontrole bij terugkeer naar de app en periodiek.
- Cachestrategie aangepast: app-code network-first met offline fallback.
- Afbeeldingen blijven efficiënt cachebaar.

### Beheer en documentatie
- Google Sheets blijft de centrale bron voor programma- en festivalinformatie.
- Beheerconventies voor tijden, afbeeldingen, actieknoppen en `## Tussenkop` vastgelegd.
- Beheerhandleiding en technische/projectdocumentatie opgesteld.

## v0.6 / R06.00
- Relationele gegevenslaag toegevoegd.
- Categorieën, Festivalonderdelen, Locaties en Organisaties gekoppeld.
- Kleuren uit Google Sheets toegepast.
- Adres en organisatienaam toegevoegd.

## v0.5.1 / R05.01
- Correctie Wis filters.
