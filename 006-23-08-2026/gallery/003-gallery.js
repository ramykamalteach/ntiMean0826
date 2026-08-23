document.querySelector("body").onload = () => {
    document.querySelectorAll(".category")[0].classList.add("categoryMouseOver");
    document.querySelectorAll(".category")[0].classList.add("activeCategory");
}

let categoryButtons = document.querySelectorAll(".category");
let activeCategoryIndex = 0;

for (let i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].addEventListener("click", (event) => {
        categoryButtons[activeCategoryIndex].classList.remove("activeCategory");
        categoryButtons[activeCategoryIndex].classList.remove("categoryMouseOver");
        activeCategoryIndex = i;
        event.target.classList.add("activeCategory");
        event.target.classList.add("categoryMouseOver");

        categoryType = event.target.getAttribute("_categoryType");
        photos = document.querySelectorAll("#photos > div");
        for(j = 0; j < photos.length; j++) {
            if(photos[j].classList.contains(categoryType)) {
                photos[j].style.display = "block";
            }
            else {
                photos[j].style.display = "none";
            }
        }
    });


    categoryButtons[i].addEventListener("mouseenter", (event) => {
        event.target.classList.add("categoryMouseOver"); 
    });
    categoryButtons[i].addEventListener("mouseleave", (event) => {
        if(!(event.target.classList.contains("activeCategory"))) {
            event.target.classList.remove("categoryMouseOver");
        }         
    });
}


document.querySelector("#blackScreen").addEventListener("click", (event) => {
    event.target.style.display = "none";
})


currenPhoto = 0;
photoArrary = [
    "photo-gallery-01.jpg",
    "photo-gallery-02.jpg",
    "photo-gallery-03.jpg",
    "photo-gallery-04.jpg",
    "photo-gallery-05.jpg",
    "photo-gallery-06.jpg",
    "photo-gallery-07.jpg",
    "photo-gallery-08.jpg",
    "photo-gallery-09.jpg",
    "photo-gallery-10.jpg",
    "photo-gallery-11.jpg"
]

mags = document.querySelectorAll(".fa-magnifying-glass");
for(m = 0; m < mags.length; m++) {
    mags[m].addEventListener("click", (event) => {
        currenPhoto = m;
        document.querySelector("#blackScreen").style.display = "block";
    });
}