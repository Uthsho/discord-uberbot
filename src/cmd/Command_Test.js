const Command = require("./Command.js");

class TestCommand extends Command {
  constructor(chatService, queueService, discord, dbService) {
    super("test");
    super.help = "for testing - duh!";
    super.usage = "<prefix>test";
    super.alias = ["test"];
    this.chatService = chatService;
    this.queueService = queueService;
    this.discord = discord;
    this.dbService = dbService;
  }

  run(payload, msg) {
    console.log("Testing...");
    this.dbService.listPlaylists().then((plNames) => {
      const embed = new this.discord.RichEmbed();
      embed.setColor(890629);
      embed.setTitle("Playlists:");
      const promisses = [];
      plNames.forEach((playlist) => {
        promisses.push(this.dbService.getPlaylist(playlist));
      });

      Promise.all(promisses).then((allplSongs) => {
        allplSongs.forEach((plSongs, index) => {
          const plLength = plSongs.length;
          embed.addField(plNames[index], `${plLength} Songs`, true);
        });
        this.chatService.richNote(msg.channel, embed);
      });
    });

  }
}

module.exports = TestCommand;