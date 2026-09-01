/* =========================================================
   ASK BAGBIN EDUCATION FUND
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       FAQ ACCORDION
    ===================================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");


    faqItems.forEach(
        function (item) {

            const question =
                item.querySelector(
                    ".faq-question"
                );

            const answer =
                item.querySelector(
                    ".faq-answer"
                );


            if (!question || !answer) {
                return;
            }


            question.addEventListener(
                "click",
                function () {


                    faqItems.forEach(
                        function (otherItem) {

                            if (
                                otherItem !== item
                            ) {

                                otherItem.classList.remove(
                                    "active"
                                );

                                const otherAnswer =
                                    otherItem.querySelector(
                                        ".faq-answer"
                                    );

                                if (otherAnswer) {

                                    otherAnswer.style.maxHeight =
                                        null;

                                }

                            }

                        }
                    );


                    item.classList.toggle(
                        "active"
                    );


                    if (
                        item.classList.contains(
                            "active"
                        )
                    ) {

                        answer.style.maxHeight =
                            answer.scrollHeight +
                            "px";

                    } else {

                        answer.style.maxHeight =
                            null;

                    }

                }
            );

        }
    );


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    const backToTop =
        document.getElementById(
            "backToTop"
        );


    function updateBackToTop() {

        if (!backToTop) {
            return;
        }


        if (window.scrollY > 500) {

            backToTop.classList.add(
                "show"
            );

        } else {

            backToTop.classList.remove(
                "show"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateBackToTop
    );


    updateBackToTop();


    if (backToTop) {

        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm =
        document.getElementById(
            "contactForm"
        );


    /* Contact form is handled by Phase 4 API integration. */


    /* =====================================================
       SMOOTH ANCHOR LINKS
    ===================================================== */

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        this.getAttribute(
                            "href"
                        );


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


                    if (target) {

                        event.preventDefault();


                        const header =
                            document.getElementById(
                                "mainHeader"
                            );


                        const headerHeight =
                            header
                                ? header.offsetHeight
                                : 0;


                        const targetPosition =
                            target.getBoundingClientRect()
                                .top +
                            window.scrollY -
                            headerHeight;


                        window.scrollTo({

                            top:
                                targetPosition,

                            behavior:
                                "smooth"

                        });

                    }

                }
            );

        }
    );


    /* =====================================================
       IMAGE ERROR HANDLING
    ===================================================== */

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(
        function (image) {

            image.addEventListener(
                "error",
                function () {

                    this.style.background =
                        "#eaf0f2";

                }
            );

        }
    );

});
/* =========================================================
   ADMIN-CONTROLLED WEBSITE STATUS + LOGO
   Demo/local browser version. Production should use a
   backend setting and secure storage.
========================================================= */
document.addEventListener('DOMContentLoaded', function(){
    try{
        const settings=JSON.parse(localStorage.getItem('askBagbinSiteSettings') || '{"websiteOpen":true}');
        if(settings.websiteOpen === false){
            const gate=document.createElement('div');
            gate.id='siteMaintenanceScreen';
            gate.innerHTML='<div class="maintenance-card"><img src="assets/images/logo/logo.png" alt="ASK Bagbin Education Fund"><span>WEBSITE MAINTENANCE</span><h1>We will be back shortly.</h1><p>The ASK Bagbin Education Fund website is temporarily closed for maintenance. Please check again soon.</p></div>';
            document.body.innerHTML='';
            document.body.appendChild(gate);
            document.body.style.margin='0';
            return;
        }
        const savedLogo=localStorage.getItem('askBagbinLogo');
        if(savedLogo){document.querySelectorAll('img[src*="assets/images/logo/logo.png"]').forEach(img=>img.src=savedLogo);}
    }catch(e){console.warn('Website settings could not be loaded.',e);}
});
