document.getElementById('searchBtn').addEventListener('click', searchTerm);
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
document.getElementById('languageSelect').addEventListener('change', updateLanguage);

function searchTerm() {
    const input = document.getElementById('searchInput').value.trim().toLowerCase();
    const language = document.getElementById('languageSelect').value;
    const termsList = document.getElementById('termsList');
    termsList.innerHTML = '';

    if (termsData[input]) {
        const term = document.createElement('div');
        term.classList.add('term-card');
        term.innerHTML = `<strong>${input.toUpperCase()}</strong>: ${termsData[input][language]}`;
        termsList.appendChild(term);
    } else {
        termsList.innerHTML = `<p style="color:red;">Term not found. Try asking legalBot !!</p>`;
    }
}

function toggleTheme() {
    const body = document.body;
    body.dataset.theme = body.dataset.theme === "light" ? "dark" : "light";
}

function updateLanguage() {
    searchTerm();
}

function askLegalBot(input, language, termsList) {
    const apiKey = "Enter Your Api Key";

    fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a legal assistant that explains terms simply." },
                { role: "user", content: `Explain the legal term "${input}" in simple ${language === 'hi' ? 'Hindi' : 'English'}.` }
            ],
            max_tokens: 100
        })
    })
    .then(response => response.json())
    .then(data => {
        const botReply = document.createElement('div');
        botReply.classList.add('term-card');
        botReply.innerHTML = `<strong>LegalBot says</strong>: ${data.choices[0].message.content}`;
        termsList.appendChild(botReply);
    })
    .catch(error => {
        console.error("OpenAI API Error:", error);
        const errorMsg = document.createElement('div');
        errorMsg.innerHTML = `<p style="color:red;">LegalBot failed to respond.</p>`;
        termsList.appendChild(errorMsg);
    });
}
