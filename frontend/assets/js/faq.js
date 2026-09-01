document.addEventListener("DOMContentLoaded", function () {

    const faqItems =
        document.querySelectorAll(".faq-item");

    if (!faqItems.length) {
        return;
    }


    faqItems.forEach(function (item) {

        const question =
            item.querySelector(".faq-question");

        const answer =
            item.querySelector(".faq-answer");


        if (!question || !answer) {
            return;
        }


        question.addEventListener(
            "click",
            function () {

                const isActive =
                    item.classList.contains("active");


                faqItems.forEach(function (otherItem) {

                    otherItem.classList.remove("active");

                    const otherAnswer =
                        otherItem.querySelector(".faq-answer");

                    if (otherAnswer) {

                        otherAnswer.style.maxHeight =
                            null;

                    }

                });


                if (!isActive) {

                    item.classList.add("active");

                    answer.style.maxHeight =
                        answer.scrollHeight + "px";

                }

            }
        );

    });

});