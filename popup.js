document.getElementById("checkBtn").addEventListener("click", async () => {
  const inputUrl = document.getElementById("urlInput").value.trim();
  const resultEl = document.getElementById("result");
  const visualResult = document.getElementById("visualResult");
  const threatIcon = document.getElementById("threatIcon");
  const threatType = document.getElementById("threatType");
  const threatDesc = document.getElementById("threatDesc");

  visualResult.style.display = "none";
  resultEl.textContent = "";

  if (!inputUrl) {
    resultEl.textContent = "Nenhum link inserido.";
    return;
  }

  resultEl.textContent = "Verificando...";

  try {
    const response = await fetch("https://seu-backend.vercel.app/api/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: inputUrl }) // Correção aqui!
    });

    let data = null;

    try {
      data = await response.json(); // Chamada única ao .json()
    } catch (jsonError) {
      console.warn("Resposta não retornou JSON válido.");
    }

    if (response.status === 429) {
      resultEl.textContent = data?.error || "Muitas requisições. Tente novamente em instantes.";
      return;
    }

    if (response.status === 400) {
      resultEl.textContent = data?.error || "URL inválida.";
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

    if (data.safe) {
      threatIcon.src = "icons/shield.png";
      threatType.textContent = "Link seguro";
      threatDesc.textContent = "Nenhuma ameaça conhecida foi detectada para esta URL.";
    } else {
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

      const info = threatInfo[data.threatType] || {
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

  } catch (error) {
    console.error("Erro de rede ou execução:", error);
    resultEl.textContent = "Erro ao conectar com o servidor. Verifique sua conexão ou tente novamente em instantes.";
  }
});
