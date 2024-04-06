const offerItemTemplate = document.getElementById("job-offer-template");
const jobListings = document.querySelector(".job-listings");
const clearBtn = document.querySelector("#clear-filters-btn");
const filterList = document.querySelector(".filter-bar__filter-tags");


function updateOfferList() {
    // get tags inside filter list
    const addedTagNames = [];
    
    Array.from(filterList.children).forEach((tag) => {
        addedTagNames.push(tag.dataset.tag)
    })

    // show all offers if no tags added
    if (addedTagNames.length === 0) {
        jobListings.querySelectorAll(".none").forEach((item) => {
            item.classList.remove("none")
        })

        return
    }
    
    // filter job offers by tags
    for (let offerItem of jobListings.querySelectorAll(".job-listings > li")) {
        const assignedTags = offerItem.dataset.tagGroup.split(" ");
        const includesTag = assignedTags.some(tag => addedTagNames.includes(tag));

        // hide offer item if no tag matches
        offerItem.classList.toggle("none", !includesTag);
    }
}


function addToFilterBar(event) {
    const tagText = event.currentTarget.textContent;

    // prevent filter tags from repeating by adding data attributes to each removableTag
    if (filterList.querySelector(`[data-tag='${tagText}']`)) {
        return
    }

    const removableTag = document.createElement("li");
    removableTag.classList.add("tag");
    removableTag.dataset.tag = tagText;

    removableTag.insertAdjacentHTML("afterbegin", 
    `
    ${tagText}
    <button class="button tag__close-btn">
        <span class="visually-hidden">remove tag</span>
        <img src="dist/img/icon-remove.svg" alt="">
    </button>
    `);

    filterList.appendChild(removableTag);

    // handle tag removal via remove button inside the element
    const removeBtn = removableTag.querySelector("button");
    removeBtn.addEventListener("click", () => {
        removableTag.remove();
        updateOfferList();
    })

    updateOfferList();
}


function createOfferItem(recruiterObject) {
    const newOfferItem    = offerItemTemplate.content.cloneNode(true);
    const recruiterLogo   = newOfferItem.querySelector(".job-offer__recruiter-photo");      // img
    const recruiterTop    = newOfferItem.querySelector(".job-offer__recruiter");            // p 
    const jobPosition     = newOfferItem.querySelector(".job-offer__position");             // a
    const jobAdditional   = newOfferItem.querySelector(".job-offer__additional");           // ul
    const jobTags         = newOfferItem.querySelector(".job-offer__filters");              // ul

    const {new: isNew, 
           featured: isFeatured, 
           logo: logoPath, 
           company: companyName, 
           position, 
           postedAt,
           contract, 
           location,
           role,
           level,
           languages,
           tools
    } = recruiterObject;


    // new and featured tags
    if (isNew) {
        const newTag = document.createElement("span");
        newTag.classList.add("job-offer__info-tag");
        newTag.classList.add("job-offer__info-tag--accent");
        newTag.textContent = "NEW!";

        recruiterTop.appendChild(newTag);
    } 
    
    if (isFeatured) {
        const featuredTag = document.createElement("span");
        featuredTag.classList.add("job-offer__info-tag");
        featuredTag.textContent = "FEATURED";
        featuredTag.setAttribute("data-featured-offer", "");

        recruiterTop.appendChild(featuredTag);
    }

    // set image path to recruiter logo
    recruiterLogo.src = logoPath;
    
    // inserting company name before new and featured tags
    recruiterTop.insertAdjacentHTML("afterbegin", companyName);

    // set job position
    jobPosition.textContent = position;

    // set additional info
    for (let info of [postedAt, contract, location]) {
        const listItem = document.createElement("li");
        listItem.textContent = info;

        jobAdditional.appendChild(listItem);
    }

    // set job tags / filters 
    for (let skill of [role, level, ...languages, ...tools]) {
        if (skill.length === 0) {
            continue
        }

        const listItem = document.createElement("li");
        const tag = document.createElement("button");

        tag.textContent = skill;
        tag.classList.add("button");
        tag.classList.add("tag");

        // handle click events on tag button
        tag.addEventListener("click", addToFilterBar);
        
        listItem.appendChild(tag);
        jobTags.appendChild(listItem);
    }

     
    // add a new offer element to the DOM, assigning the parent element its tag names for further filter.
    newOfferItem.firstElementChild.setAttribute("data-tag-group", [role, level, ...languages, ...tools].join(" "));
    jobListings.appendChild(newOfferItem)
}


function clearAllFilters() {
    while (filterList.firstChild) {
        filterList.firstChild.remove();
    }

    updateOfferList();
}


clearBtn.addEventListener("click", clearAllFilters);


fetch("/data.json")
    .then(res => {
        if (res.ok) {
            return res.json()
        }
        throw new Error("Response was not recived !")
    })

    .then(data => {
        data.forEach(obj => {
            createOfferItem(obj)
        });
    })

    .catch(message => {
        console.error(message)
    })
