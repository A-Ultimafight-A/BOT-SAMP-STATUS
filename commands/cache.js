const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cache')
    .setDescription(`Envoie le lien pour installer le cache`),
  async execute(interaction) {
    const msg = await interaction.reply({ content: 'En cours ..', fetchReply: true });
    interaction.editReply(`Voici le lien: CACHE-DU-SERVEUR `);
  }
}