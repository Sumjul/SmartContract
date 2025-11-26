# Decentralizuota loterija „BlockchainLottery“

Šiame projekte kuriama išmanioji sutartis ir decentralizuota aplikacija, skirta paprastai decentralizuotai loterijos sistemai Ethereum tinkle.
Modelio tikslas – užtikrinti skaidrų, patikimą ir automatinį laimėtojo parinkimą, naudojant viešąją blokų grandinę.

## Dalyviai

### 1. Organiztorius

- Inicializuoja naują loterijos raundą
- Nustato bileto kainą
- Paleidžia laimėtojo išrinkimo funkciją
- Gali atsiimti nepanaudotas lėšas

### 2. Dalyvis

- Prisijungia prie DApp naudojant MetaMask
- Įsigyja bilietą, sumokėdamas nustatytą bilieto kainą
- Dalyvauja loterijoje ir laukia rezultato

## Verslo logika

1. Organizatorius sukuria naują loteriją ir nustato fiksuotą bilieto kainą.
2. Dalyviai įsigyja bilietus, siųsdami tiksliai bilieto kainos dydžio ETH kiekį į išmaniąją sutartį.
3. Visi dalyviai automatiškai įtraukiami į žaidėjų sąrašą.
4. Kai loterijoje dalyvauja bent X dalyvių, organizatorius aktyvuoja „Draw Winner“ funkciją.
5. Išmanioji sutartis atsitiktinai parenka vieną adresą iš dalyvių sąrašo.
6. Visa surinkta suma pervedama laimėtojui.
7. Loterija nustatoma į pradinę būseną ir gali būti pradedama iš naujo.
