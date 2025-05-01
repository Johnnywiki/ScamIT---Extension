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
  const url = document.getElementById("urlInput").value.trim();
  const resultEl = document.getElementById("result");
  const visualResult = document.getElementById("visualResult");
  const threatIcon = document.getElementById("threatIcon");
  const threatType = document.getElementById("threatType");
  const threatDesc = document.getElementById("threatDesc");

  visualResult.style.display = "none";
  resultEl.textContent = "";

  if (!url) {
    resultEl.textContent = "Nenhum link inserido.";
    return;
  }

  resultEl.textContent = "Verificando...";

  try {
    const response = await fetch("https://scamit-urlbackend.vercel.app/api/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok) {
      resultEl.textContent = data.error || "Erro desconhecido ao verificar o link.";
      return;
    }

    if (data.safe) {
      threatIcon.src = "icons/shield.png";
      threatType.textContent = "Link seguro";
      threatDesc.textContent = "Nenhuma ameaça conhecida foi detectada para esta URL.";
    } else {
      const threat = data.threatType;
      const info = threatInfo[threat] || {
        name: "Ameaça desconhecida",
        icon: "icons/error.png",
        description: "Este site está listado como perigoso, mas o tipo não foi identificado."
      };

      threatIcon.src = info.icon;
      threatType.textContent = info.name;
      threatDesc.textContent = info.description;
    }

    visualResult.style.display = "block";
    resultEl.textContent = "";
  } catch (err) {
    console.error(err);
    resultEl.textContent = "Erro ao se conectar com o servidor. Tente novamente mais tarde ou aguarde para novas requisições.";
  }
});
