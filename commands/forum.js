const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forum')
    .setDescription(`Envoie le lien pour accédé au forum`),
  async execute(interaction) {
    const msg = await interaction.reply({ content: 'En cours ..', fetchReply: true });
    interaction.editReply(`Voici le lien: FORUM `);
  }
}