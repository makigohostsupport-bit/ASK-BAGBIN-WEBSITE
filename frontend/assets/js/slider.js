/* =========================================================
   ASK BAGBIN EDUCATION FUND
   HERO SLIDER
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const slides =
        document.querySelectorAll(".hero-slide");

    const dots =
        document.querySelectorAll(".hero-dots button");

    const nextButton =
        document.getElementById("heroNext");

    const prevButton =
        document.getElementById("heroPrev");


    if (!slides.length) {
        return;
    }


    let currentSlide = 0;

    let slideTimer;


    function showSlide(index) {

        if (index >= slides.length) {

            index = 0;

        }

        if (index < 0) {

            index =
                slides.length - 1;

        }


        slides.forEach(function (slide) {

            slide.classList.remove("active");

        });


        dots.forEach(function (dot) {

            dot.classList.remove("active");

        });


        slides[index].classList.add("active");


        if (dots[index]) {

            dots[index].classList.add("active");

        }


        currentSlide = index;

    }


    function nextSlide() {

        showSlide(currentSlide + 1);

    }


    function previousSlide() {

        showSlide(currentSlide - 1);

    }


    function startSlider() {

        clearInterval(slideTimer);

        slideTimer =
            setInterval(
                nextSlide,
                6000
            );

    }


    function resetSlider() {

        startSlider();

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                nextSlide();

                resetSlider();

            }
        );

    }


    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                previousSlide();

                resetSlider();

            }
        );

    }


    dots.forEach(
        function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    showSlide(index);

                    resetSlider();

                }
            );

        }
    );


    showSlide(0);

    startSlider();

});