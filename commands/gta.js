const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gta')
    .setDescription(`Envoie le lien pour installer gta`),
  async execute(interaction) {
    const msg = await interaction.reply({ content: 'En cours ..', fetchReply: true });
    interaction.editReply(`Voici le lien: https://www.mediafire.com/file/1zwwwul2imvrvm0/gta-san-andreas.rar/file`);
  }
}