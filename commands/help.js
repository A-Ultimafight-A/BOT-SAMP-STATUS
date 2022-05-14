const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { botInviteLink, githubRepo } = require('../config.json');
const { getRoleColor } = require('../utils/getRoleColor');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche une liste de toutes les commandes disponibles avec leur utilisation.'),
  async execute(interaction) {
    const color = getRoleColor(interaction.guild);
    let cmds = '';
    fs.readdirSync('./commands').forEach((file) => cmds += `/${file.split('.')[0]} `);
    const helpEmbed = new MessageEmbed()
      .setColor(color.hex)
      .addFields({ name: 'Commandes', value: '```' + cmds + '```' })
      .setTimestamp();
    await interaction.reply({ embeds: [helpEmbed] });
  }
}