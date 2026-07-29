const fs = require('fs');

const css = `
/* =========================================
   PROJECT PREVIEW POPUPS (HOVER STYLES)
   ========================================= */

/* Common popup container */
.project-preview-popup {
    pointer-events: none; /* Let hover pass through to the card */
    z-index: 100;
}

.popup-content {
    background: rgba(23, 44, 74, 0.95); /* Dark blue */
    color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    max-width: 350px;
    text-align: left;
}

.popup-subtitle {
    font-weight: 300;
    font-size: 1rem;
    margin: 0;
    color: #fff;
}

.popup-title {
    font-weight: 700;
    font-size: 1.5rem;
    margin: 5px 0 15px 0;
    color: var(--color-light-blue);
}

.popup-line {
    width: 40px;
    height: 2px;
    background: white;
    margin-bottom: 15px;
}

.popup-text {
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 20px;
    color: #eee;
}

.popup-cta {
    display: inline-block;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--color-light-blue);
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* Base states for the 3 options */
.hover-style-a .project-preview-popup,
.hover-style-b .project-preview-popup {
    position: fixed;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.hover-style-c {
    overflow: hidden; /* Important for slide-up */
}
.hover-style-c .project-preview-popup {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.hover-style-c .popup-content {
    background: linear-gradient(to top, rgba(23,44,74,1) 0%, rgba(23,44,74,0.8) 70%, transparent 100%);
    border-radius: 0;
    box-shadow: none;
    max-width: none;
    padding-top: 4rem;
}


/* Option A: Center Soft */
.hover-style-a .project-preview-popup {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -40%); /* slight offset for animation */
}
.hover-style-a:hover .project-preview-popup {
    opacity: 1;
    transform: translate(-50%, -50%);
}

/* Option B: Toast Bottom Right */
.hover-style-b .project-preview-popup {
    bottom: 20px;
    right: 20px;
    transform: translateY(20px);
}
.hover-style-b:hover .project-preview-popup {
    opacity: 1;
    transform: translateY(0);
}

/* Option C: Slide Up */
.hover-style-c:hover .project-preview-popup {
    transform: translateY(0);
}

`;

fs.appendFileSync('public/css/style.css', css);
console.log('CSS appended.');
