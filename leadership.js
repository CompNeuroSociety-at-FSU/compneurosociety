const cardContainer = document.querySelector('.flip-card-container');

    for (let i = 0; i < 10; i++) {
        const flipCard = `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="images/pfp.jpg" alt="Avatar">
                    </div>
                    <div class="flip-card-back">
                        <h1>Person ${i + 1}</h1> 
                        <p>Position</p>
                        <p>More info...</p>
                    </div>
                </div>
            </div>
        `;
        cardContainer.innerHTML += flipCard;
    }