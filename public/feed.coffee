Application = Thorax.Application.create
  template: """
    <table>
      <tr>
        <td valign="center" align="center">
          {{layout}}
        </td>
      </tr>
    </table>
  """
$ -> $('body').append Application.el

TweetView = Application.View.extend
  content: ->
    if @model.attributes.entities?.urls?.length 
      url = @model.attributes.entities.urls[0]
      if url.expanded_url.match /\.(gif|jpeg|jpg|png)$/
        return new Handlebars.SafeString '<img src="' + url.expanded_url + '">'    
    @model.attributes.text
  template: """
    {{#if fromSignin}} {{else}}<h3>{{user.name}} <small>@{{user.screen_name}}</small></h3>{{/if}}
    <h1>{{content}}</h1>
  """

defaultTweetView = Application.View.create
  defaultContent: 'Please Sign in!<br/>app.seattlejs.com<br/><small>Tweet to display your message</small>'
  initialize: ->
    @content = @defaultContent
    setInterval =>
      @content = _.shuffle([
        'No one? Really?'
        'Tweet pictures... Backhanded comments...'
        'Will start displaying @beiber soon if no one tweets'
        'Bhueler...'
      ]).pop()
      @render()
      setTimeout =>
        @content = @defaultContent
        @render()
      , 5000
    , 60000
  template: """
    <h2>{{{content}}}</h2><h1>#seattlejs</h1>
  """

Application.setView defaultTweetView, destroy: false

defaultTimeout = null
socket = io.connect 'http://' + window.location.host
socket.on 'tweet', (tweet) ->
  tweet.fromSignin = tweet.user.screen_name is 'SeattleBackbone'
  tweetView = TweetView.create
    model: Application.Model.create(tweet)
  Application.setView tweetView, destroy: true
  console.log(tweet)
  clearTimeout defaultTimeout
  defaultTimeout = setTimeout ->
    Application.setView defaultTweetView, destroy: false
  , 30000
