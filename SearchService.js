class SearchService {
  constructor(chatService, youtubeService, soundCloudService, spotifyService) {
    this.chatService = chatService;
    this.youtubeService = youtubeService;
    this.soundCloudService = soundCloudService;
    this.spotifyService = spotifyService;
  }

  search(payload, msg) {
    return new Promise((resolve, reject) => {
      let searchstring = payload.trim();
      if (searchstring.includes("soundcloud.com")) {
        this.chatService.simpleNote(msg.channel, "Get song from SounCloud url~", this.chatService.msgType.SEARCH);
        this.soundCloudService.getSongViaUrl(searchstring).then((song) => resolve(song)).
          catch((error) => { this.chatService.simpleNote(msg.channel, error, this.chatService.msgType.FAIL); reject(error); });
      } else if (searchstring.includes("youtu.be/") || searchstring.includes("youtube.com/")) {
      // YouTube url detected:
        if (searchstring.includes("&")) {
          searchstring = searchstring.split("&")[0];
        }
        if (searchstring.includes("watch") || searchstring.includes("youtu.be/")) {
        // YouTube video url detected:
          this.chatService.simpleNote(msg.channel, "Get song from YouTube url~", this.chatService.msgType.SEARCH);
          this.youtubeService.getSongViaUrl(searchstring).then((song) => resolve(song)).
            catch((error) => { this.chatService.simpleNote(msg.channel, error, this.chatService.msgType.FAIL); reject(error); });
        } else if (searchstring.includes("playlist")) {
        // Youtube playlist url detected:
          this.chatService.simpleNote(msg.channel, "Get songs from YouTube playlist url~", this.chatService.msgType.SEARCH);
          this.youtubeService.getSongsViaPlaylistUrl(searchstring).then((songs) => resolve(songs)).
            catch((error) => { this.chatService.simpleNote(msg.channel, error, this.chatService.msgType.FAIL); reject(error); });
        }
      } else {
      // Fallback on soundcloud query search:
        this.chatService.simpleNote(msg.channel, "Get songs from SoundCloud search query~", this.chatService.msgType.SEARCH);
        this.soundCloudService.getSongViaSearchQuery(searchstring).then((song) => resolve(song)).catch(() => {
        // Fallback on youtube query search:
          this.chatService.simpleNote(msg.channel, "Get songs from YouTube search query~", this.chatService.msgType.SEARCH);
          this.youtubeService.getSongViaSearchQuery(searchstring).then((song) => resolve(song)).catch((error) => reject(error));
        });
      }
    });
  }
}

module.exports = SearchService;