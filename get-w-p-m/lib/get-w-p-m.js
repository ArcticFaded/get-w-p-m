'use babel';
//var $ = require('jquery');
import GetWPMView from './get-w-p-m-view';
import { CompositeDisposable } from 'atom';

export default {

  getWPMView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    var tempos = [];
    var settings = {
       "async": true,
       "crossDomain": true,
       "url": "https://api.spotify.com/v1/users/spotify/playlists/2qlMTcW6AnnaGl7eXWAZP5/tracks",
       "method": "GET",
       "headers": {
       "authorization": "Bearer BQCrqB4VHtMRAwlFb2stoSiD3m3UmgnZ2ejpm3yxyDzmVN_9ixgFqBaxnWEabkDZI8D2NDwetVDmjaWclF-D7rrIoIIVCgxR3qFlPypHgeN9C7SuNYQQ9AkvxVSQetGNr1Rwg4xduQYuELZW9ZiGjM-VsRwZKiOYRiaRVBIZxtmNDlA-Og9pUH544g",
       "cache-control": "no-cache",
       "postman-token": "dde728fd-2680-3d2a-f910-0d4253399923"
     }
   }

   require('atom-space-pen-views').$.ajax(settings).done(function (response) {
     console.log(response);
     for (tracks in response['items']){

       var tempo = {
         "async": true,
         "crossDomain": true,
         "url": "https://api.spotify.com/v1/audio-features/" + response['items'][tracks]['track']['id'] + "",
         "method": "GET",
         "headers": {
           "authorization": "Bearer BQCrqB4VHtMRAwlFb2stoSiD3m3UmgnZ2ejpm3yxyDzmVN_9ixgFqBaxnWEabkDZI8D2NDwetVDmjaWclF-D7rrIoIIVCgxR3qFlPypHgeN9C7SuNYQQ9AkvxVSQetGNr1Rwg4xduQYuELZW9ZiGjM-VsRwZKiOYRiaRVBIZxtmNDlA-Og9pUH544g",
           "cache-control": "no-cache",
           "postman-token": "dde728fd-2680-3d2a-f910-0d4253399923"
         }
       }
       require('atom-space-pen-views').$.ajax(tempo).done(function (response) {
         var song = [response['tempo'], response['uri']];
         tempos.push(song);
       });
     }
   });

    this.getWPMView = new GetWPMView(state.getWPMViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.getWPMView.getElement(),
      visible: false
    });
    curTime = Date.now();
    var accu = 0;
    editor = atom.workspace.getActiveTextEditor();
    editor.getBuffer().onDidStopChanging( function(e){
     if(e){
       console.log(e['changes'][0]['newText'] + " " + (Date.now() - curTime)/1000);
       accu += e['changes'][0]['newText'].length;
     }
     /*v

     require('atom-space-pen-views').$.ajax({ type: "POST", url: 'http://192.168.43.150:8090/select', contentType: 'application/json', data: data, success: function(data) { console.log(data); } })
*/
     if((Date.now() - curTime)/1000 > 30){
       for (x in tempos){
         for(y in tempos){
           if(tempos[y][0] < tempos[x][0]){
             var tem = tempos[y];
             tempos[y] = tempos[x];
             tempos[x] = tem;
           }
         }
       }
       console.log(tempos);
       console.log(accu);
       if(accu > 182)
        accu = Math.floor((Math.random() * 107) + 75);
       else if(accu < 75)
        accu = Math.floor((Math.random() * 107) + 75);
       curTime = Date.now();
       for(index in tempos){
         if(accu > tempos[index][0]){
           var data = `{
             "ContentItem": {
               "source": "SPOTIFY",
               "type": "uri",
               "location": \"`+ tempos[index][1] + `\",
               "sourceAccount": "bosehack6"
             }
           }`;
           console.log(index)
           console.log(tempos[index][1]);
           require('atom-space-pen-views').$.ajax({ type: "POST", url: 'http://192.168.43.150:8090/select', contentType: 'application/json', data: data, success: function(data) { console.log(data); } });
           accu = 0;
           break;
         }
         else {
           continue;
         }
       }
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
