// Function to load video data for a specific category
const loadData = (id) => {
    fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.data.length > 0) {
                displayData(data.data);
            } else {
                showErrorMessage();
            }
        });
};

// Function to sort videos based on their view count
const sortBasedOnViews = (videos) => {
    const parseViews = (viewStr) => {
        let numericValue = parseFloat(viewStr);
        let multiplier = 1;

        if (viewStr.includes("K")) {
            multiplier = 1000;
        } else if (viewStr.includes("M")) {
            multiplier = 1000000;
        } else {
            multiplier = 1;
        }

        return numericValue * multiplier;
    };

    const customSort = (x, y) => {
        const xViews = parseViews(x.others.views);
        const yViews = parseViews(y.others.views);

        if (xViews > yViews) {
            return -1; // x should come before y
        } else if (xViews < yViews) {
            return 1; // x should come before y
        } else {
            return 0; // x and y are equal
        }
    };

    return videos.sort(customSort);
};


// Function to fetch, sort, and display videos based on views
const displaySortedData = () => {
    fetch(`https://openapi.programming-hero.com/api/videos/category/${1000}`)
        .then(response => response.json())
        .then(data => {
            const sortedVideos = sortBasedOnViews(data.data);
            displayData(sortedVideos);
        });
};

// Function to render video data on the page
const displayData = (videos) => {
    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = ''; // Clearing the container before adding new content

    videos.forEach(video => {
        const card = document.createElement("div");
        card.classList.add("box");

        const postedTime = calculateTime(video.others.posted_date);

        card.innerHTML = `
        <div>
            <div style="position: relative;">
                <img class="img-box mt-4 mb-2" src="${video.thumbnail}" alt="Thumbnail" style="border-radius: 10px;">
                ${postedTime ? `<p class="text-end date-ago" style="position: absolute; bottom: 8px; right: 8px; background-color: black; color: white; font-weight: bold; padding: 5px 10px; border-radius: 5px; opacity: 0.8;">${postedTime}</p>` : ''}
            </div>
            <h6 style="margin: 0; font-weight: bold;">${video.title}</h6>
            <div class="profile-info d-flex align-items-center mt-3">
                <img class="author-profile" src="${video.authors[0].profile_picture}" alt="Author Profile" style="border-radius: 50%; width: 40px; height: 40px; margin-right: 10px;">
                <div style="flex-grow: 1;">
                    <div class="profile-verified d-flex align-items-center">
                        <p style="margin: 0;">${video.authors[0].profile_name}</p>
                        ${video.authors[0].verified ? '<i class="bi bi-patch-check-fill text-primary" style="margin-left: 5px;"></i>' : ''}
                    </div>
                </div>
            </div>
            <div class="video-info mt-2">
                <p style="margin: 0; color: gray;">${video.others.views} views</p>
            </div>
        </div>
        `;

        videoContainer.appendChild(card);
    });
};

// Function to display an error message when no content is available
const showErrorMessage = () => {
    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = `
    <div class="show-error">
        <img src="resources/Icon.png" alt="logo" style="margin-bottom: 30px;">
        <h3>Oops!! Sorry, There is no content here</h3>
    </div>`;
};

// Function to calculate and format the time since a video was posted
const calculateTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours} Hours ${minutes} Minutes ago`;
    }
    return '';
};

// Function to set the active button
const setActiveButton = (buttonId) => {
    // Get all buttons
    const buttons = document.querySelectorAll('.d-flex button');
    
    // Remove the 'btn-danger' class from all buttons and add 'btn-secondary'
    buttons.forEach(button => {
        button.classList.remove('btn-danger', 'active');
        button.classList.add('btn-secondary');
    });

    // Add the 'btn-danger' and 'active' classes to the clicked button
    const activeButton = document.getElementById(buttonId);
    activeButton.classList.remove('btn-secondary');
    activeButton.classList.add('btn-danger', 'active');
};


// Initial data load for category with ID 1000
loadData(1000);
