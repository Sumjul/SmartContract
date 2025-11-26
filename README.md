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

## Sekos diagrama

Ši seka pavaizduoja decentralizuotos loterijos BlockchainLottery procesą tarp trijų pagrindinių dalyvių: Dalyvis (Participant), Organizatorius (Organizer), Išmanioji sutartis (SmartContract). Diagrama apima visą loterijos ciklą — nuo paskelbimo iki užbaigimo.

**Diagramoje pavaizduoti tokie etapai:**

1. **Loterijos paruošimas.**
Organizatorius paskelbia naują loteriją, sutartis aktyvuojama, dalyviai gali tikrinti jos būseną.

2. **Dalyvių sąveika.** Dalyviai siunčia bilieto mokėjimą, sutartis registruoja bilietus ir patvirtina dalyvavimą.

3. **Pasiruošimas traukimui.** Organizatorius tikrina, ar surinkta pakankamai bilietų, ir inicijuoja loterijos pradžią.

4. **Laimėtojo išrinkimas.** Išmanioji sutartis atsitiktinai parenka laimėtoją ir perduoda apie tai informaciją tiek privačiai pačiam laimėtojui, tiek viešai.

5. **Išmokėjimas ir užbaigimas.** Laimėtojui pervedamas prizas, loterija archyvuojama ir sistema paruošiama kitam raundui.

---

![Sequence diagram — BlockchainLottery](diagrams/SequenceDiagram.png)

---

Ši diagrama padeda aiškiai suprasti verslo logiką ir tarpusavio sąveikas, kurios bus perkeltos į „Solidity“ išmaniąją sutartį ir decentralizuotą aplikaciją.
