/* =========================================================
   ASK BAGBIN EDUCATION FUND
   NAVIGATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const header =
        document.getElementById("mainHeader");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileNavigation =
        document.getElementById("mobileNavigation");

    const mobileCloseBtn =
        document.getElementById("mobileCloseBtn");


    /* =====================================================
       STICKY HEADER
    ===================================================== */

    function updateHeader() {

        if (!header) {
            return;
        }

        if (window.scrollY > 30) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* =====================================================
       OPEN MOBILE MENU
    ===================================================== */

    function openMobileMenu() {

        if (!mobileNavigation) {
            return;
        }

        mobileNavigation.classList.add("active");

        document.body.classList.add("menu-open");

        document.body.style.overflow = "hidden";

    }


    /* =====================================================
       CLOSE MOBILE MENU
    ===================================================== */

    function closeMobileMenu() {

        if (!mobileNavigation) {
            return;
        }

        mobileNavigation.classList.remove("active");

        document.body.classList.remove("menu-open");

        document.body.style.overflow = "";

    }


    /* =====================================================
       MOBILE MENU BUTTON
    ===================================================== */

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            openMobileMenu
        );

    }


    /* =====================================================
       MOBILE CLOSE BUTTON
    ===================================================== */

    if (mobileCloseBtn) {

        mobileCloseBtn.addEventListener(
            "click",
            closeMobileMenu
        );

    }


    /* =====================================================
       MOBILE NAVIGATION LINKS
    ===================================================== */

    const mobileLinks =
        document.querySelectorAll(
            ".mobile-navigation a"
        );

    mobileLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                closeMobileMenu();

            }
        );

    });


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       CLOSE MOBILE MENU WHEN RESIZING
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 1050
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       CLOSE MENU WHEN CLICKING OUTSIDE
    ===================================================== */

    if (mobileNavigation) {

        mobileNavigation.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    mobileNavigation
                ) {

                    closeMobileMenu();

                }

            }
        );

    }


    /* =====================================================
       SMOOTH INTERNAL NAVIGATION
    ===================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    internalLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight -
                    10;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

                closeMobileMenu();

            }
        );

    });

});
/* =====================================================
   DESKTOP NAVIGATION IMAGE PREVIEWS
   The image changes when the pointer moves over a submenu item.
===================================================== */
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".nav-with-preview").forEach(function (item) {
        const preview = item.querySelector(".nav-preview-image img");
        const links = item.querySelectorAll(".nav-preview-links a[data-preview-image]");
        if (!preview || !links.length) return;

        links[0].classList.add("active");

        links.forEach(function (link) {
            const showPreview = function () {
                links.forEach(function (other) { other.classList.remove("active"); });
                link.classList.add("active");
                const nextImage = link.getAttribute("data-preview-image");
                if (!nextImage || preview.getAttribute("src") === nextImage) return;
                preview.style.opacity = "0.35";
                window.setTimeout(function () {
                    preview.src = nextImage;
                    preview.style.opacity = "1";
                }, 90);
            };
            link.addEventListener("mouseenter", showPreview);
            link.addEventListener("focus", showPreview);
        });
    });
});
