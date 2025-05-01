const threatInfo = {
  MALWARE: {
    name: "Malware",
    icon: "icons/virus.png",
    description: "Este site contém ou distribui malware que pode danificar seu dispositivo ou roubar informações."
  },
  SOCIAL_ENGINEERING: {
    name: "Phishing / Engenharia Social",
    icon: "icons/phishing.png",
    description: "Este site pode enganar você para obter dados pessoais, como senhas ou cartões."
  },
  UNWANTED_SOFTWARE: {
    name: "Software indesejado",
    icon: "icons/adware.png",
    description: "Este site promove softwares que podem alterar seu navegador ou exibir anúncios indesejados."
  },
  POTENTIALLY_HARMFUL_APPLICATION: {
    name: "Aplicativo potencialmente perigoso",
    icon: "icons/adware.png",
    description: "Este site pode hospedar apps perigosos, especialmente para Android."
  }
};

document.getElementById("checkBtn").addEventListener("click", async () => {
  const urlInput = document.getElementById("urlInput").value.trim();
  const resultEl = document.getElementById("result");
  const visualResult = document.getElementById("visualResult");
  const threatIcon = document.getElementById("threatIcon");
  const threatType = document.getElementById("threatType");
  const threatDesc = document.getElementById("threatDesc");

  visualResult.style.display = "none";
  resultEl.textContent = "";

  if (!urlInput) {
    resultEl.textContent = "Nenhum link inserido.";
    return;
  }

  resultEl.textContent = "Verificando...";

  try {
    const response = await fetch("https://scamit-urlbackend.vercel.app/api/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlInput })
    });

    const data = await response.json();

    if (data && data.matches && data.matches.length > 0) {
      const threat = data.matches[0].threatType;
      const info = threatInfo[threat] || {
        name: "Ameaça desconhecida",
        icon: "icons/error.png",
        description: "Este site está listado como perigoso, mas o tipo não foi identificado."
      };

      threatIcon.src = info.icon;
      threatType.textContent = info.name;
      threatDesc.textContent = info.description;

      saveToHistory(urlInput, info.name);
    } else {
      threatIcon.src = "icons/shield.png";
      threatType.textContent = "Link seguro";
      threatDesc.textContent = "Nenhuma ameaça conhecida foi detectada para esta URL.";

      saveToHistory(urlInput, null);
    }

    visualResult.style.display = "block";
    resultEl.textContent = "";
  } catch (error) {
    console.error(error);
    visualResult.style.display = "none";
    resultEl.textContent = "Erro ao verificar o link. A API pode estar fora do ar ou o link é inválido!";
  }
});

// Salvar no histórico
function saveToHistory(url, threatType) {
  const history = JSON.parse(localStorage.getItem("scanHistory")) || [];
  history.unshift({
    url,
    threatType: threatType || "Seguro",
    date: new Date().toLocaleString()
  });

  if (history.length > 5) history.pop();
  localStorage.setItem("scanHistory", JSON.stringify(history));
  renderHistory();
}

// Mostrar histórico
function renderHistory() {
  const historyList = document.getElementById("historyList");
  const history = JSON.parse(localStorage.getItem("scanHistory")) || [];

  historyList.innerHTML = "";

  history.forEach(entry => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${entry.url}</strong><br />
      Tipo: ${entry.threatType}<br />
      <small>${entry.date}</small><hr/>
    `;
    li.style.marginBottom = "5px";
    historyList.appendChild(li);
  });
}

// Inicializa histórico ao abrir
renderHistory();
