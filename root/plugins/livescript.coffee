# (c) Undoware and Elizabeth Marston, 2013, all rights reserved. 
# Contents licensed under the WTFPL, the world's most permissive license. Do as thou wilt.
# 
# The following is a quick example of how to craft a quick Wintersmith plugin for development with LiveScript. 
# It is based on the documentation that ships with Wintersmith. 
# For those that do not yet know, livescript is basically coffee-script by way of Haskell. It's awesome. livescript.net.
# Tested under Wintersmith 2.0.5, LiveScript 1.1.0 and Node v0.10.10 on Fedora 18 x86_64, using NVM for node installation. 
# Ironically, this plugin is in coffee-script, because that's what Wintersmith uses by default. 
# (Hence I'm having to reformat my comments... sigh.)
 
 
### A Wintersmith plugin. ###
 
fs = require 'fs'
ls = require 'LiveScript'
 
module.exports = (env, callback) ->
  # *env* is the current wintersmith environment
  # *callback* should be called when the plugin has finished loading
 
  class LScript extends env.ContentPlugin
 
    constructor: (@filepath, @text) ->
      console.log('')
 
    getFilename: ->
      # filename where plugin is rendered to, this plugin uses the
      @filepath.relative.replace /ls$/ , 'js'
 
    getView: -> (env, locals, contents, templates, callback) ->
      # note that this function returns a function, you can also return a string
      # to use a view already added to the env, see env.registerView for more
 
      # this view simply passes the text to the renderer
      out = ls.compile(@text)
      callback null, new Buffer(out)
 
  LScript.fromFile = (filepath, callback) ->
    fs.readFile filepath.full, (error, result) ->
      if not error?
        plugin = new LScript filepath, result.toString()
      callback error, plugin
 
  # register the plugin to intercept .txt and .text files using a glob pattern
  # the first argument is the content group the plugin will belong to
  # i.e. directory grouping, contents.somedir._.text is an array of all
  #      plugin instances beloning to the text group in somedir
  env.registerContentPlugin 'contents', '**/*.ls', LScript
 
  # tell plugin manager we are done
  callback()