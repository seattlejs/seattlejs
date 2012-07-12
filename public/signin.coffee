Application = Thorax.Application.create()
$ -> $('body').append Application.el

SigninView = Application.View.extend
  emptyInput: true
  events:
    'submit': (event) ->
      event.preventDefault()
    'keyup input[type="text"]': (event) ->
      val = $(event.target).val()
      if !val or val is ''
        @emptyInput = true
        results = []
      else 
        @emptyInput = false
        results = @members.filter (member) ->
          name = member.attributes.member.name
          name.toLowerCase().search(val.toLowerCase()) isnt -1
      @filtered.reset results
    rendered: ->
      target = @$('input[type="text"]')
      target.on 'focus', ->
        window.scrollTo 0, (target.offset().top - 5)
  signin: (event) ->
    member = $(event.target).model()
    if confirm "Sign in as #{member.attributes.name}?"
      @thankYouName = member.attributes.name
      @render()
      setTimeout =>
        @thankYouName = false
        @filtered.reset []
        @emptyInput = true
        @render()
        @$('input[type="text"]').focus()
      , 3000
      $.post '/signin?memberId=' + member.attributes.id, {}
      generateUniqueTweet member.attributes.name

  template: """
    {{#if thankYouName}}
      <div class="alert alert-success">Welcome {{thankYouName}}!</div>
    {{else}}
      <h2>Welcome to SeattleJS <small>Please sign in</small></h2>
      <form>
        <input class="input input-large" placeholder="Enter your name" type="text" autocomplete="off" autocorrect="off">
      </form>
      <table class="table table-striped table-bordered">
        {{#collection filtered tag="tbody"}}
          <tr>
            <td><img src="{{member_photo.thumb_link}}"></td>
            <td><h3>{{member.name}}</h3></td>
            <td>{{#button "signin" class="btn btn-primary btn"}}Sign In{{/button}}</td>
          </tr>
        {{else}}
          <tr><td>{{#if emptyInput}} {{else}}No matches{{/if}}</td></tr>
        {{/collection}}
      </table>
    {{/if}}
  """

Member = Application.Model.extend({})

Members = Application.Collection.extend
  model: Member
  url: '/members.json'
  parse: (data) ->
    console.log data
    data.results

members = new Members

signinView = SigninView.create
  members: members
  filtered: Application.Collection.create()

generateUniqueTweet = (name) ->
  welcome = _.shuffle([
    'Salutations to'
    'A warm welcome to'
    'A warm but professional welcome to'
    'All hail'
    'Welcome'
    'A mid-summer greetings to'
  ]).pop()
  prefix = _.shuffle([
    'Lord '
    'Sir '
    'Commander '
    ''
  ]).pop()
  suffix = _.shuffle([
    ' of House ' + _.shuffle([
      'Baratheon'
      'Harrenhal'
      'Lannister'
    ]).pop()
    ' Esquire'
    ''
    ''
    ''
  ]).pop()

  output = "#{welcome} #{prefix}#{name}#{suffix} #seattlejs"
  tweet output

tweet = (tweet) ->
  $.post '/tweet?tweet=' + encodeURIComponent(tweet), {}
  
members.fetch success: ->
  window.members = members
  Application.setView signinView, destroy: false