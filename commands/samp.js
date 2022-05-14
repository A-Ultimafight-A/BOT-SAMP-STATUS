const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('samp')
    .setDescription(`Envoie le lien pour installer SAMP 0.3DL`),
  async execute(interaction) {
    const msg = await interaction.reply({ content: 'En cours ..', fetchReply: true });
    interaction.editReply(`Voici le lien: SAMP 0.3DL `);
  }
}