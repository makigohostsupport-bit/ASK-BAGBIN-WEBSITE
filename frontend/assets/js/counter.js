/* =========================================================
   ASK BAGBIN EDUCATION FUND
   IMPACT COUNTERS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const counters =
        document.querySelectorAll(".counter");


    if (!counters.length) {
        return;
    }


    let started = false;


    function animateCounters() {

        if (started) {
            return;
        }


        const statsSection =
            document.querySelector(".stats-section");


        if (!statsSection) {
            return;
        }


        const sectionTop =
            statsSection.getBoundingClientRect().top;


        const windowHeight =
            window.innerHeight;


        if (sectionTop < windowHeight - 100) {

            started = true;


            counters.forEach(
                function (counter) {

                    const target =
                        parseInt(
                            counter.dataset.target
                        ) || 0;


                    let current = 0;


                    const duration = 1800;

                    const increment =
                        target /
                        (duration / 20);


                    const timer =
                        setInterval(
                            function () {

                                current +=
                                    increment;


                                if (current >= target) {

                                    current =
                                        target;

                                    clearInterval(
                                        timer
                                    );

                                }


                                counter.textContent =
                                    Math.floor(
                                        current
                                    ).toLocaleString();

                            },
                            20
                        );

                }
            );

        }

    }


    window.addEventListener(
        "scroll",
        animateCounters
    );


    animateCounters();

});