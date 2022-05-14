const { SlashCommandBuilder } = require('@discordjs/builders');
const { getStatus } = require('../utils/getStatus');
const { getRoleColor } = require('../utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription(`Voir les informations en direct sur votre communauté SA-MP préférée!`),
  async execute(interaction) {
    const { server } = interaction.client.guildConfigs.get(interaction.guildId);
    if (!server) {
      return interaction.reply({ content: `Ce serveur n'a pas de serveur SA: MP qui y est associé. Utilisez /setguildserver pour faire cela.`, ephemeral: true });
    }
    
    const color = getRoleColor(interaction.guild);
    const status = await getStatus(server, color);
    await interaction.reply({ embeds: [status] });
  }
}