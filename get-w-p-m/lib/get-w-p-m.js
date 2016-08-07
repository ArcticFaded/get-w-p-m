'use babel';
//var $ = require('jquery');
import GetWPMView from './get-w-p-m-view';
import { CompositeDisposable } from 'atom';

export default {

  getWPMView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.getWPMView = new GetWPMView(state.getWPMViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.getWPMView.getElement(),
      visible: false
    });
    curTime = Date.now();
    editor = atom.workspace.getActiveTextEditor();
    editor.getBuffer().onDidStopChanging( function(e){
     if(e){
       console.log(e + " " + (Date.now() - curTime)/1000);

     }
     var settings = {
 "async": true,
 "crossDomain": true,
 "url": "https://api.spotify.com/v1/users/spotify/playlists/2qlMTcW6AnnaGl7eXWAZP5/tracks",
 "method": "GET",
 "headers": {
   "authorization": "Bearer BQBWxx-NwzyIZwfwu6eTNfNYLWZsr0vKPVmaHT6vOCbaivb7wWPWyOorCKHX8ctfTRYecAyoNcHlOjfwANNthOccfMvspz8Gpds1zZZzAXJ1w90RugoNEnR1HSAGTDmh6wmwFL5xRN7wNPsF4nIlGKaQjfd78TL4LQseka7afLmFglyZSvIXW4VpuQ",
   "cache-control": "no-cache",
   "postman-token": "dde728fd-2680-3d2a-f910-0d4253399923"
 }
}


 var ids = []
 require('atom-space-pen-views').$.ajax(settings).done(function (response) {
 console.log(response);
 for (tracks in response['items']){
   ids[tracks] = response['items'][tracks]['track']['id'] + "";
 }
});
  console.log(ids);
  console.log(ids.join(","));
  var tempo = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.spotify.com/v1/audio-features/?ids=" + ids.map(function(a){
      return a;
    }).join(","),
    "method": "GET",
    "headers": {
      "authorization": "Bearer BQBWxx-NwzyIZwfwu6eTNfNYLWZsr0vKPVmaHT6vOCbaivb7wWPWyOorCKHX8ctfTRYecAyoNcHlOjfwANNthOccfMvspz8Gpds1zZZzAXJ1w90RugoNEnR1HSAGTDmh6wmwFL5xRN7wNPsF4nIlGKaQjfd78TL4LQseka7afLmFglyZSvIXW4VpuQ",
      "cache-control": "no-cache",
      "postman-token": "dde728fd-2680-3d2a-f910-0d4253399923"
    }
  }
  require('atom-space-pen-views').$.ajax(tempo).done(function (response) {
  console.log(response);
 });


     /*var data = `{
  "ContentItem": {
    "source": "SPOTIFY",
    "type": "uri",
    "location": `+ track + `,
    "sourceAccount": "bosehack6"
  }
}`;

     require('atom-space-pen-views').$.ajax({ type: "POST", url: 'http://192.168.43.150:8090/select', contentType: 'application/json', data: data, success: function(data) { console.log(data); } })
*/
     if((Date.now() - curTime)/1000 > 30){
       curTime = Date.now();
     }
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'get-w-p-m:toggle': () => this.toggle()
    }));
  },
  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.getWPMView.destroy();
  },

  serialize() {
    return {
      getWPMViewState: this.getWPMView.serialize()
    };
  },

  toggle() {
    console.log('GetWPM was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
