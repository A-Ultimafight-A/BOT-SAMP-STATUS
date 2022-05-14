const gamedig = require('gamedig');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const servers = new Keyv(process.env.servers);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setguildserver')
    .setDescription(`Définir un guild pour SA: MP Serveur et recevoir des mises à jour.`)
    .addStringOption((option) => option
      .setName('ip')
      .setDescription('L\'IP d\'un SA: MP Serveur.')
      .setRequired(true)
    )
    .addStringOption((option) => option
      .setName('port')
      .setDescription('Le port d\'un SA: MP Serveur.')
      .setRequired(true)
    ),
  requiredPerms: 'MANAGE_GUILD',
  async execute(interaction) {
    const args = interaction.options.data.map((option) => option.value);
    let err = 0;
    await gamedig.query({
      type: 'samp',
      host: args[0],
      port: args[1]
    }).catch(async () => {
      await interaction.reply({ content: `Impossible de trouver ${args[0]}:${args[1]}`, ephemeral: true });
      err = 1;
    });
    if (err === 1) return;
    let Server = {};
    Server.ip = args[0];
    Server.port = args[1];
    await servers.set(interaction.guildId, Server);
    const config = interaction.client.guildConfigs.get(interaction.guildId);
    config.server = Server;
    interaction.client.guildConfigs.set(interaction.guildId, config);
    await interaction.reply({ content: `Vous pouvez maintenant utiliser /status pour afficher des informations sur ${args[0]}:${args[1]}`, ephemeral: true });
  }
}