import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

const OMDB_API_KEY = "35d4e772"; // твій ключ до API фільмів

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  try {
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
      text
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      await bot.sendMessage(chatId, "Фільм не знайдено.");
    } else {
      const message = `🎬 Назва: ${data.Title}
🗓 Рік: ${data.Year}
⭐ Рейтинг: ${data.imdbRating}
📝 Опис: ${data.Plot}`;

      if (data.Poster && data.Poster !== "N/A") {
        await bot.sendPhoto(chatId, data.Poster, { caption: message });
      } else {
        await bot.sendMessage(chatId, message);
      }
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, "Щось пішло не так, спробуйте ще раз.");
  }
});
