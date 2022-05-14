const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription(`Affiche l'ip du serveur`),
  async execute(interaction) {
    const msg = await interaction.reply({ content: 'En cours ..', fetchReply: true });
    interaction.editReply(`Voici l'ip: IP `);
  }
}