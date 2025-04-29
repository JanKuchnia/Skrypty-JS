document.addEventListener('DOMContentLoaded', function() {
    const elementyDoSprawdzenia = [
        'gra-pole', 'wynik', 'gra-wiadomosc', 
        'pozostaly-czas', 'trafienia', 'pudla', 'wypelnienie-wody'
    ];
    
    const brakujaceElementy = [];
    elementyDoSprawdzenia.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            brakujaceElementy.push(id);
        }
    });
     
    if (brakujaceElementy.length > 0) {
        alert(`Inicjalizacja gry nie powiodła się. Brakujące elementy HTML: ${brakujaceElementy.join(', ')}`);
        return;
    }
    
    let graAktywna = false;
    let odliczanieAktywne = false;
    let wynik = 0;
    let trafienia = 0;
    let pudla = 0;
    let pozostalyCzas = 30;
    let interwalCelu;
    let interwalGry;
    let interwalCzasu;
    let interwalOdliczania;
    let poziomWody = 100;
    let czasOstatniegoPojawieniaCelu = 0;

    const polGry = document.getElementById('gra-pole');
    const wyswietlaczWyniku = document.getElementById('wynik');
    const wiadomoscGry = document.getElementById('gra-wiadomosc');
    const wyswietlaczPozostalyCzas = document.getElementById('pozostaly-czas');
    const wyswietlaczTrafien = document.getElementById('trafienia');
    const wyswietlaczPudel = document.getElementById('pudla');
    const wypelnienieWody = document.getElementById('wypelnienie-wody');
    
    wiadomoscGry.textContent = 'Kliknij gdziekolwiek lub naciśnij spację, aby rozpocząć.';
    
    try {
        document.addEventListener('keydown', function(e) {
            if (e.code == 'Space' && !graAktywna && !odliczanieAktywne) {
                try {
                    rozpocznijOdliczanie();
                } catch (blad) {
                    alert('Błąd podczas rozpoczynania odliczania: ' + blad.message);
                }
            }
        });
    } catch (blad) {
    }
    
    try {
        polGry.addEventListener('click', function(e) {
            if (graAktywna) {
                try {
                    obsluzPudlo(e);
                } catch (blad) {
                }
            }
        });
    } catch (blad) {
    }

    polGry.addEventListener('click', function(e) {
        if (!graAktywna && !odliczanieAktywne) {
            try {
                rozpocznijOdliczanie();
            } catch (blad) {
                alert('Błąd podczas rozpoczynania odliczania: ' + blad.message);
            }
        }
    });

    function rozpocznijOdliczanie() {
        if (graAktywna || odliczanieAktywne) return;
        
        odliczanieAktywne = true;
        let odliczanie = 3;
        wiadomoscGry.textContent = `Gra rozpocznie się za ${odliczanie}...`;
        
        interwalOdliczania = setInterval(function() {
            odliczanie--;
            if (odliczanie > 0) {
                wiadomoscGry.textContent = `Gra rozpocznie się za ${odliczanie}...`;
            } else {
                clearInterval(interwalOdliczania);
                odliczanieAktywne = false;
                rozpocznijGre();
            }
        }, 1000);
    }

    function rozpocznijGre() {
        if (graAktywna) {
            return;
        }
        
        try {
            graAktywna = true;
            wynik = 0;
            trafienia = 0;
            pudla = 0;
            pozostalyCzas = 30;
            poziomWody = 100;
            
            wyswietlaczWyniku.textContent = wynik;
            wyswietlaczPozostalyCzas.textContent = pozostalyCzas;
            wyswietlaczTrafien.textContent = trafienia;
            wyswietlaczPudel.textContent = pudla;
            wypelnienieWody.style.transform = `scaleX(${poziomWody / 100})`;
            wiadomoscGry.textContent = 'Łap postacie i oblewaj je wodą!';
            
            polGry.innerHTML = '';
            
            interwalCelu = setInterval(function() {
                try {
                    stworzCel();
                } catch (blad) {
                }
            }, 1200);
            
            interwalCzasu = setInterval(function() {
                try {
                    aktualizujCzas();
                } catch (blad) {
                }
            }, 1000);
            
            interwalGry = setTimeout(function() {
                try {
                    zakonczGre();
                } catch (blad) {
                }
            }, 30000);
        } catch (blad) {
            graAktywna = false;
            wiadomoscGry.textContent = 'Błąd podczas uruchamiania gry: ' + blad.message;
        }
    }

    function aktualizujCzas() {
        pozostalyCzas--;
        wyswietlaczPozostalyCzas.textContent = pozostalyCzas;
        
        if (pozostalyCzas <= 0) {
            clearInterval(interwalCzasu);
        }
    }

    function stworzCel() {
        if (!graAktywna) {
            return;
        }
        
        try {
            const postac = document.createElement('div');
            postac.className = 'gra-postac';
            
            const maksymalnaSzerokoscPostaci = 60; 
            const maksymalnaWysokoscPostaci = 90;
            const maksX = polGry.clientWidth - maksymalnaSzerokoscPostaci; 
            const maksY = polGry.clientHeight - maksymalnaWysokoscPostaci; 
            
            if (maksX <= 0 || maksY <= 0) {
                console.warn("Pole gry zbyt małe, aby stworzyć cel.");
                return; 
            }
            
            const losoweX = Math.floor(Math.random() * maksX);
            const losoweY = Math.floor(Math.random() * maksY);
            
            postac.style.left = `${losoweX}px`;
            postac.style.top = `${losoweY}px`;
            
            czasOstatniegoPojawieniaCelu = Date.now();
            postac.dataset.czasPojawienia = czasOstatniegoPojawieniaCelu;
            
            postac.addEventListener('click', (e) => {
                e.stopPropagation();
                try {
                    obsluzTrafienie(postac, e);
                } catch (blad) {
                    console.error('Błąd w obsluzTrafienie:', blad);
                }
            });
            
            polGry.appendChild(postac);
            
            setTimeout(() => {
                if (postac.parentNode === polGry) { 
                    polGry.removeChild(postac);
                }
            }, 2000);
        } catch (blad) {
            console.error('Błąd w stworzCel:', blad);
        }
    }

    function obsluzTrafienie(postac, zdarzenie) {
        if (!graAktywna) {
            return;
        }
        
        try {
            if (postac.parentNode == polGry) {
                polGry.removeChild(postac);
            }
            
            stworzPluskWody(zdarzenie.clientX, zdarzenie.clientY);
            
            const czasPojawienia = parseInt(postac.dataset.czasPojawienia) || Date.now();
            const obecnyCzas = Date.now();
            const czasOdPojawienia = obecnyCzas - czasPojawienia;
            
            const maksymalnePunkty = 100;
            const minimalnePunkty = 10;
            const procentCzasu = Math.min(1, czasOdPojawienia / 2000);
            const punktyDoDodania = Math.round(maksymalnePunkty - (maksymalnePunkty - minimalnePunkty) * (procentCzasu * procentCzasu));
            
            wynik += punktyDoDodania;
            trafienia++;
            wyswietlaczWyniku.textContent = wynik;
            wyswietlaczTrafien.textContent = trafienia;
            
            pokazDodanePunkty(zdarzenie.clientX, zdarzenie.clientY, punktyDoDodania, procentCzasu);
            
            poziomWody = Math.max(0, poziomWody - 2);
            wypelnienieWody.style.transform = `scaleX(${poziomWody / 100})`;
            
            if (poziomWody <= 0) {
                zakonczGre();
            }
        } catch (blad) {
        }
    }
    
    function pokazDodanePunkty(x, y, punkty, procentCzasu) {
        try {
            const elementPunktow = document.createElement('div');
            elementPunktow.className = 'punkty-dodane';
            elementPunktow.textContent = `+${punkty}`;
            
            if (procentCzasu < 0.2) {
                elementPunktow.style.color = '#5ad65a';
                elementPunktow.style.fontSize = '24px';
            } else if (procentCzasu < 0.5) {
                elementPunktow.style.color = '#4a90e2';
                elementPunktow.style.fontSize = '22px';
            } else if (procentCzasu < 0.8) {
                elementPunktow.style.color = '#e6a23c';
                elementPunktow.style.fontSize = '20px';
            } else {
                elementPunktow.style.color = '#f56c6c';
                elementPunktow.style.fontSize = '18px';
            }
            
            const prostokątPola = polGry.getBoundingClientRect();
            
            elementPunktow.style.left = `${x - prostokątPola.left}px`;
            elementPunktow.style.top = `${y - prostokątPola.top - 30}px`;
            
            polGry.appendChild(elementPunktow);
            
            setTimeout(() => {
                elementPunktow.style.opacity = '0';
                elementPunktow.style.transform = 'translateY(-20px)';
            }, 50);
            
            setTimeout(() => {
                if (elementPunktow.parentNode == polGry) {
                    polGry.removeChild(elementPunktow);
                }
            }, 1000);
        } catch (blad) {
        }
    }

    function obsluzPudlo(zdarzenie) {
        if (!graAktywna) {
            return;
        }
        
        try {
            if (zdarzenie.target == polGry) {
                stworzPluskWody(zdarzenie.clientX, zdarzenie.clientY);
                
                pudla++;
                wyswietlaczPudel.textContent = pudla;
                
                wynik = Math.max(0, wynik - 10);
                wyswietlaczWyniku.textContent = wynik;
                
                poziomWody = Math.max(0, poziomWody - 5);
                wypelnienieWody.style.transform = `scaleX(${poziomWody / 100})`;
                
                if (poziomWody <= 0) {
                    zakonczGre();
                }
            }
        } catch (blad) {
        }
    }

    function stworzPluskWody(x, y) {
        try {
            const plusk = document.createElement('div');
            plusk.className = 'woda-plusk';
            
            if (window.innerWidth <= 600) {
                plusk.style.width = '80px';
                plusk.style.height = '80px';
            }
            
            const prostokątPola = polGry.getBoundingClientRect();
            
            plusk.style.left = `${x - prostokątPola.left - 50}px`;
            plusk.style.top = `${y - prostokątPola.top - 50}px`;
            
            polGry.appendChild(plusk);
            
            setTimeout(() => {
                if (plusk.parentNode == polGry) {
                    polGry.removeChild(plusk);
                }
            }, 500);
        } catch (blad) {
        }
    }

    window.addEventListener('resize', function() {
        if (graAktywna) {
            wypelnienieWody.style.transform = `scaleX(${poziomWody / 100})`;
        }
    });

    function zakonczGre() {
        try {
            graAktywna = false;
            
            clearInterval(interwalCelu);
            clearInterval(interwalCzasu);
            clearTimeout(interwalGry);
            
            let wiadomosc = '';
            if (poziomWody <= 0) {
                wiadomosc = `Koniec wody! Twój wynik: ${wynik}`;
            } else {
                wiadomosc = `Koniec czasu! Twój wynik: ${wynik}`;
            }
            
            wiadomoscGry.textContent = wiadomosc;
            
            setTimeout(() => {
                wiadomoscGry.textContent += ' Kliknij lub naciśnij spację, aby zagrać ponownie.';
            }, 2000);
            
            setTimeout(() => {
                polGry.innerHTML = '';
            }, 1000);
        } catch (blad) {
        }
    }
});

console.log('Skrypt Lany Poniedziałek został załadowany');