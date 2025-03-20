document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");

    const handleScroll = () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight) {
                section.classList.add('fade-in-up');
            }
        });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call initially to load animations
});
