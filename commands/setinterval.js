const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const intervals = new Keyv(process.env.intervals);
const servers = new Keyv(process.env.servers);
const maxPlayers = new Keyv(process.env.maxPlayers);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setinterval')
    .setDescription(`Définit un salon pour que les messages de status soient envoyés.`)
    .addChannelOption((option) => option
      .setName('channel-name')
      .setDescription('Tager Le salon que vous souhaitez envoyer des mises à jour de status à envoyer.')
      .setRequired(true)
    )
    .addIntegerOption((option) => option
      .setName('minutes')
      .setDescription('Les mises à jour d\'intervalles seront envoyées à (au moins 3 min).')
      .setRequired(true)
    ),
  requiredPerms: 'MANAGE_GUILD',
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel-name');
    if (channel.type !== 'GUILD_TEXT') {
      await interaction.reply({ content: `Salon invalide.`, ephemeral: true });
      return;
    }
    const minutes = interaction.options.getInteger('minutes');
    if (minutes < 3) {
      return interaction.reply({ content: `Vous pouvez mettre juste 1-2-3 minutes.`, ephemeral: true });
    }

    const server = await servers.get(interaction.guildId);
    if (!server) {
      return interaction.reply({ content: `Ce serveur n'a pas encore de guild. Taper /setguildserver pour en configurer un.`, ephemeral: true });
    }

    let Interval = {};
    Interval.channel = channel.id;
    Interval.time = minutes * 60000;
    Interval.next = Date.now();
    Interval.message = 0;
    await intervals.set(interaction.guildId, Interval);
    const config = interaction.client.guildConfigs.get(interaction.guildId);
    config.interval = Interval;
    interaction.client.guildConfigs.set(interaction.guildId, config);
    const serverData = await maxPlayers.get(`${server.ip}:${server.port}`);
    if (!serverData) {
      const data = {};
      data.maxPlayersToday = -1;
      data.days = [];
      await maxPlayers.set(`${server.ip}:${server.port}`, data);
    }
    await interaction.reply({ content: `Définir une intervalle avec succès.`, ephemeral: true });
  }
}