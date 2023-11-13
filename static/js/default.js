function adjustFooterPosition() {
    const wrapper = document.querySelector('.wrapper');
    const footer = document.querySelector('footer');
    const wrapperHeight = window.getComputedStyle(wrapper).height;
    const windowHeight = window.innerHeight;
    
    if (parseInt(wrapperHeight) < windowHeight) {
        footer.style.position = 'absolute';
        footer.style.bottom = '0';
    } else {
        footer.style.position = 'static';
    }
}

// Call the function on page load and when the window is resized
window.addEventListener('load', adjustFooterPosition);
window.addEventListener('resize', adjustFooterPosition);

let favicon = document.createElement('link')
favicon.rel = 'icon'
favicon.href = '/static/assets/favicon.ico'

document.head.appendChild(favicon)