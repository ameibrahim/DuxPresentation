function toggleFullScreen() {
    const modalElement = document.querySelector('.custom-popup');
  //  adjustContentWrapperHeight('150%');
    if (!document.fullscreenElement) {
        modalElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}
function createFullScreenButton() {
    const button = document.createElement('button');
    button.classList.add('fullscreen-button');
    button.onclick = toggleFullScreen;
    return button;
}