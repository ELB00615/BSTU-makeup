document.addEventListener('DOMContentLoaded', () => {
    const calculatorForm = document.querySelector('.calc-controls');
    if (!calculatorForm) return;

    const PRICES = {
        makeup: {
            daytime: 90,
            evening: 120,
            bridal: 180,
            lifting: 100,
        },
        brows: {
            'brow-correction': 45,
            'brow-lamination': 70,
            'lash-lamination': 75,
        },
        training: {
            'course-self': 250,
            'private-lesson': 150,
            'pro-course': 1200,
        },
        extras: {
            trial: 100, 
            'on-site': 80 
        },
        discountThreshold: 3,
        discountPercentage: 0.1
    };
    
    const NAMES = {
        daytime: 'Дневной макияж',
        evening: 'Вечерний макияж',
        bridal: 'Свадебный макияж',
        lifting: 'Лифтинг-макияж',
        'brow-correction': 'Коррекция и окрашивание бровей',
        'brow-lamination': 'Укладка бровей',
        'lash-lamination': 'Ламинирование ресниц',
        'course-self': 'Курс "Макияж для себя"',
        'private-lesson': 'Индивидуальное занятие',
        'pro-course': 'Проф. базовый курс',
        trial: 'Репетиция образа',
        'on-site': 'Выезд на локацию'
    };

    const categorySelect = document.getElementById('serviceCategory');
    const serviceOptionBlocks = document.querySelectorAll('.service-options');
    const serviceInputs = document.querySelectorAll('input[name="service"]');
    const extrasInputs = document.querySelectorAll('input[name="extras"]');
    
    const totalPriceEl = document.getElementById('totalPrice');
    const summaryDetailsEl = document.querySelector('.summary-details');

    const calculateTotal = () => {
        let total = 0;
        let servicesCount = 0;
        
        const currentCategory = categorySelect.value;

        serviceInputs.forEach(input => {
            if (input.checked) {
                const serviceValue = input.value;
                if (PRICES[currentCategory] && PRICES[currentCategory][serviceValue]) {
                    total += PRICES[currentCategory][serviceValue];
                    servicesCount++;
                }
            }
        });

        extrasInputs.forEach(input => {
            if (input.checked) {
                total += PRICES.extras[input.value];
            }
        });
        
        if (servicesCount >= PRICES.discountThreshold) {
            total *= (1 - PRICES.discountPercentage);
        }

        return total;
    };

    const updateUI = () => {
        const total = calculateTotal();
        totalPriceEl.textContent = Math.round(total);
        
        summaryDetailsEl.innerHTML = '';
        let servicesCount = 0;

        const currentCategory = categorySelect.value;
        const selectedServices = Array.from(serviceInputs)
            .filter(i => i.checked && PRICES[currentCategory]?.[i.value])
            .map(i => NAMES[i.value] || 'Услуга');
        
        if (selectedServices.length > 0) {
            summaryDetailsEl.innerHTML += `<p>Услуги: <span>${selectedServices.join(', ')}</span></p>`;
            servicesCount = selectedServices.length;
        }
        
        const selectedExtras = Array.from(extrasInputs)
            .filter(i => i.checked)
            .map(i => NAMES[i.value] || 'Доп. опция');
        
        if (selectedExtras.length > 0) {
            summaryDetailsEl.innerHTML += `<p>Доп. опции: <span>${selectedExtras.join(', ')}</span></p>`;
        }
        
        if (servicesCount >= PRICES.discountThreshold) {
            summaryDetailsEl.innerHTML += `<p class="discount">Скидка за комплекс: <span>${PRICES.discountPercentage * 100}%</span></p>`;
        }
    };

    const handleCategoryChange = () => {
        const selectedCategory = categorySelect.value;
        
        serviceOptionBlocks.forEach(block => {
            block.classList.add('hidden');
        });
        
        serviceInputs.forEach(input => input.checked = false);
        
        const blockToShow = document.getElementById(`${selectedCategory}-options`);
        if (blockToShow) {
            blockToShow.classList.remove('hidden');
        }
        
        updateUI();
    };

    calculatorForm.addEventListener('input', updateUI);
    categorySelect.addEventListener('change', handleCategoryChange);

    handleCategoryChange();
});