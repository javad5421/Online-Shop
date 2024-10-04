function formatNumberWithCommas(value) {
    return new Intl.NumberFormat('en-US').format(value);  // Format with commas
}

function removeCommas(value) {
    return value.replace(/,/g, '');
}

function evaluateSlider(min, max, step){
    var rangeSliders = document.querySelectorAll(".price-slider");
    var minValueDisplays = document.querySelectorAll('.price-range-min');
    var maxValueDisplays = document.querySelectorAll('.price-range-max');

    rangeSliders.forEach(slider =>{
        noUiSlider.create(slider, {
            start: [min, max],  // Initial values for the two handles
            connect: true,    // Connect the handles with a colored bar
            range: {
              'min': min,
              'max': max
            },
            step: step,
            tooltips: [true, true],  // Enable tooltips for both handles
            format: {
                to: function(value) {
                    return parseInt(value);  // Remove decimals
                },
                from: function(value) {
                    return Number(value);
                }
            }
        });

        //update slider base on inputs
        slider.noUiSlider.on('update', function (values) {
            minValueDisplays.forEach(display => {
                display.value = values[0];
            })

            maxValueDisplays.forEach(display => {
                display.value = values[1];
            })
        });
    })

    //update inputs base on slider
    minValueDisplays.forEach(input => {
        input.addEventListener('change', function () {
            rangeSliders.forEach(slider => {
                slider.noUiSlider.set([this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ','), null]);
            })
        })
    })

    maxValueDisplays.forEach(input => {
        input.addEventListener('change', function () {
            rangeSliders.forEach(slider => {
                slider.noUiSlider.set([null, this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')]);
            })
        })
    })

    minValueDisplays.forEach('input', function () {
        this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    })

    maxValueDisplays.forEach('input', function () {
        this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    })
}
document.addEventListener("DOMContentLoaded", function () {
    evaluateSlider(100, 1000000000,10000);
    
});