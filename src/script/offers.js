const offerItemTemplate = document.getElementById("job-offer-template");
const jobListings = document.querySelector(".job-listings");


// TODO: add event listener to a tag button
// TODO: if clicked, move to filter bar 
    // TODO: pass text of tag button 
    // TODO: create a new list item with the passed text
    // TODO: add close button with event listener to remove the tag from the bar

function addToFilterBar() {
    console.log("click")
}

function createOfferItem(recruiterObject) {
    const newOfferItem    = offerItemTemplate.content.cloneNode(true);
    const recruiterLogo   = newOfferItem.getElementById("recruiter-logo");      // img
    const recruiterTop    = newOfferItem.getElementById("recruiter-top");       // p 
    const jobPosition     = newOfferItem.getElementById("job-position");        // a
    const jobAdditional   = newOfferItem.getElementById("job-additional");      // ul
    const jobTags         = newOfferItem.getElementById("job-tags");            // ul

    const {new: isNew, 
           featured: isFeatured, 
           logo: logoPath, 
           company: companyName, 
           position, 
           postedAt,
           contract, 
           location,
           languages,
           tools
    } = recruiterObject;


    // new and featured tags
    if (isNew) {
        const newTag = document.createElement("span");
        newTag.classList.add("job-offer__info-tag");
        newTag.classList.add("job-offer__info-tag--accent");
        newTag.setAttribute("data-new-offer", "");
        newTag.textContent = "NEW!";

        recruiterTop.appendChild(newTag);
    } 
    
    if (isFeatured) {
        const featuredTag = document.createElement("span");
        featuredTag.classList.add("job-offer__info-tag");
        featuredTag.textContent = "FEATURED";

        recruiterTop.appendChild(featuredTag);
    }

    // set path to recruiter logo
    recruiterLogo.src = logoPath;
    
    // inserting company name before tags if such exist.
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
    for (let skill of [...languages, tools]) {
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


    // adding new offer item to DOM.
    jobListings.appendChild(newOfferItem)
}


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


// TODO: adding tags to filter bar, displaying content with these tags. 