const konfiguracjaGry = {
    poczatkowyCzas: 60,
    punktyZaPoprawneZamowienie: 10,
    progAwansuPoziom: 50,
    zmniejszenieCzasuPoziom: 5,
    minCzas: 30
};

let stanGry = {
    punkty: 0,
    poziom: 1,
    pozostalyCzas: konfiguracjaGry.poczatkowyCzas,
    jestGraAktywna: false,
    aktualneZamowienie: null,
    elementyTalerza: [],
    czasomierz: null
};

const produktySpozywcze = {
    kielbasa: ["Włoska", "Polska", "Bratwurst", "Chorizo", "Frankfurter"],
    sos: ["Ketchup", "Musztarda", "Majonez", "BBQ", "Ostry"],
    pieczywo: ["Bułka", "Bajgiel", "Precel", "Ciabatta"]
};

const elementy = {
    przyciskStart: document.getElementById("przycisk-start"),
    aktualneZamowienie: document.getElementById("aktualne-zamowienie"),
    elementyTalerza: document.getElementById("elementy-talerza"),
    wartoscCzasu: document.getElementById("wartosc-czasu"),
    wartoscPoziomu: document.getElementById("wartosc-poziomu"),
    wartoscWyniku: document.getElementById("wartosc-wyniku"),
    pasekCzasomierza: document.getElementById("pasek-czasomierza"),
    informacjaZwrotna: document.getElementById("informacja-zwrotna"),
    koniecGry: document.getElementById("koniec-gry"),
    wiadomoscKoniecGry: document.getElementById("wiadomosc-koniec-gry"),
    przyciskWyczysc: document.getElementById("przycisk-wyczysc"),
    przyciskPodaj: document.getElementById("przycisk-podaj")
};

function rozpocznijGre() {
    if (stanGry.jestGraAktywna) return;
    
    stanGry.poziom = 1;
    stanGry.punkty = 0;
    stanGry.pozostalyCzas = konfiguracjaGry.poczatkowyCzas;
    stanGry.jestGraAktywna = true;
    stanGry.elementyTalerza = [];
    
    aktualizujUI();
    
    wygenerujZamowienie();

    rozpocznijCzasomierz();

    elementy.przyciskStart.textContent = "Gra w toku...";
    elementy.przyciskStart.disabled = true;
    elementy.koniecGry.style.display = "none";
}

function wygenerujZamowienie() {
    wyczyscTalerz();
    
    const iloscKielbas = Math.min(Math.ceil(stanGry.poziom / 2), 2);
    const iloscSosow = Math.min(Math.ceil(stanGry.poziom / 2), 3);
    const iloscPieczywa = 1; 
    
    const zamowienieKielbasy = pobierzLosoweElementy(produktySpozywcze.kielbasa, iloscKielbas);
    const zamowienieSosy = pobierzLosoweElementy(produktySpozywcze.sos, iloscSosow);
    const zamowieniePieczywo = pobierzLosoweElementy(produktySpozywcze.pieczywo, iloscPieczywa);
    
    stanGry.aktualneZamowienie = {
        kielbasa: zamowienieKielbasy,
        sos: zamowienieSosy,
        pieczywo: zamowieniePieczywo
    };
    
    wyswietlZamowienie();
}

function pobierzLosoweElementy(tablica, ilosc) {
    const potasowana = [...tablica].sort(() => 0.5 - Math.random());
    return potasowana.slice(0, ilosc);
}

function wyswietlZamowienie() {
    if (!stanGry.aktualneZamowienie) return;
    
    let zamowienieHTML = `<h3>Zamówienie:</h3><ul>`;
    
    stanGry.aktualneZamowienie.kielbasa.forEach(kielbasa => {
        zamowienieHTML += `<li>🌭 Kiełbasa: ${kielbasa}</li>`;
    });
    
    stanGry.aktualneZamowienie.sos.forEach(sos => {
        zamowienieHTML += `<li>${pobierzEmojiSosu(sos)} Sos: ${sos}</li>`;
    });

    stanGry.aktualneZamowienie.pieczywo.forEach(pieczywo => {
        zamowienieHTML += `<li>${pobierzEmojiPieczywa(pieczywo)} Pieczywo: ${pieczywo}</li>`;
    });
    
    zamowienieHTML += `</ul>`;
    elementy.aktualneZamowienie.innerHTML = zamowienieHTML;
}

function pobierzEmojiSosu(sos) {
    const emoji = {
        "Ketchup": "🟥",
        "Musztarda": "🟨",
        "Majonez": "⬜",
        "BBQ": "🟫",
        "Ostry": "🔴"
    };
    
    return emoji[sos] || "";
}

// Pobierz emoji pieczywa
function pobierzEmojiPieczywa(pieczywo) {
    const emoji = {
        "Bułka": "🍞",
        "Bajgiel": "🥯",
        "Precel": "🥨",
        "Ciabatta": "🥖"
    };
    
    return emoji[pieczywo] || "";
}

function dodajDoTalerza(typ, nazwa) {
    if (!stanGry.jestGraAktywna) return;

    stanGry.elementyTalerza.push({ typ, nazwa });
    
    aktualizujWyswietlaczTalerza();

    dodajEfektGrilla();
}

function aktualizujWyswietlaczTalerza() {
    elementy.elementyTalerza.innerHTML = "";
    
    stanGry.elementyTalerza.forEach((element, indeks) => {
        const elementTalerza = document.createElement("div");
        elementTalerza.className = "element-talerza";
        
        let emoji = "";
        if (element.typ === "sausage") emoji = "🌭";
        else if (element.typ === "sauce") emoji = pobierzEmojiSosu(element.nazwa);
        else if (element.typ === "bread") emoji = pobierzEmojiPieczywa(element.nazwa);
        
        elementTalerza.innerHTML = `
            ${emoji} <span>${element.nazwa}</span>
            <button class="usun-element" onclick="usunZTalerza(${indeks})">×</button>
        `;
        
        elementy.elementyTalerza.appendChild(elementTalerza);
    });
}

function usunZTalerza(indeks) {
    if (!stanGry.jestGraAktywna) return;
    
    stanGry.elementyTalerza.splice(indeks, 1);
    aktualizujWyswietlaczTalerza();
}

function wyczyscTalerz() {
    if (!stanGry.jestGraAktywna) return;
    
    stanGry.elementyTalerza = [];
    aktualizujWyswietlaczTalerza();
}

function podajZamowienie() {
    if (!stanGry.jestGraAktywna || !stanGry.aktualneZamowienie) return;
    
    const jestPoprawne = sprawdzZamowienie();
    
    if (jestPoprawne) {
        stanGry.punkty += konfiguracjaGry.punktyZaPoprawneZamowienie;

        pokazInformacjeZwrotna("Poprawne zamówienie! +10 punktów", "sukces");
        
        sprawdzAwansPoziom();
        
        wygenerujZamowienie();
        
        dodajAnimacjePunktow(konfiguracjaGry.punktyZaPoprawneZamowienie);
    } else {
        pokazInformacjeZwrotna("Niepoprawne zamówienie! Spróbuj ponownie", "porazka");
    }

    aktualizujUI();
}

function sprawdzZamowienie() {
    const zamowienie = stanGry.aktualneZamowienie;
    const talerz = stanGry.elementyTalerza;
    
    const mapaTypow = {
        "sausage": "kielbasa",
        "sauce": "sos",
        "bread": "pieczywo"
    };
    
    const talerzTypyPolskie = talerz.map(item => ({
        typ: mapaTypow[item.typ] || item.typ,
        nazwa: item.nazwa
    }));
    
    const licznikZamowienia = zliczElementyZamowienia(zamowienie);
    const licznikTalerza = zliczElementyTalerza(talerzTypyPolskie);

    for (const typ in licznikZamowienia) {
        for (const nazwa in licznikZamowienia[typ]) {
            if (!licznikTalerza[typ] || licznikTalerza[typ][nazwa] !== licznikZamowienia[typ][nazwa]) {
                return false;
            }
        }
    }
    
    for (const typ in licznikTalerza) {
        for (const nazwa in licznikTalerza[typ]) {
            if (!licznikZamowienia[typ] || !licznikZamowienia[typ][nazwa]) {
                return false;
            }
        }
    }
    
    return true;
}

function zliczElementyZamowienia(zamowienie) {
    const licznik = {};
    
    for (const typ in zamowienie) {
        licznik[typ] = {};
        zamowienie[typ].forEach(nazwa => {
            licznik[typ][nazwa] = (licznik[typ][nazwa] || 0) + 1;
        });
    }
    
    return licznik;
}

function zliczElementyTalerza(talerz) {
    const licznik = {};
    
    talerz.forEach(element => {
        if (!licznik[element.typ]) licznik[element.typ] = {};
        licznik[element.typ][element.nazwa] = (licznik[element.typ][element.nazwa] || 0) + 1;
    });
    
    return licznik;
}

function sprawdzAwansPoziom() {
    if (stanGry.punkty >= stanGry.poziom * konfiguracjaGry.progAwansuPoziom) {
        stanGry.poziom++;
        
        const nowyCzas = konfiguracjaGry.poczatkowyCzas - ((stanGry.poziom - 1) * konfiguracjaGry.zmniejszenieCzasuPoziom);
        stanGry.pozostalyCzas = Math.max(nowyCzas, konfiguracjaGry.minCzas);

        pokazInformacjeZwrotna(`Poziom ${stanGry.poziom}! Nowe wyzwanie!`, "sukces");
    }
}

function pokazInformacjeZwrotna(wiadomosc, typ) {
    elementy.informacjaZwrotna.textContent = wiadomosc;
    elementy.informacjaZwrotna.className = `informacja-zwrotna ${typ}`;
    elementy.informacjaZwrotna.style.opacity = 1;
    
    setTimeout(() => {
        elementy.informacjaZwrotna.style.opacity = 0;
    }, 2000);
}

function rozpocznijCzasomierz() {
    if (stanGry.czasomierz) clearInterval(stanGry.czasomierz);
    
    stanGry.czasomierz = setInterval(() => {
        stanGry.pozostalyCzas--;
        
        aktualizujWyswietlaczCzasomierza();
        
        if (stanGry.pozostalyCzas <= 0) {
            zakonczGre();
        }
    }, 1000);
}


function aktualizujWyswietlaczCzasomierza() {
    elementy.wartoscCzasu.textContent = stanGry.pozostalyCzas;
    

    const procent = (stanGry.pozostalyCzas / konfiguracjaGry.poczatkowyCzas) * 100;
    elementy.pasekCzasomierza.style.width = `${procent}%`;
    

    if (stanGry.pozostalyCzas <= 10) {
        elementy.pasekCzasomierza.style.backgroundColor = "var(--maj-czerwony)"; 
    } else if (stanGry.pozostalyCzas <= 20) {
        elementy.pasekCzasomierza.style.backgroundColor = "var(--maj-ciemnypomaranczowy)"; 
    } else {
        elementy.pasekCzasomierza.style.backgroundColor = "var(--maj-pomaranczowy)"; 
    }
}


function zakonczGre() {
    clearInterval(stanGry.czasomierz);
    stanGry.jestGraAktywna = false;
    
    elementy.koniecGry.style.display = "flex";
    elementy.wiadomoscKoniecGry.textContent = `Twój wynik: ${stanGry.punkty} punktów! Osiągnięty poziom: ${stanGry.poziom}`;
    
    elementy.przyciskStart.textContent = "Start";
    elementy.przyciskStart.disabled = false;
}

function aktualizujUI() {
    elementy.wartoscWyniku.textContent = stanGry.punkty;
    elementy.wartoscPoziomu.textContent = stanGry.poziom;
    elementy.wartoscCzasu.textContent = stanGry.pozostalyCzas;
    aktualizujWyswietlaczCzasomierza();
}

function dodajEfektGrilla() {
    const efekt = document.createElement("div");
    efekt.className = "efekt-grilla";

    const talerz = elementy.elementyTalerza.parentElement;
    const prostokat = talerz.getBoundingClientRect();
    
    const x = Math.random() * (prostokat.width - 80);
    const y = Math.random() * (prostokat.height - 80);
    
    efekt.style.left = `${x}px`;
    efekt.style.top = `${y}px`;
    
    talerz.appendChild(efekt);
    
    setTimeout(() => {
        efekt.remove();
    }, 500);
}

function dodajAnimacjePunktow(punkty) {
    const elementPunktow = document.createElement("div");
    elementPunktow.className = "punkty-dodane";
    elementPunktow.textContent = `+${punkty}`;
    elementPunktow.style.left = "50%";
    elementPunktow.style.top = "50%";
    elementPunktow.style.transform = "translate(-50%, -50%)";
    
    document.body.appendChild(elementPunktow);
    
    setTimeout(() => {
        elementPunktow.style.transform = "translate(-50%, -100px)";
        elementPunktow.style.opacity = 0;
    }, 100);
    
    setTimeout(() => {
        elementPunktow.remove();
    }, 1000);
}

window.usunZTalerza = usunZTalerza;

document.addEventListener("DOMContentLoaded", () => {
    elementy.przyciskStart.addEventListener("click", rozpocznijGre);
    
    elementy.przyciskWyczysc.addEventListener("click", wyczyscTalerz);
    
    elementy.przyciskPodaj.addEventListener("click", podajZamowienie);
    
    const przyciskiJedzenia = document.querySelectorAll(".przycisk-jedzenia");
    przyciskiJedzenia.forEach(przycisk => {
        przycisk.addEventListener("click", () => {
            const typ = przycisk.getAttribute("data-type");
            const nazwa = przycisk.getAttribute("data-name");
            dodajDoTalerza(typ, nazwa);
        });
    });
});