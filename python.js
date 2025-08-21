const contentDiv = document.querySelector(".content");
const part1 = document.querySelector(".part1");
const part2 = document.querySelector(".part2");

part1.addEventListener("click", () => {
    contentDiv.innerHTML = `
                <h2>Part 1 Content</h2>
                <p>This is where your Part 1 explanation, files, or examples go.</p>
            `;
});

part2.addEventListener("click", () => {
    contentDiv.innerHTML = `
                <h2>Part 2 Content</h2>
                <p>This is where your Part 2 explanation, files, or examples go.</p>
            `;
});