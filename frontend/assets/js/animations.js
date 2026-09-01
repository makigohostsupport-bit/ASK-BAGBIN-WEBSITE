document.addEventListener("DOMContentLoaded", function () {

    const animatedElements =
        document.querySelectorAll(
            ".reveal-left, .reveal-right, .reveal-up"
        );


    if (!animatedElements.length) {
        return;
    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "revealed"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    animatedElements.forEach(
        function (element) {

            observer.observe(element);

        }
    );

});