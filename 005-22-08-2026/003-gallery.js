document.querySelector("body").onload = () => {
    document.querySelectorAll(".category")[0].classList.add("categoryMouseOver");
    document.querySelectorAll(".category")[0].classList.add("activeCategory");
}

let categoryButtons = document.querySelectorAll(".category");

for (let i = 0; i < categoryButtons.length; i++) { // Added 'let' here
    categoryButtons[i].addEventListener("mouseenter", (event) => {
        event.target.classList.add("categoryMouseOver"); 
    });
    categoryButtons[i].addEventListener("mouseleave", (event) => {
        if(!(event.target.classList.contains("activeCategory"))) {
            event.target.classList.remove("categoryMouseOver");
        }         
    });
}
