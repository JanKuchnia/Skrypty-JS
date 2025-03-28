function przelaczMenu() {
    const menuKontener = document.querySelector('.menu-kontener');
    menuKontener.classList.toggle('aktywny');
}

function przelaczPodmenu(element) {
    if (window.innerWidth < 768) {
        element.classList.toggle('aktywny');
    }
}

document.addEventListener('click', function(zdarzenie) {
    const menuKontener = document.querySelector('.menu-kontener');
    const hamburgerMenu = document.querySelector('.hamburger-menu');

    if (!menuKontener.contains(zdarzenie.target) &&
    !hamburgerMenu.contains(zdarzenie.target)) {
        menuKontener.classList.remove('aktywny');
        document.querySelectorAll('.rozwijane-menu').forEach(menu => {
            menu.classList.remove('aktywny');
        });
    }
});
