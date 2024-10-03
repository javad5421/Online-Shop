document.addEventListener("DOMContentLoaded", function () {
    var rangeSliders = document.querySelectorAll(".price-slider");
    var minValueDisplays = document.querySelectorAll('.price-range-min');
    var maxValueDisplays = document.querySelectorAll('.price-range-max');

    const maxValue = 100;
    const minValue = 0;

    rangeSliders.forEach(slider =>{
        noUiSlider.create(slider, {
            start: [20, 80],  // Initial values for the two handles
            connect: true,    // Connect the handles with a colored bar
            range: {
              'min': 0,
              'max': 100
            },
            step: 1
        });

        slider.noUiSlider.on('update', function (values) {
            minValueDisplays.forEach(display => {
                display.value = values[0];
            })

            maxValueDisplays.forEach(display => {
                display.value = values[1];
            })
        });
    })
});