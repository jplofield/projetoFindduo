import React, { useState } from "react";
import styles from "./Principal.modal.css";

const Principal = () => {
  const [nickname, setNickname] = useState("");
  const [tag, setTag] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!nickname || !tag) {
      setError("Preencha o Nickname e a Tag corretamente.");
      return;
    }

    setError("");
    setPlayerData(null);
    setIsSearching(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/lol/${nickname}/${tag}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao buscar jogador.");
        return;
      }

      setPlayerData(data);
    } catch (err) {
      console.error("Erro ao buscar jogador:", err);
      setError("Erro de conexão com o servidor.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="Perfil_LOL">
      <h1>Buscar Jogador</h1>

      <div className="inputs">
        <input
          type="text"
          placeholder="NickName"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />

        <button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {playerData && (
        <div className="playerCard">
          <div className="profileHeader">
            <img
              src={playerData.profileIconUrl}
              alt="Ícone do jogador"
              className="profileIcon"
            />

            <div className="playerInfo">
              <h2>
                {playerData.gameName}#{playerData.tagLine}
              </h2>
              <p>Nível: {playerData.summonerLevel}</p>
            </div>
          </div>

          <div className="rankSection">
            {playerData.tierImageUrl && (
              <img
                src={playerData.tierImageUrl}
                alt={playerData.tier}
                className="tierIcon"
              />
            )}

            <div className="rankInfo">
              <p>
                <strong>{playerData.tier}</strong> {playerData.rank}
              </p>
              <p>LP: {playerData.leaguePoints}</p>
              <p>
                Vitórias: {playerData.wins} | Derrotas: {playerData.losses}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Principal;
