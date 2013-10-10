module.exports = (env, callback) ->
  ### Paginator plugin. Defaults can be overridden in config.json
  
  defaults = {
    template: 'index.html',
    posts: 'posts',
    index: 'index.html',
  }

  # assign defaults any option not set in the config file
  options = env.config.paginator or {}
  for key, value of defaults
    options[key] ?= defaults[key]

  getPosts = (contents) ->
    # helper that returns a list of content found in *contents*
    # note that each post is assumed to have its own directory in the posts directory

    posts = [v for k,v of contents[options.posts]]
    #posts.sort (a, b) -> b.date - a.date

    # add references to prev/next to each posts
    for page, i in posts
      page.prevPage = posts[i - 1]
      page.nextPage = posts[i + 1]

    return posts

  class PaginatorPage extends env.plugins.Page
    ### a page has a list of posts ###

    (@posts) ->

    getFilename: ->
      options.index

    getView: -> (env, locals, contents, templates, callback) ->
      # simple view to pass contents to the paginator template
      # note that this function returns a function

      # get the pagination template
      template = templates[options.template]
      if not template?
        return callback(new Error("unknown paginator template '#{ options.template }'"))

      # setup the template context
      ctx = {env, contents, @posts}

      # extend the template context with the enviroment locals
      env.utils.extend(ctx, locals)

      #console.log ctx

      # finally render the template
      return template.render(ctx, callback)

    # register a generator, 'paginator' here is the content group generated content will belong to
  # i.e. contents._.paginator
  env.registerGenerator('paginator', (contents, callback) ->

    # find all contents
    posts = getPosts(contents)

    # populate pages
    page = new PaginatorPage(posts)

    # create the object that will be merged with the content tree (contents)
    # do _not_ modify the tree directly inside a generator, consider it read-only
    rv = {}
    rv['index.page'] = page

    # callback with the generated contents
    callback(null, rv)
  )

  # add the content helper to the environment so we can use it later
  env.helpers.getPosts = getPosts

  # tell the plugin manager we are done
  callback()
