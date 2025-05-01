const threatInfo = {
  MALWARE: { name: "Malware", icon: "icons/virus.png", description: "Este site contém ou distribui malware..." },
  SOCIAL_ENGINEERING: { name: "Phishing / Engenharia Social", icon: "icons/phishing.png", description: "Este site pode enganar você..." },
  UNWANTED_SOFTWARE: { name: "Software indesejado", icon: "icons/adware.png", description: "Este site promove softwares indesejados..." },
  POTENTIALLY_HARMFUL_APPLICATION: { name: "App potencialmente perigoso", icon: "icons/adware.png", description: "Este site pode hospedar apps perigosos..." }
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

    // 1) Trate códigos de erro sem chamar response.json() antes
    if (response.status === 429) {
      const err = await response.json();
      resultEl.textContent = err.error;
      return;
    }
    if (response.status === 400) {
      const err = await response.json();
      resultEl.textContent = err.error;
      return;
    }
    if (response.status === 405) {
      resultEl.textContent = "Método não permitido.";
      return;
    }
    if (!response.ok) {
      resultEl.textContent = "Erro no servidor. Tente novamente mais tarde.";
      return;
    }

    // 2) Se chegou aqui, response.ok === true → parse JSON
    const data = await response.json();

    // 3) Exiba resultado normal
    if (data.safe) {
      threatIcon.src = "icons/shield.png";
      threatType.textContent = "Link seguro";
      threatDesc.textContent = "Nenhuma ameaça conhecida foi detectada para esta URL.";
    } else {
      const info = threatInfo[data.threatType] || {
        name: "Ameaça desconhecida",
        icon: "icons/error.png",
        description: "Site perigoso, tipo não identificado."
      };
      threatIcon.src = info.icon;
      threatType.textContent = info.name;
      threatDesc.textContent = info.description;
    }

    visualResult.style.display = "block";
    resultEl.textContent = "";

  } catch (networkError) {
    console.error(networkError);
    // 4) Somente falhas de rede ou exceções chegam aqui
    resultEl.textContent = "Erro de conexão. Verifique sua internet e tente novamente.";
  }
});
