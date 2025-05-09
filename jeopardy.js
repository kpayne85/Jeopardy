function addAutoResizer(element) {
    window.addEventListener('resize', () => {
        const x = window.visualViewport.width;
        const y = window.visualViewport.height;
        element.style.width = `${x}px`;
        element.style.height = `${y}px`;
    });
}

const gameArea = gameAreaFactory();
const startpage = startPageFactory();
