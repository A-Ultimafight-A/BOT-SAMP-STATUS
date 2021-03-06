const { Collection } = require('discord.js');
const { getChart } = require('../../utils/getChart');
const { getStatus, getPlayerCount } = require('../../utils/getStatus');
const { getRoleColor } = require('../../utils/getRoleColor');
const commands = require('../../index');
const gamedig = require('gamedig');
const Keyv = require('keyv');
const intervals = new Keyv(process.env.intervals);
const servers = new Keyv(process.env.servers);
const maxPlayers = new Keyv(process.env.maxPlayers);

module.exports = async (client) => {
  console.log('Bot Discord en ligne ✅');
  
  client.user.setActivity('pour-la-bio-du-bot');

  client.guilds.cache.forEach((guild) => {
    client.application.commands.set(commands, guild.id).catch((err) => console.log(err));
  });

  client.guildConfigs = new Collection();
  client.guilds.cache.forEach(async (guild) => {
    let server = await servers.get(guild.id);
    let interval = await intervals.get(guild.id);
    const config = {
      server,
      interval
    }
    client.guildConfigs.set(guild.id, config);
  });

  setInterval(() => {
    client.guilds.cache.forEach(async (guild) => {
      const { interval = 0, server = 0 } = client.guildConfigs.get(guild.id);
      if (!interval || Date.now() < interval.next) return;
      interval.next = Date.now() + interval.time;
      const chartData = await maxPlayers.get(`${server.ip}:${server.port}`);
      if (!chartData) return;
      const playerCount = await getPlayerCount(server, gamedig);
      if (playerCount > chartData.maxPlayersToday) chartData.maxPlayersToday = playerCount;
      await maxPlayers.set(`${server.ip}:${server.port}`, chartData);
      const channel = await client.channels
        .fetch(interval.channel)
        .catch((err) => console.log(err));
      if (!channel) return;
      const color = getRoleColor(guild);
      const status = await getStatus(server, color);
      channel.messages
        .fetch(interval.message)
        .then((oldMsg) => oldMsg.delete())
        .catch((err) => console.log(err));
      channel
        .send({ embeds: [status] })
        .then((msg) => interval.message = msg.id)
        .catch((err) => console.log(err));
      await intervals.set(guild.id, interval);
    });
  }, 60000);
  
  setInterval(async () => {
    const nextCheck = await maxPlayers.get('next');
    if (Date.now() >= nextCheck) {
      await maxPlayers.set('next', nextCheck + 86400000);
      client.guilds.cache.forEach(async (guild) => {
        const { interval = 0, server = 0 } = client.guildConfigs.get(guild.id);
        if (!interval) return;
        const data = await maxPlayers.get(`${server.ip}:${server.port}`);
        if (!data) return;
        let ChartData = {};
        ChartData.value = data.maxPlayersToday;
        ChartData.date = Date.now();
        data.maxPlayersToday = -1;
        if (ChartData.value >= 0) data.days.push(ChartData);
        if (data.days.length > 30) data.days.shift();
        const channel = await client.channels
          .fetch(interval.channel)
          .catch((err) => console.log(err));
        if (!channel) return;
        const color = getRoleColor(guild);
        const chart = await getChart(data, color);
        channel.messages
          .fetch(data.msg)
          .then((oldMsg) => oldMsg.delete())
          .catch((err) => console.log(err));
        channel
          .send({ files: [chart] })
          .then((msg) => data.msg = msg.id)
          .catch((err) => console.log(err));
        await maxPlayers.set(`${server.ip}:${server.port}`, data);
      });
    }
  }, 3600000);
}