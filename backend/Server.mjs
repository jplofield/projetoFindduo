import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = 3001;

// Necessário para usar __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// 👉 Servir a pasta de imagens localmente
app.use("/tiers", express.static(path.join(__dirname, "tiers")));

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const REGION = "br1"; // Pode ajustar se precisar

// 🔥 Rota principal para buscar informações do jogador
app.get("/api/lol/:nickname/:tag", async (req, res) => {
  const { nickname, tag } = req.params;
  console.log(`🔎 Buscando jogador: ${nickname}#${tag}`);

  try {
    // 1️⃣ Buscar informações básicas da conta
    const accountResponse = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        nickname
      )}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`
    );

    if (!accountResponse.ok) {
      const errData = await accountResponse.json();
      console.error("❌ Erro ao buscar conta:", errData);
      return res.status(404).json({ error: "Jogador não encontrado." });
    }

    const accountData = await accountResponse.json();
    console.log("✅ Conta encontrada:", accountData);

    // 2️⃣ Buscar Summoner pelo PUUID
    const summonerResponse = await fetch(
      `https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}?api_key=${RIOT_API_KEY}`
    );

    if (!summonerResponse.ok) {
      const errData = await summonerResponse.json();
      console.error("❌ Erro ao buscar Summoner:", errData);
      return res.status(404).json({ error: "Não foi possível buscar o Summoner." });
    }

    const summonerData = await summonerResponse.json();
    console.log("✅ Summoner encontrado:", summonerData);

    // 3️⃣ Buscar dados de rank pelo PUUID
    const rankedResponse = await fetch(
      `https://${REGION}.api.riotgames.com/lol/league/v4/entries/by-puuid/${accountData.puuid}?api_key=${RIOT_API_KEY}`
    );

    if (!rankedResponse.ok) {
      const errData = await rankedResponse.json();
      console.error("❌ Erro ao buscar ranks:", errData);
      return res.status(404).json({ error: "Não foi possível buscar dados ranqueados." });
    }

    const rankedData = await rankedResponse.json();
    console.log("✅ Dados de Rank:", rankedData);

    // 4️⃣ Seleciona a SoloQ ou Flex
    const soloQueue = rankedData.find(q => q.queueType === "RANKED_SOLO_5x5");
    const rankedInfo = soloQueue || rankedData[0] || {
      tier: "UNRANKED",
      rank: "",
      leaguePoints: 0,
      wins: 0,
      losses: 0,
    };

    // 5️⃣ Pegar imagem local (pasta tiers)
    const tierLower = rankedInfo.tier ? rankedInfo.tier.toLowerCase() : "unranked";
    const tierImageUrl = `http://localhost:${PORT}/tiers/emblem-${tierLower}.png`;

    // 6️⃣ Retornar tudo formatado
    res.json({
      gameName: accountData.gameName,
      tagLine: accountData.tagLine,
      summonerLevel: summonerData.summonerLevel,
      profileIconUrl: `https://ddragon.leagueoflegends.com/cdn/14.21.1/img/profileicon/${summonerData.profileIconId}.png`,
      tier: rankedInfo.tier,
      rank: rankedInfo.rank,
      leaguePoints: rankedInfo.leaguePoints,
      wins: rankedInfo.wins,
      losses: rankedInfo.losses,
      tierImageUrl, // ✅ imagem local servida pelo servidor
    });
  } catch (error) {
    console.error("🔥 Erro interno no servidor:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// 🚀 Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});