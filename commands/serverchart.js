const { SlashCommandBuilder } = require('@discordjs/builders');
const { getChart } = require('../utils/getChart');
const { getRoleColor } = require('../utils/getRoleColor')
const Keyv = require('keyv');
const intervals = new Keyv(process.env.intervals);
const maxPlayers = new Keyv(process.env.maxPlayers);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverchart')
    .setDescription('Envoie une carte affichant les statistiques de serveur pour chaque jour.'),
  async execute(interaction) {
    const interval = await intervals.get(interaction.guildId);
    if (!interval) {
      return interaction.reply({ content: `Vous devez définir un intervalle pour voir les statistiques. Définir un en utilisant /setinterval`, ephemeral: true });
    }
    const { server } = interaction.client.guildConfigs.get(interaction.guildId);
    const data = await maxPlayers.get(`${server.ip}:${server.port}`);
    if (!data) {
      return interaction.reply({ content: `Aucune donnée n'a encore été collectée. Vérifiez à nouveau demain.`, ephemeral: true });
    }
    const color = getRoleColor(interaction.guild);
    const chart = await getChart(data, color);
    await interaction.reply({ files: [chart] });
  }
}
