document.addEventListener('DOMContentLoaded', () => {
    const galleries = {
        lead: Array.from({ length: 12 }, (_, i) => `assets/png/lead/${i + 1}.png`),
        bridal: Array.from({ length: 12 }, (_, i) => `assets/png/bridal/${i + 1}.png`),
        creative: Array.from({ length: 12 }, (_, i) => `assets/png/creative/${i + 1}.png`),
    };

    const filterButtons = document.querySelectorAll('.team-filter-button');
    const sliderTrack = document.querySelector('.slider-track');
    const prevPage = document.querySelector('.slider-page.prev');
    const centerPage = document.querySelector('.slider-page.center');
    const nextPage = document.querySelector('.slider-page.next');
    const prevArrow = document.querySelector('.slider-arrow.prev');
    const nextArrow = document.querySelector('.slider-arrow.next');

    if (!sliderTrack || !prevArrow || !nextArrow) {
        return;
    }

    let currentCategory = 'lead';
    let currentIndex = 0;
    let isAnimating = false;


    const getPageSize = () => {
        const width = window.innerWidth;
        if (width < 768) return 1; 
        if (width < 1024) return 4;
        return 6;                  
    };

    const populatePage = (pageElement, category, startIndex) => {
        pageElement.innerHTML = '';
        const imageSources = galleries[category];
        const pageSize = getPageSize();
        const totalImages = imageSources.length;

        for (let i = 0; i < pageSize; i++) {
            const imageIndex = (startIndex + i + totalImages) % totalImages;
            const img = document.createElement('img');
            img.src = imageSources[imageIndex];
            img.alt = `Мастер ${imageIndex + 1}`;
            pageElement.appendChild(img);
        }
    };

    const updateSliderPages = () => {
        const pageSize = getPageSize();
        populatePage(centerPage, currentCategory, currentIndex);
        populatePage(prevPage, currentCategory, currentIndex - pageSize);
        populatePage(nextPage, currentCategory, currentIndex + pageSize);
    };

    const slideNext = () => {
        if (isAnimating) return;
        isAnimating = true;
        sliderTrack.classList.add('slide-left');

        const pageSize = getPageSize();
        const totalImages = galleries[currentCategory].length;
        currentIndex = (currentIndex + pageSize + totalImages) % totalImages;
    };

    const slidePrev = () => {
        if (isAnimating) return;
        isAnimating = true;
        sliderTrack.classList.add('slide-right');

        const pageSize = getPageSize();
        const totalImages = galleries[currentCategory].length;
        currentIndex = (currentIndex - pageSize + totalImages) % totalImages;
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentCategory = button.dataset.category;
            currentIndex = 0;
            updateSliderPages();

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    nextArrow.addEventListener('click', slideNext);
    prevArrow.addEventListener('click', slidePrev);

    sliderTrack.addEventListener('animationend', () => {
        sliderTrack.classList.remove('slide-left', 'slide-right');

        updateSliderPages();

        isAnimating = false;
    });

    updateSliderPages();
    window.addEventListener('resize', updateSliderPages);
});