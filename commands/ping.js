const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(`Affiche la latence actuelle du bot.`),
  async execute(interaction) {
    const msg = await interaction.reply({ content: 'En cours ..', fetchReply: true });
    interaction.editReply(`Latence de votre demande: ${msg.createdTimestamp - interaction.createdTimestamp} ms`);
  }
}