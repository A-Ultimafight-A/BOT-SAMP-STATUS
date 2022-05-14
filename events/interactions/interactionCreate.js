module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  if (command.requiredPerms && !interaction.member.permissions.has(command.requiredPerms)) {
    return interaction.reply({ content: `Vous avez besoin de l'autorisation suivante pour exécuter ceci: ${'`' + command.requiredPerms + '`'}`, ephemeral: true });
  }

  await command.execute(interaction);
}